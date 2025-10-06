import express from 'express';
import {
  approveEvent,
  getPendingEvents,
  getPlatformStats,
  updateUserRole,
  handleBookingDispute,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are admin-only
router.use(protect, authorize('admin'));

router.get('/events/pending', getPendingEvents);
router.put('/events/:id/approve', approveEvent);
router.get('/stats', getPlatformStats);
router.put('/users/:id/role', updateUserRole);
router.put('/bookings/:id/dispute', handleBookingDispute);

export default router;