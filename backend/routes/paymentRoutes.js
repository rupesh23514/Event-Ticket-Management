import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  processRefund,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/refund', protect, processRefund);

export default router;