import React from 'react';
import { Link } from 'react-router-dom';

function BookingStatusCard({ booking }) {
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
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cancelled':
      case 'failed':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'refunded':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const bookingStatusClass = getStatusColor(booking.status);
  const paymentStatusClass = getStatusColor(booking.paymentStatus);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full ${bookingStatusClass.replace('text-', 'bg-').replace('/20', '/40')}`}>
              {getStatusIcon(booking.status)}
            </div>
            <h3 className="text-lg font-bold text-white">{booking.eventName}</h3>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bookingStatusClass}`}>
            {booking.status.toUpperCase()}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-400">Date & Time</p>
            <p className="text-white">{formatDate(booking.eventDate)}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Booking ID</p>
            <p className="text-white">{booking.id}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Tickets</p>
            <p className="text-white">
              {booking.tickets && booking.tickets.map((ticket, index) => (
                <span key={index}>
                  {index > 0 && ", "}{ticket.quantity} × {ticket.type}
                </span>
              ))}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400">Amount</p>
            <p className="text-white">₹{booking.totalAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusClass}`}>
            <span className="mr-1">Payment:</span> {booking.paymentStatus.toUpperCase()}
          </div>
          
          <Link 
            to={`/booking-status/${booking.id}`}
            className="text-violet-400 hover:text-violet-300 font-medium text-sm flex items-center"
          >
            View Details
            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="bg-black/30 p-4 border-t border-gray-800">
        <div className="flex items-center text-xs">
          <div className={`flex-1 flex flex-col items-center ${booking.status !== 'cancelled' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className="h-2 w-2 rounded-full bg-current mb-1"></div>
            <span>Booked</span>
          </div>
          
          <div className={`flex-1 h-px ${booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-400' : 'bg-gray-700'}`}></div>
          
          <div className={`flex-1 flex flex-col items-center ${booking.status === 'confirmed' || booking.status === 'completed' ? 'text-green-400' : booking.status === 'pending' ? 'text-amber-400' : 'text-gray-500'}`}>
            <div className="h-2 w-2 rounded-full bg-current mb-1"></div>
            <span>Confirmed</span>
          </div>
          
          <div className={`flex-1 h-px ${booking.status === 'completed' ? 'bg-green-400' : 'bg-gray-700'}`}></div>
          
          <div className={`flex-1 flex flex-col items-center ${booking.status === 'completed' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className="h-2 w-2 rounded-full bg-current mb-1"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingStatusCard;