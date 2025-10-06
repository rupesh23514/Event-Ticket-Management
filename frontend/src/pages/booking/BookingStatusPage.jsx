import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function BookingStatusPage() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you'd fetch from your API
        setTimeout(() => {
          // Mock data for booking details
          const mockBooking = {
            id: bookingId,
            userId: user?.id || 'user_123',
            userName: user?.user_metadata?.fullName || 'Raj Kumar',
            eventId: 'evt_001',
            eventName: 'Chennai Music Festival',
            eventDate: '2025-11-15T18:00:00',
            eventLocation: 'Music Academy, Chennai',
            ticketType: 'VIP',
            ticketCount: 2,
            seatNumbers: ['A12', 'A13'],
            totalAmount: 2500,
            paymentMethod: 'Credit Card',
            paymentStatus: ['pending', 'completed', 'failed', 'refunded'][Math.floor(Math.random() * 4)],
            bookingStatus: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
            bookingDate: '2025-10-15T14:32:00',
            transactionId: 'txn_89012345',
            qrCode: 'https://example.com/qrcode/booking-123456.png',
            ticketsPdf: 'https://example.com/tickets/booking-123456.pdf'
          };
          
          setBooking(mockBooking);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch booking details');
        setIsLoading(false);
        console.error('Error fetching booking:', err);
      }
    };

    fetchBookingDetails();
  }, [bookingId, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-900/30 text-red-400 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Booking not found'}</p>
          <Link to="/dashboard/bookings" className="inline-block mt-4 text-white bg-violet-700 hover:bg-violet-600 px-4 py-2 rounded-lg">
            Return to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'text-green-400 bg-green-900/20 border-green-900/30';
      case 'pending':
        return 'text-amber-400 bg-amber-900/20 border-amber-900/30';
      case 'cancelled':
      case 'failed':
        return 'text-red-400 bg-red-900/20 border-red-900/30';
      case 'refunded':
        return 'text-blue-400 bg-blue-900/20 border-blue-900/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-900/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cancelled':
      case 'failed':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'refunded':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const bookingStatusClass = getStatusColor(booking.bookingStatus);
  const paymentStatusClass = getStatusColor(booking.paymentStatus);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link to="/dashboard/bookings" className="text-violet-400 hover:text-violet-300">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-white">Booking Details</h1>
      </div>

      {/* Status Card */}
      <div className={`border rounded-xl p-6 ${bookingStatusClass}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-black/20">
            {getStatusIcon(booking.bookingStatus)}
          </div>
          <div>
            <h2 className="text-xl font-bold capitalize">{booking.bookingStatus}</h2>
            <p className="opacity-80">Booking #{booking.id}</p>
          </div>
        </div>
        
        {booking.bookingStatus === 'pending' && (
          <p className="mt-3">Your booking is being processed. We'll update you once it's confirmed.</p>
        )}
        
        {booking.bookingStatus === 'confirmed' && (
          <p className="mt-3">Your booking has been confirmed. We look forward to seeing you at the event!</p>
        )}
        
        {booking.bookingStatus === 'completed' && (
          <p className="mt-3">Thank you for attending the event. We hope you had a great time!</p>
        )}
        
        {booking.bookingStatus === 'cancelled' && (
          <p className="mt-3">Your booking has been cancelled. Please contact support for more information.</p>
        )}
      </div>

      {/* Event Details Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Event Name</h3>
            <p className="text-white mt-1">{booking.eventName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Date & Time</h3>
            <p className="text-white mt-1">{formatDate(booking.eventDate)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Location</h3>
            <p className="text-white mt-1">{booking.eventLocation}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Ticket Type</h3>
            <p className="text-white mt-1">{booking.ticketType}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Quantity</h3>
            <p className="text-white mt-1">{booking.ticketCount} tickets</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Seats</h3>
            <p className="text-white mt-1">{booking.seatNumbers.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Payment Details Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Amount</h3>
            <p className="text-white mt-1">₹{booking.totalAmount.toLocaleString()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Payment Method</h3>
            <p className="text-white mt-1">{booking.paymentMethod}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Transaction ID</h3>
            <p className="text-white mt-1">{booking.transactionId}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Payment Status</h3>
            <p className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusClass}`}>
              {booking.paymentStatus.toUpperCase()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Booking Date</h3>
            <p className="text-white mt-1">{formatDate(booking.bookingDate)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {booking.bookingStatus === 'confirmed' && (
            <>
              <a 
                href={booking.ticketsPdf} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-700 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Tickets
              </a>
              
              <button 
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Tickets
              </button>
            </>
          )}
          
          {booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'completed' && (
            <button 
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cancel Booking
            </button>
          )}
          
          <button 
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingStatusPage;