import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';
import Event from '../models/eventModel.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create Stripe payment intent
 * @route   POST /api/payments/create-payment-intent
 * @access  Private
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error('Booking ID is required');
  }

  const booking = await Booking.findById(bookingId).populate('event', 'title');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verify the booking belongs to the user
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to make payment for this booking');
  }

  // Check if payment is already completed
  if (booking.paymentInfo.paymentStatus === 'completed') {
    res.status(400);
    throw new Error('Payment has already been processed for this booking');
  }

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: booking.paymentInfo.currency || 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        eventId: booking.event._id.toString(),
        userId: req.user._id.toString(),
      },
      description: `Payment for ${booking.event.title}`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Payment processing error: ${error.message}`);
  }
});

/**
 * @desc    Process successful payment
 * @route   POST /api/payments/confirm
 * @access  Private
 */
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, bookingId } = req.body;

  if (!paymentIntentId || !bookingId) {
    res.status(400);
    throw new Error('Payment Intent ID and Booking ID are required');
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verify the booking belongs to the user
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to confirm payment for this booking');
  }

  try {
    // Retrieve payment intent to verify payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error('Payment has not been completed successfully');
    }

    // Update booking with payment details
    booking.paymentInfo.paymentId = paymentIntentId;
    booking.paymentInfo.paymentMethod = 'stripe';
    booking.paymentInfo.paymentStatus = 'completed';
    booking.paymentInfo.paymentDate = new Date();
    booking.paymentInfo.receiptUrl = paymentIntent.charges.data[0]?.receipt_url || '';
    
    // Update booking status
    booking.status = 'confirmed';

    await booking.save();

    // Send confirmation email
    await sendBookingConfirmation(booking);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      booking,
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Payment confirmation error: ${error.message}`);
  }
});

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/webhook/stripe
 * @access  Public
 */
export const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update booking if not already updated
      if (paymentIntent.metadata && paymentIntent.metadata.bookingId) {
        const booking = await Booking.findById(paymentIntent.metadata.bookingId);
        
        if (booking && booking.status !== 'confirmed') {
          booking.paymentInfo.paymentId = paymentIntent.id;
          booking.paymentInfo.paymentMethod = 'stripe';
          booking.paymentInfo.paymentStatus = 'completed';
          booking.paymentInfo.paymentDate = new Date();
          booking.status = 'confirmed';
          
          await booking.save();
          
          // Send confirmation email
          await sendBookingConfirmation(booking);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update booking status
      if (failedPayment.metadata && failedPayment.metadata.bookingId) {
        const booking = await Booking.findById(failedPayment.metadata.bookingId);
        
        if (booking && booking.status === 'pending') {
          booking.paymentInfo.paymentStatus = 'failed';
          await booking.save();
        }
      }
      break;
      
    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

/**
 * @desc    Process refund
 * @route   POST /api/payments/refund
 * @access  Private/Admin or user (if policy allows)
 */
export const processRefund = asyncHandler(async (req, res) => {
  const { bookingId, amount, reason } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error('Booking ID is required');
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized (admin or booking owner)
  const isAdmin = req.user.role === 'admin';
  const isOwner = booking.user.toString() === req.user._id.toString();
  
  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to process refund');
  }

  // Check if booking is eligible for refund
  if (booking.status !== 'confirmed') {
    res.status(400);
    throw new Error('Only confirmed bookings can be refunded');
  }
  
  if (!booking.paymentInfo.paymentId) {
    res.status(400);
    throw new Error('No payment found for this booking');
  }

  // Get event to check refund policy
  const event = await Event.findById(booking.event);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check refund policy if user is not admin
  if (!isAdmin) {
    // Check if event has started
    const currentDate = new Date();
    if (new Date(event.eventDate.startDate) < currentDate) {
      res.status(400);
      throw new Error('Cannot refund after event has started');
    }
    
    // Apply refund policy
    if (event.refundPolicy === 'no_refund') {
      res.status(400);
      throw new Error('This event does not allow refunds');
    }
  }

  try {
    // Calculate refund amount
    const refundAmount = amount || booking.totalAmount;
    
    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentInfo.paymentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
    });

    // Update booking with refund details
    booking.status = refundAmount === booking.totalAmount ? 'refunded' : 'partial_refund';
    booking.refundInfo = {
      refundId: refund.id,
      refundAmount: refundAmount,
      refundDate: new Date(),
      refundStatus: 'completed',
    };

    await booking.save();

    // Update event ticket count
    if (booking.status === 'refunded') {
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

      await event.save();
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: refund.status,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Refund processing error: ${error.message}`);
  }
});