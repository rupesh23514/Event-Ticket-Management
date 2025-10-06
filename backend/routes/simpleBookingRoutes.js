import express from 'express';
import asyncHandler from 'express-async-handler';
import QRCode from 'qrcode';
import SimpleBooking from '../models/simpleBookingModel.js';
import Event from '../models/eventModel.js';
import { verifySupabaseJWT } from '../middleware/verifySupabaseJWT.js';

const router = express.Router();

/**
 * @desc    Create a new booking with QR code
 * @route   POST /api/bookings
 * @access  Private (requires Supabase JWT)
 */
router.post(
  '/',
  verifySupabaseJWT,
  asyncHandler(async (req, res) => {
    const { eventId, seats, totalAmount } = req.body;

    if (!eventId || !seats || seats.length === 0 || totalAmount === undefined) {
      res.status(400);
      throw new Error('Please provide all required fields: eventId, seats, totalAmount');
    }

    try {
      // Verify that the event exists
      const event = await Event.findById(eventId);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }

      // Check if seats are already booked (in a real app, you'd have more complex validation)
      // For simplicity, we're not implementing this check here

      // Create a new booking
      const booking = new SimpleBooking({
        userId: req.user.id, // From Supabase JWT
        eventId,
        seats,
        totalAmount,
        status: 'confirmed',
      });

      // Generate QR code data (includes bookingId and userId for verification)
      const qrData = JSON.stringify({
        bookingId: booking._id,
        userId: req.user.id,
        eventId,
        seats,
      });

      // Generate QR code as a data URL
      const qrDataUrl = await QRCode.toDataURL(qrData);
      
      // Save QR code data URL to the booking
      booking.qrDataUrl = qrDataUrl;

      // Save the booking to the database
      await booking.save();

      res.status(201).json({
        success: true,
        booking: {
          _id: booking._id,
          eventId: booking.eventId,
          seats: booking.seats,
          totalAmount: booking.totalAmount,
          status: booking.status,
          qrDataUrl,
          createdAt: booking.createdAt,
        },
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while creating the booking',
      });
    }
  })
);

/**
 * @desc    Get all bookings for the authenticated user
 * @route   GET /api/bookings
 * @access  Private (requires Supabase JWT)
 */
router.get(
  '/',
  verifySupabaseJWT,
  asyncHandler(async (req, res) => {
    const bookings = await SimpleBooking.find({ userId: req.user.id })
      .populate('eventId', 'name date venue image') // Assuming your Event model has these fields
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  })
);

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private (requires Supabase JWT)
 */
router.get(
  '/:id',
  verifySupabaseJWT,
  asyncHandler(async (req, res) => {
    const booking = await SimpleBooking.findById(req.params.id)
      .populate('eventId', 'name date venue image');

    // Check if booking exists and belongs to the authenticated user
    if (!booking || booking.userId !== req.user.id) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.json({
      success: true,
      booking,
    });
  })
);

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private (requires Supabase JWT)
 */
router.patch(
  '/:id/cancel',
  verifySupabaseJWT,
  asyncHandler(async (req, res) => {
    const booking = await SimpleBooking.findById(req.params.id);

    // Check if booking exists and belongs to the authenticated user
    if (!booking || booking.userId !== req.user.id) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  })
);

export default router;