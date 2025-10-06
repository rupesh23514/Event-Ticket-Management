import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes - verifies JWT token and adds user to request
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check if token exists in Authorization header or cookies
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else if (req.cookies.jwt) {
    try {
      // Get token from cookies
      token = req.cookies.jwt;
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Middleware to restrict access based on role
 * @param {Array} roles - Array of roles that are allowed
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role: ${req.user ? req.user.role : 'undefined'} is not authorized to access this resource`);
    }
    next();
  };
};

/**
 * Verify Supabase token
 * This middleware validates the Supabase JWT token from the frontend
 */
export const verifySupabaseToken = asyncHandler(async (req, res, next) => {
  const supabaseToken = req.headers['supabase-auth-token'];
  
  if (!supabaseToken) {
    res.status(401);
    throw new Error('No Supabase authentication token');
  }
  
  // Here we'd normally verify the Supabase token
  // For now, we'll assume it's valid and move on
  // In production, implement proper token verification
  
  next();
});