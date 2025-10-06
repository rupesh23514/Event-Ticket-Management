import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import mongoose from 'mongoose';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private/Organizer
 */
export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    eventDate,
    venueType,
    category,
    seatingLayout,
    ticketTiers,
    posterImage,
    refundPolicy,
    tags,
  } = req.body;

  // Validate required fields
  if (!title || !description || !location || !eventDate || !venueType || !category) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Create event with organizer set to current user
  const event = await Event.create({
    title,
    description,
    location,
    eventDate,
    venueType,
    category,
    seatingLayout,
    ticketTiers,
    posterImage,
    refundPolicy,
    tags,
    organizer: req.user._id,
    status: 'draft',
  });

  if (event) {
    res.status(201).json(event);
  } else {
    res.status(400);
    throw new Error('Invalid event data');
  }
});

/**
 * @desc    Get all published events with filters and pagination
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = { status: 'published', isApproved: true };

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query['eventDate.startDate'] = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }

  // Filter by location
  if (req.query.location) {
    query['location.city'] = { $regex: req.query.location, $options: 'i' };
  }

  // Search by title or description
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const events = await Event.find(query)
    .populate('organizer', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ 'eventDate.startDate': 1 });

  // Get total count
  const count = await Event.countDocuments(query);

  res.json({
    events,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Get event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const event = await Event.findById(req.params.id).populate('organizer', 'name');

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private/Organizer
 */
export const updateEvent = asyncHandler(async (req, res) => {
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
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this event');
  }

  // If event is already published, certain fields can't be modified
  if (event.status === 'published' && (req.body.seatingLayout || req.body.ticketTiers)) {
    res.status(400);
    throw new Error('Cannot modify seating layout or ticket tiers for published events');
  }

  // Update event fields
  Object.keys(req.body).forEach((key) => {
    event[key] = req.body[key];
  });

  // Save updated event
  const updatedEvent = await event.save();

  res.json(updatedEvent);
});

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private/Organizer/Admin
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is the organizer or admin
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this event');
  }

  // Check if event has any bookings
  // This would be implemented in a real app, preventing deletion
  // if the event has bookings already

  // Delete poster image from Cloudinary if exists
  if (event.posterImage && event.posterImage.publicId) {
    await deleteFromCloudinary(event.posterImage.publicId);
  }

  await event.remove();

  res.json({ message: 'Event removed' });
});

/**
 * @desc    Submit event for approval
 * @route   PUT /api/events/:id/submit
 * @access  Private/Organizer
 */
export const submitEventForApproval = asyncHandler(async (req, res) => {
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
    throw new Error('Not authorized to submit this event');
  }

  // Validate event has all required fields for submission
  if (
    !event.title ||
    !event.description ||
    !event.location ||
    !event.eventDate ||
    !event.venueType ||
    !event.category ||
    !event.seatingLayout ||
    !event.ticketTiers ||
    !event.posterImage
  ) {
    res.status(400);
    throw new Error('Please complete all required event details before submitting');
  }

  // Update status
  event.status = 'pending_approval';
  await event.save();

  res.json({ message: 'Event submitted for approval', event });
});

/**
 * @desc    Upload event poster image
 * @route   POST /api/events/upload
 * @access  Private/Organizer
 */
export const uploadPosterImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  try {
    const result = await uploadToCloudinary(req.file.path, 'event-posters');

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Image upload failed');
  }
});

/**
 * @desc    Block seats temporarily during booking process
 * @route   POST /api/events/:id/block-seats
 * @access  Private
 */
export const blockSeats = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const { seats } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    res.status(400);
    throw new Error('Please provide seats to block');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if any of the requested seats are already blocked or booked
  const currentTime = new Date();
  
  // Remove expired blocks
  event.blockedSeats = event.blockedSeats.filter(
    (block) => block.blockedUntil > currentTime
  );

  // Check for conflicts
  const unavailableSeats = [];
  
  for (const seat of seats) {
    // Check if seat is in blockedSeats
    const isBlocked = event.blockedSeats.some(
      (block) =>
        block.seat.row === seat.row &&
        block.seat.column === seat.column &&
        block.seat.zoneId === seat.zoneId
    );

    if (isBlocked) {
      unavailableSeats.push(seat);
    }
  }

  if (unavailableSeats.length > 0) {
    res.status(400);
    throw new Error('Some seats are already blocked or booked');
  }

  // Block seats for the specified duration
  const blockDuration = parseInt(process.env.SEAT_BLOCK_DURATION) || 10; // Default 10 minutes
  const blockUntil = new Date();
  blockUntil.setMinutes(blockUntil.getMinutes() + blockDuration);

  // Add new blocked seats
  const newBlockedSeats = seats.map((seat) => ({
    seat,
    blockedUntil: blockUntil,
    blockedBy: req.user._id,
  }));

  event.blockedSeats.push(...newBlockedSeats);
  await event.save();

  res.json({
    message: `Seats blocked for ${blockDuration} minutes`,
    blockedUntil: blockUntil,
  });
});

/**
 * @desc    Unblock previously blocked seats
 * @route   POST /api/events/:id/unblock-seats
 * @access  Private
 */
export const unblockSeats = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid event ID');
  }

  const { seats } = req.body;

  if (!seats || !Array.isArray(seats)) {
    res.status(400);
    throw new Error('Please provide seats to unblock');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Filter out the seats to unblock
  event.blockedSeats = event.blockedSeats.filter((block) => {
    return !seats.some(
      (seat) =>
        block.seat.row === seat.row &&
        block.seat.column === seat.column &&
        block.seat.zoneId === seat.zoneId &&
        block.blockedBy.toString() === req.user._id.toString()
    );
  });

  await event.save();

  res.json({ message: 'Seats unblocked successfully' });
});