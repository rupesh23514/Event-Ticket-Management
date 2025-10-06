import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ message: "Please login with admin credentials to access the admin dashboard" }} />;
  }

  // Check for admin role in various locations based on authentication method
  const isAdmin = 
    (user.user_metadata?.role === 'admin') || 
    (user.role === 'admin') ||
    // For Supabase response format
    (user.data?.user?.user_metadata?.role === 'admin') ||
    // For direct authentication
    (user.email === 'admin@example.com');
    
  if (!isAdmin) {
    console.log('User is not an admin:', user);
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default AdminProtectedRoute;