import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register or authenticate user from Supabase
 * @route   POST /api/users/auth
 * @access  Public
 */
export const authUser = asyncHandler(async (req, res) => {
  const { email, name, supabaseUid, authProvider, profileImage = '' } = req.body;

  if (!email || !supabaseUid) {
    res.status(400);
    throw new Error('Email and Supabase UID are required');
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    // Update supabase UID if it's not set (for existing users)
    if (!user.supabaseUid) {
      user.supabaseUid = supabaseUid;
    }
    
    // Update auth provider if changed
    if (authProvider && user.authProvider !== authProvider) {
      user.authProvider = authProvider;
    }
    
    // Update profile image if provided
    if (profileImage && profileImage !== user.profileImage) {
      user.profileImage = profileImage;
    }
    
    // Save any changes
    if (user.isModified()) {
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      supabaseUid,
      authProvider: authProvider || 'email',
      isEmailVerified: authProvider !== 'email', // Auto-verify for social logins
      profileImage,
    });
  }

  if (user) {
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set JWT as HTTP-Only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      phoneNumber: user.phoneNumber,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.profileImage = req.body.profileImage || user.profileImage;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    // Only update email through Supabase Auth

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      phoneNumber: updatedUser.phoneNumber,
      isEmailVerified: updatedUser.isEmailVerified,
      authProvider: updatedUser.authProvider,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Request role change to organizer
 * @route   POST /api/users/request-organizer
 * @access  Private
 */
export const requestOrganizerRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.role === 'organizer') {
      res.status(400);
      throw new Error('User is already an organizer');
    }

    // In a real app, you would create a request in the database
    // and notify admin to approve it
    // For demo purposes, we'll automatically upgrade to organizer

    user.role = 'organizer';
    await user.save();

    res.json({
      message: 'Role updated to organizer successfully',
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select('-password -refreshToken')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await User.countDocuments();

  res.json({
    users,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});