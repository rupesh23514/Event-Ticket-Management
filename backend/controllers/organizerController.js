import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import Booking from '../models/bookingModel.js';
import mongoose from 'mongoose';
import csv from 'fast-csv';
import { stringify } from 'csv-stringify/sync';

/**
 * @desc    Get all events for the organizer
 * @route   GET /api/organizer/events
 * @access  Private/Organizer
 */
export const getOrganizerEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter by status if provided
  const statusFilter = req.query.status ? { status: req.query.status } : {};

  const events = await Event.find({
    organizer: req.user._id,
    ...statusFilter,
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await Event.countDocuments({
    organizer: req.user._id,
    ...statusFilter,
  });

  res.json({
    events,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Get event performance metrics
 * @route   GET /api/organizer/events/:id/metrics
 * @access  Private/Organizer
 */
export const getEventMetrics = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is the organizer
  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this event data');
  }

  // Get booking statistics
  const totalBookings = await Booking.countDocuments({
    event: event._id,
    status: { $in: ['confirmed', 'partial_refund'] },
  });

  const totalRevenue = await Booking.aggregate([
    {
      $match: {
        event: mongoose.Types.ObjectId(event._id),
        status: { $in: ['confirmed', 'partial_refund'] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' },
      },
    },
  ]);

  // Calculate ticket sales by tier
  const ticketSalesByTier = [];
  for (const tier of event.ticketTiers) {
    const tierTickets = await Booking.aggregate([
      {
        $match: {
          event: mongoose.Types.ObjectId(event._id),
          status: { $in: ['confirmed', 'partial_refund'] },
          'tickets.ticketTier': tier.name,
        },
      },
      {
        $unwind: '$tickets',
      },
      {
        $match: {
          'tickets.ticketTier': tier.name,
        },
      },
      {
        $group: {
          _id: '$tickets.ticketTier',
          count: { $sum: 1 },
          revenue: { $sum: '$tickets.price' },
        },
      },
    ]);

    ticketSalesByTier.push({
      name: tier.name,
      sold: tier.quantitySold,
      total: tier.quantity,
      available: tier.quantity - tier.quantitySold,
      revenue: tierTickets.length > 0 ? tierTickets[0].revenue : 0,
    });
  }

  // Get daily sales trend for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailySales = await Booking.aggregate([
    {
      $match: {
        event: mongoose.Types.ObjectId(event._id),
        status: { $in: ['confirmed', 'partial_refund'] },
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        bookings: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.json({
    event: {
      _id: event._id,
      title: event.title,
      status: event.status,
      totalSeats: event.availableSeats.total,
      soldSeats: event.availableSeats.sold,
      availableSeats: event.availableSeats.available,
    },
    sales: {
      totalBookings,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      byTier: ticketSalesByTier,
      dailyTrend: dailySales,
    },
  });
});

/**
 * @desc    Export attendee list
 * @route   GET /api/organizer/events/:id/attendees/export
 * @access  Private/Organizer
 */
export const exportAttendeeList = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is the organizer
  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this event data');
  }

  // Get all bookings for the event
  const bookings = await Booking.find({
    event: event._id,
    status: { $in: ['confirmed', 'partial_refund'] },
  }).populate('user', 'name email');

  // Format data for CSV
  const attendees = [];
  
  bookings.forEach(booking => {
    booking.tickets.forEach(ticket => {
      attendees.push({
        Name: booking.contactInfo.name,
        Email: booking.contactInfo.email,
        Phone: booking.contactInfo.phone || 'N/A',
        TicketType: ticket.ticketTier,
        TicketNumber: ticket.ticketNumber,
        Seat: ticket.seat ? `Row ${ticket.seat.row}, Col ${ticket.seat.column}` : 'N/A',
        Price: `$${ticket.price.toFixed(2)}`,
        BookingDate: new Date(booking.createdAt).toLocaleDateString(),
        Status: booking.status,
        Scanned: ticket.isScanned ? 'Yes' : 'No',
      });
    });
  });

  // Generate CSV
  const csvData = stringify(attendees, { header: true });
  
  // Set response headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=attendees-${event._id}.csv`);
  
  // Send CSV data
  res.send(csvData);
});

/**
 * @desc    Get event bookings
 * @route   GET /api/organizer/events/:id/bookings
 * @access  Private/Organizer
 */
export const getEventBookings = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is the organizer
  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this event data');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter by status if provided
  const statusFilter = req.query.status ? { status: req.query.status } : {};

  const bookings = await Booking.find({
    event: event._id,
    ...statusFilter,
  })
    .populate('user', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await Booking.countDocuments({
    event: event._id,
    ...statusFilter,
  });

  res.json({
    bookings,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Scan ticket QR code
 * @route   POST /api/organizer/tickets/scan
 * @access  Private/Organizer
 */
export const scanTicket = asyncHandler(async (req, res) => {
  const { ticketNumber, eventId } = req.body;

  if (!ticketNumber || !eventId) {
    res.status(400);
    throw new Error('Ticket number and event ID are required');
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  // Find the event
  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is the organizer
  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to scan tickets for this event');
  }

  // Find the booking with the ticket
  const booking = await Booking.findOne({
    event: eventId,
    'tickets.ticketNumber': ticketNumber,
    status: { $in: ['confirmed', 'partial_refund'] },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Ticket not found or not valid for this event');
  }

  // Find the specific ticket
  const ticketIndex = booking.tickets.findIndex(
    (ticket) => ticket.ticketNumber === ticketNumber
  );

  if (ticketIndex === -1) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Check if ticket is already scanned
  if (booking.tickets[ticketIndex].isScanned) {
    return res.status(400).json({
      success: false,
      message: 'Ticket has already been scanned',
      scannedAt: booking.tickets[ticketIndex].scannedAt,
    });
  }

  // Mark ticket as scanned
  booking.tickets[ticketIndex].isScanned = true;
  booking.tickets[ticketIndex].scannedAt = new Date();
  booking.tickets[ticketIndex].scannedBy = req.user._id;

  await booking.save();

  res.json({
    success: true,
    message: 'Ticket validated successfully',
    ticket: {
      ticketNumber,
      ticketTier: booking.tickets[ticketIndex].ticketTier,
      seat: booking.tickets[ticketIndex].seat,
      attendee: booking.contactInfo.name,
      email: booking.contactInfo.email,
    },
  });
});