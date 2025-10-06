import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Approve or reject event
 * @route   PUT /api/admin/events/:id/approve
 * @access  Private/Admin
 */
export const approveEvent = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const { approve, feedback } = req.body;
  
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.status !== 'pending_approval') {
    res.status(400);
    throw new Error('Event is not pending approval');
  }

  if (approve) {
    event.status = 'published';
    event.isApproved = true;
    event.approvedBy = req.user._id;
    event.approvalDate = new Date();
  } else {
    event.status = 'draft';
    event.isApproved = false;
  }

  // Add admin feedback
  if (feedback) {
    if (!event.additionalInfo) event.additionalInfo = {};
    event.additionalInfo.adminFeedback = feedback;
  }

  await event.save();

  res.json({
    message: approve ? 'Event approved and published' : 'Event returned to draft',
    event,
  });
});

/**
 * @desc    Get all pending approval events
 * @route   GET /api/admin/events/pending
 * @access  Private/Admin
 */
export const getPendingEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const events = await Event.find({ status: 'pending_approval' })
    .populate('organizer', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await Event.countDocuments({ status: 'pending_approval' });

  res.json({
    events,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Get platform statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getPlatformStats = asyncHandler(async (req, res) => {
  // Get date range (default: last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (req.query.days || 30));

  // Get user stats
  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  const organizers = await User.countDocuments({ role: 'organizer' });

  // Get event stats
  const totalEvents = await Event.countDocuments();
  const publishedEvents = await Event.countDocuments({ status: 'published' });
  const upcomingEvents = await Event.countDocuments({
    'eventDate.startDate': { $gte: new Date() },
    status: 'published',
  });
  const pendingApproval = await Event.countDocuments({ status: 'pending_approval' });

  // Get booking stats
  const totalBookings = await Booking.countDocuments();
  const recentBookings = await Booking.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  
  // Get revenue stats
  const revenue = await Booking.aggregate([
    {
      $match: {
        status: 'confirmed',
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' },
      },
    },
  ]);

  const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

  // Get revenue by event category
  const revenueByCategory = await Booking.aggregate([
    {
      $match: { status: 'confirmed' },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventDetails',
      },
    },
    {
      $unwind: '$eventDetails',
    },
    {
      $group: {
        _id: '$eventDetails.category',
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 },
      },
    },
    {
      $sort: { revenue: -1 },
    },
  ]);

  res.json({
    users: {
      total: totalUsers,
      new: newUsers,
      organizers,
    },
    events: {
      total: totalEvents,
      published: publishedEvents,
      upcoming: upcomingEvents,
      pendingApproval,
    },
    bookings: {
      total: totalBookings,
      recent: recentBookings,
    },
    revenue: {
      total: totalRevenue,
      byCategory: revenueByCategory,
    },
    period: {
      start: startDate,
      end: endDate,
      days: req.query.days || 30,
    },
  });
});

/**
 * @desc    Manage user roles
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid user ID');
  }

  const { role } = req.body;

  if (!role || !['user', 'organizer', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Valid role is required');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.json({
    message: `User role updated to ${role}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Handle dispute/refund for a booking
 * @route   PUT /api/admin/bookings/:id/dispute
 * @access  Private/Admin
 */
export const handleBookingDispute = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid booking ID');
  }

  const { action, reason } = req.body;

  if (!action || !['refund', 'deny', 'partial_refund'].includes(action)) {
    res.status(400);
    throw new Error('Valid action is required');
  }

  if (action === 'partial_refund' && !req.body.amount) {
    res.status(400);
    throw new Error('Refund amount is required for partial refund');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'confirmed' && booking.status !== 'disputed') {
    res.status(400);
    throw new Error('Booking is not eligible for dispute handling');
  }

  // Handle based on action
  switch (action) {
    case 'refund':
      // For a real app, process refund via payment processor here
      booking.status = 'refunded';
      booking.refundInfo = {
        refundAmount: booking.totalAmount,
        refundDate: new Date(),
        refundStatus: 'completed',
      };
      break;
      
    case 'partial_refund':
      // For a real app, process partial refund via payment processor here
      booking.status = 'partial_refund';
      booking.refundInfo = {
        refundAmount: req.body.amount,
        refundDate: new Date(),
        refundStatus: 'completed',
      };
      break;
      
    case 'deny':
      booking.status = 'confirmed'; // Keep as confirmed
      
      // Add admin resolution note
      if (!booking.additionalInfo) booking.additionalInfo = {};
      booking.additionalInfo.disputeResolution = 'denied';
      break;
  }

  // Add reason
  if (reason) {
    if (!booking.additionalInfo) booking.additionalInfo = {};
    booking.additionalInfo.disputeReason = reason;
    booking.additionalInfo.resolvedBy = req.user._id;
    booking.additionalInfo.resolvedAt = new Date();
  }

  await booking.save();

  res.json({
    message: `Booking dispute handled with action: ${action}`,
    booking,
  });
});