import React from 'react';
import { Link } from 'react-router-dom';
import BookingStatusCard from './BookingStatusCard';

function BookingList({ bookings, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900/30 text-red-400 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <svg 
          className="h-16 w-16 mx-auto text-gray-700 mb-4"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
        <p className="text-gray-400 mb-6">You don't have any bookings yet.</p>
        <Link 
          to="/events" 
          className="inline-block bg-violet-700 hover:bg-violet-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Explore Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map(booking => (
        <BookingStatusCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

export default BookingList;