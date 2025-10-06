import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Can also check for a specific role
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Check if user is an admin
      const isAdmin = 
        user.role === 'admin' || 
        user.user_metadata?.role === 'admin';

      // If user is admin and trying to access regular user dashboard,
      // we'll still authorize them but will handle redirect in the return section
      
      // Check if role is required and user has that role
      if (requiredRole && user.role !== requiredRole) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // User is authenticated and has required role if specified
      setIsAuthorized(true);
      setIsChecking(false);
    }
  }, [user, loading, requiredRole]);

  if (loading || isChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirect to login or unauthorized page
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      // User is logged in but doesn't have required role
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Check if user is admin and redirect to admin dashboard if needed
  // This happens when an admin logs in through the normal login but tries to access user dashboard
  const isAdmin = user.role === 'admin' || user.user_metadata?.role === 'admin';
  const isAccessingDashboardRoot = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  
  if (isAdmin && isAccessingDashboardRoot) {
    console.log("Admin accessing user dashboard, redirecting to admin dashboard");
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;