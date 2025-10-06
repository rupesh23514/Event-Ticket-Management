import express from 'express';
import { stripeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// This route needs raw body for Stripe signature verification
router.post('/', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;