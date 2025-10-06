import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import BookMyShowLayout from './layouts/BookMyShowLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import BookMyShowStyleEventPage from './pages/events/BookMyShowStyleEventPage';
import BookMyShowStyleEventDetail from './pages/events/BookMyShowStyleEventDetail';
import BookMyShowHomePage from './pages/BookMyShowHomePage';
import LoginPage from './pages/LoginPage';
import BookMyShowLoginPage from './pages/BookMyShowLoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import ResendVerificationPage from './pages/ResendVerificationPage';
import SignOutPage from './pages/SignOutPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/user/Dashboard';
import ProfilePage from './pages/user/ProfilePage';
import CheckoutPage from './pages/booking/CheckoutPage';
import SimpleBookingPage from './pages/booking/SimpleBookingPage';
import BookMyShowCheckoutPage from './pages/booking/BookMyShowCheckoutPage';
import BookingStatusPage from './pages/booking/BookingStatusPage';
import MyBookingsPage from './pages/booking/MyBookingsPage';
import SupabaseDiagnostic from './pages/SupabaseDiagnostic';

// Organizer Pages
import EventCreatePage from './pages/organizer/EventCreatePage';
import EventManagementPage from './pages/organizer/EventManagementPage';
import RequestOrganizerPage from './pages/organizer/RequestOrganizerPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<BookMyShowLayout />}>
              <Route index element={<BookMyShowHomePage />} />
              <Route path="original-home" element={<HomePage />} />
              <Route path="events" element={<BookMyShowStyleEventPage />} />
              <Route path="events/:eventId" element={<BookMyShowStyleEventDetail />} />
              {/* Add redirect route for backward compatibility */}
              <Route path="events/:id" element={<BookMyShowStyleEventDetail />} />
              <Route path="login" element={<BookMyShowLoginPage />} />
              <Route path="original-login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="verification" element={<VerificationPage />} />
              <Route path="resend-verification" element={<ResendVerificationPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="signout" element={<SignOutPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />
              <Route path="supabase-test" element={<SupabaseDiagnostic />} />
              <Route path="checkout/:eventId" element={<BookMyShowCheckoutPage />} />
              <Route path="simple-booking/:eventId" element={<SimpleBookingPage />} />
              <Route path="original-checkout/:eventId" element={<CheckoutPage />} />
              <Route path="booking-status/:bookingId" element={<BookingStatusPage />} />
            </Route>

            {/* Protected routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="bookings" element={<MyBookingsPage />} />
              <Route path="request-organizer" element={<RequestOrganizerPage />} />
              <Route path="events" element={<EventManagementPage />} />
              <Route path="events/create" element={<EventCreatePage />} />
            </Route>
            
            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}