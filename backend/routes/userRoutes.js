import express from 'express';
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  requestOrganizerRole,
  logoutUser,
  getUsers,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/auth', authUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/request-organizer', protect, requestOrganizerRole);
router.post('/logout', protect, logoutUser);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);

export default router;