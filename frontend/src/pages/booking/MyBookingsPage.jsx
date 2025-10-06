import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BookingList from '../../components/booking/BookingList';
import MainLayout from '../../layouts/MainLayout';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      // For development/testing - using mock data
      // In production, uncomment the API call below
      
      /*
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('/api/bookings/user');
        setBookings(response.data);
        setFilteredBookings(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch your bookings. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching bookings:', err);
      }
      */
      
      // Mock data for development/testing
      setTimeout(() => {
        const mockBookings = [
        {
          id: 'bk123456',
          eventId: 'evt001',
          eventName: 'Summer Music Festival 2023',
          eventImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
          eventDate: '2023-07-15T18:00:00.000Z',
          eventLocation: 'Central Park, New York',
          bookingDate: '2023-05-10T14:30:00.000Z',
          totalAmount: 129.99,
          status: 'confirmed',
          paymentStatus: 'paid',
          tickets: [
            { type: 'VIP', quantity: 1, price: 99.99 },
            { type: 'Regular', quantity: 1, price: 30.00 }
          ]
        },
        {
          id: 'bk123457',
          eventId: 'evt002',
          eventName: 'Tech Conference 2023',
          eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
          eventDate: '2023-09-22T09:00:00.000Z', 
          eventLocation: 'Convention Center, San Francisco',
          bookingDate: '2023-05-08T10:45:00.000Z',
          totalAmount: 199.99,
          status: 'pending',
          paymentStatus: 'awaiting',
          tickets: [
            { type: 'Full Access', quantity: 1, price: 199.99 }
          ]
        },
        {
          id: 'bk123458',
          eventId: 'evt003',
          eventName: 'Comedy Night Special',
          eventImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
          eventDate: '2023-06-30T20:00:00.000Z',
          eventLocation: 'Laugh Factory, Chicago',
          bookingDate: '2023-05-01T19:15:00.000Z',
          totalAmount: 49.99,
          status: 'cancelled',
          paymentStatus: 'refunded',
          cancellationReason: 'Schedule conflict',
          tickets: [
            { type: 'Premium', quantity: 2, price: 24.99 }
          ]
        },
      ];
      
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">My Bookings</h1>
          
          <div className="inline-block relative">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded-lg appearance-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <BookingList 
            bookings={filteredBookings} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default MyBookingsPage;