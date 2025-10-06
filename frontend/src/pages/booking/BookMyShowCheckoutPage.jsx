import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookMyShowSeatSelection from '../../components/booking/BookMyShowSeatSelection';
import axios from 'axios';
import eventData from '../../data/eventData';

function BookMyShowCheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingStep, setBookingStep] = useState('seats'); // 'seats' or 'payment'
  
  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        if (!eventId) {
          setError('No event ID provided');
          return;
        }
        
        // Try to get event from API
        try {
          const response = await axios.get(`/api/events/${eventId}`);
          if (response.data) {
            setEvent(response.data);
            setError(null);
            return;
          }
        } catch (err) {
          console.log('API fetch error, falling back to local data');
        }
        
        // Fall back to local data
        const foundEvent = eventData.find(e => e._id === eventId || e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
          setError(null);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);
  
  // Handle seat selection
  const handleSeatSelect = (seatId, price) => {
    setSelectedSeats(prevSelectedSeats => {
      // If seat is already selected, remove it
      if (prevSelectedSeats.includes(seatId)) {
        return prevSelectedSeats.filter(id => id !== seatId);
      }
      
      // Otherwise add it
      return [...prevSelectedSeats, seatId];
    });
  };
  
  // Calculate total price based on selected seats
  useEffect(() => {
    const calculateTotal = () => {
      return selectedSeats.reduce((total, seatId) => {
        const [category] = seatId.split(':');
        let price = 0;
        
        if (category === 'elite') {
          price = 183;
        } else if (category === 'classic') {
          price = 150;
        }
        
        return total + price;
      }, 0);
    };
    
    setTotalAmount(calculateTotal());
  }, [selectedSeats]);
  
  // Proceed to payment
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    setBookingStep('payment');
  };
  
  // Complete booking
  const handleCompleteBooking = async () => {
    try {
      if (!user) {
        // Redirect to login if user is not logged in
        navigate('/login', { 
          state: { 
            redirectTo: `/events/${eventId}/checkout`,
            message: 'Please log in to complete your booking'
          }
        });
        return;
      }
      
      const bookingData = {
        eventId,
        seats: selectedSeats,
        amount: totalAmount,
        date: new Date().toISOString()
      };
      
      // Demo mode - just show success message
      alert(`Booking successful! Your tickets for ${event.title || event.name} have been confirmed.`);
      navigate('/dashboard');
      
      // In real app, would send to API:
      // await axios.post('/api/bookings', bookingData);
      // navigate('/bookings/confirmation/' + response.data.bookingId);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to complete booking. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || 'Failed to load event details'}</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5FA] py-8">
      <div className="container mx-auto px-4">
        {/* Event Details */}
        <div className="bg-white p-4 rounded-md shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{event.title || event.name}</h1>
              <p className="text-sm text-gray-500">
                {event.venue}, {event.location?.city} • 
                {new Date(event.eventDate || event.dateTime).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <button 
              onClick={() => navigate(`/events/${eventId}`)}
              className="text-red-600 hover:text-red-700 text-sm mt-2 md:mt-0"
            >
              &lt; Back to Event Details
            </button>
          </div>
        </div>
        
        {bookingStep === 'seats' ? (
          <>
            {/* Seat Selection Section */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6 text-center">Select Your Seats</h2>
              
              <BookMyShowSeatSelection 
                onSeatSelect={handleSeatSelect}
                selectedSeats={selectedSeats}
              />
            </div>
            
            {/* Booking Summary */}
            <div className="bg-white p-4 rounded-md shadow-sm mt-6 sticky bottom-4">
              <div className="flex justify-between items-center">
                <div>
                  {selectedSeats.length > 0 ? (
                    <>
                      <span className="text-sm text-gray-500">Selected Seats:</span>
                      <span className="ml-2 font-medium">
                        {selectedSeats.map(seat => seat.split(':')[1]).join(', ')}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No seats selected</span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-bold">₹{totalAmount.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={selectedSeats.length === 0}
                    className={`px-6 py-3 rounded-md font-medium ${
                      selectedSeats.length > 0
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors`}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Payment Section */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>
              
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    maxLength="19"
                  />
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      maxLength="5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      maxLength="3"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name on Card</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between mb-2">
                    <span>Base Price</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-500">
                    <span>Convenience Fee</span>
                    <span>₹30.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>₹{(totalAmount + 30).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setBookingStep('seats')}
                    className="flex-1 py-3 px-4 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteBooking}
                    className="flex-1 py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Pay ₹{(totalAmount + 30).toFixed(2)}
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  By completing this booking, you agree to our Terms of Service and Privacy Policy
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookMyShowCheckoutPage;