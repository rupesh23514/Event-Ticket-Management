import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Event from '../models/eventModel.js';
import mongoose from 'mongoose';
import { generateQRCode } from '../utils/qrCode.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, tickets, contactInfo } = req.body;

  if (!eventId || !tickets || !Array.isArray(tickets) || tickets.length === 0 || !contactInfo) {
    res.status(400);
    throw new Error('Please provide all required booking information');
  }

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.status !== 'published') {
    res.status(400);
    throw new Error('Event is not available for booking');
  }

  // Validate tickets availability and calculate total amount
  let totalAmount = 0;
  const processedTickets = [];

  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Process each ticket
    for (const ticket of tickets) {
      const { ticketTier, seat } = ticket;

      // Find the corresponding ticket tier
      const tier = event.ticketTiers.find((t) => t.name === ticketTier);
      
      if (!tier) {
        throw new Error(`Ticket tier "${ticketTier}" not found`);
      }

      if (tier.quantitySold >= tier.quantity) {
        throw new Error(`Ticket tier "${ticketTier}" is sold out`);
      }

      // For seated events, validate and unblock the seat
      if (seat && seat.row !== undefined && seat.column !== undefined) {
        // Check if seat exists in the right zone
        const zone = event.seatingLayout.zones.find((z) => z._id.toString() === seat.zoneId);
        
        if (!zone) {
          throw new Error(`Zone not found for seat`);
        }

        const seatExists = zone.seats.some((s) => s.row === seat.row && s.column === seat.column);
        
        if (!seatExists) {
          throw new Error(`Invalid seat selected`);
        }

        // Check if seat is blocked by current user
        const seatBlock = event.blockedSeats.find(
          (block) =>
            block.seat.row === seat.row &&
            block.seat.column === seat.column &&
            block.seat.zoneId === seat.zoneId &&
            block.blockedBy.toString() === req.user._id.toString()
        );

        if (!seatBlock) {
          throw new Error(`Seat is not reserved for you or reservation expired`);
        }

        // Remove this seat from blocked seats
        event.blockedSeats = event.blockedSeats.filter(
          (block) =>
            !(
              block.seat.row === seat.row &&
              block.seat.column === seat.column &&
              block.seat.zoneId === seat.zoneId
            )
        );
      }

      // Generate QR code
      const qrCode = await generateQRCode(`${eventId}-${req.user._id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);

      // Add ticket to processed tickets
      processedTickets.push({
        ticketTier,
        seat,
        price: tier.price,
        qrCode,
        ticketNumber: `TIX-${Math.floor(100000 + Math.random() * 900000)}`, // Will be replaced by pre-save hook
      });

      // Increase total amount
      totalAmount += tier.price;

      // Update ticket tier quantity sold
      tier.quantitySold += 1;
    }

    // Update event
    event.totalTicketsSold += tickets.length;
    event.totalRevenue += totalAmount;
    
    // Check if event is now sold out
    const allTiersSoldOut = event.ticketTiers.every((tier) => tier.quantitySold >= tier.quantity);
    if (allTiersSoldOut) {
      event.status = 'sold_out';
    }

    await event.save({ session });

    // Create booking
    const booking = await Booking.create(
      [
        {
          user: req.user._id,
          event: eventId,
          tickets: processedTickets,
          totalAmount,
          status: 'pending', // Will be updated after payment
          contactInfo: {
            name: contactInfo.name || req.user.name,
            email: contactInfo.email || req.user.email,
            phone: contactInfo.phone,
          },
          specialRequirements: req.body.specialRequirements,
          bookingDate: new Date(),
          paymentInfo: {
            amount: totalAmount,
            currency: 'USD', // Default currency
          },
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(booking[0]);
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * @desc    Get all bookings for logged in user
 * @route   GET /api/bookings
 * @access  Private
 */
export const getUserBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const bookings = await Booking.find({ user: req.user._id })
    .populate('event', 'title eventDate.startDate posterImage')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await Booking.countDocuments({ user: req.user._id });

  res.json({
    bookings,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid booking ID');
  }

  const booking = await Booking.findById(req.params.id).populate(
    'event',
    'title description location eventDate posterImage organizer'
  );

  if (booking) {
    // Check if user is authorized to view this booking
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      booking.event.organizer.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.json(booking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid booking ID');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to cancel this booking
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled' || booking.status === 'refunded') {
    res.status(400);
    throw new Error('Booking is already cancelled or refunded');
  }

  // Get event to check refund policy
  const event = await Event.findById(booking.event);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if event has already started
  const currentDate = new Date();
  if (new Date(event.eventDate.startDate) < currentDate) {
    res.status(400);
    throw new Error('Cannot cancel booking for an event that has already started');
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    
    await booking.save({ session });

    // Update event stats
    event.totalTicketsSold -= booking.tickets.length;
    
    // Update ticket tiers
    for (const ticket of booking.tickets) {
      const tierIndex = event.ticketTiers.findIndex((tier) => tier.name === ticket.ticketTier);
      if (tierIndex !== -1) {
        event.ticketTiers[tierIndex].quantitySold -= 1;
      }
    }

    // If event was sold out, update status back to published
    if (event.status === 'sold_out') {
      event.status = 'published';
    }

    await event.save({ session });

    // For a real app, initiate refund process here based on the event's refund policy
    
    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500);
    throw new Error('Booking cancellation failed');
  }
});

/**
 * @desc    Update booking payment status (after successful payment)
 * @route   PUT /api/bookings/:id/payment
 * @access  Private
 */
export const updateBookingPayment = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid booking ID');
  }

  const { paymentId, paymentMethod, receiptUrl } = req.body;

  if (!paymentId || !paymentMethod) {
    res.status(400);
    throw new Error('Payment information required');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  // Update payment information
  booking.paymentInfo.paymentId = paymentId;
  booking.paymentInfo.paymentMethod = paymentMethod;
  booking.paymentInfo.paymentStatus = 'completed';
  booking.paymentInfo.paymentDate = new Date();
  booking.paymentInfo.receiptUrl = receiptUrl;
  
  // Update booking status
  booking.status = 'confirmed';

  await booking.save();
  
  // Send confirmation email
  try {
    await sendBookingConfirmation(booking);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }

  res.json({
    message: 'Payment updated successfully',
    booking,
  });
});