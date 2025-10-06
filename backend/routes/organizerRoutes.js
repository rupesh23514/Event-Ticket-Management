import express from 'express';
import {
  getOrganizerEvents,
  getEventMetrics,
  exportAttendeeList,
  getEventBookings,
  scanTicket,
} from '../controllers/organizerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are organizer-only
router.use(protect, authorize('organizer', 'admin'));

router.get('/events', getOrganizerEvents);
router.get('/events/:id/metrics', getEventMetrics);
router.get('/events/:id/attendees/export', exportAttendeeList);
router.get('/events/:id/bookings', getEventBookings);
router.post('/tickets/scan', scanTicket);

export default router;