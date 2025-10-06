import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SimpleSeatBooking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // Mock seating plan - in a real app, this would come from the API
  const seatingPlan = {
    rows: ['A', 'B', 'C', 'D', 'E'],
    seatsPerRow: 10,
    unavailableSeats: ['A3', 'A4', 'B7', 'B8', 'C5', 'D2', 'D3', 'E8'],
    ticketPrice: 15.99,
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // In a real app, fetch the event details from your API
        // const response = await axios.get(`/api/events/${eventId}`);
        // setEvent(response.data);

        // For this example, we'll use a mock event
        setEvent({
          _id: eventId || '12345',
          name: 'Sample Concert Event',
          date: new Date('2025-10-25T19:00:00'),
          venue: 'Sample Concert Hall',
          description: 'This is a sample event for demonstration purposes.',
          ticketPrice: seatingPlan.ticketPrice,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSeatClick = (seat) => {
    // Don't allow seat selection if already booked
    if (booking) return;
    
    // Don't allow selecting unavailable seats
    if (seatingPlan.unavailableSeats.includes(seat)) return;
    
    setSelectedSeats((prev) => {
      if (prev.includes(seat)) {
        // If seat is already selected, remove it
        return prev.filter((s) => s !== seat);
      } else {
        // Add the seat to selection
        return [...prev, seat];
      }
    });
  };

  const handleBookSeats = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      // You might want to redirect to login page
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate total amount based on selected seats and ticket price
      const totalAmount = selectedSeats.length * seatingPlan.ticketPrice;

      // Send booking request to API
      const response = await axios.post('/api/simple-bookings', 
        {
          eventId: event._id,
          seats: selectedSeats,
          totalAmount
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      // Set booking data and QR code
      setBooking(response.data.booking);
      setQrCode(response.data.booking.qrDataUrl);
      
      toast.success('Booking successful!');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `ticket-qr-${booking._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !event) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{event?.name}</h1>
        
        {booking ? (
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-green-600 mb-6">
              Booking Confirmed!
            </div>
            
            <div className="max-w-sm mx-auto mb-6">
              <img 
                src={qrCode} 
                alt="Ticket QR Code" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6 max-w-md mx-auto text-left">
              <div className="mb-2">
                <span className="font-semibold">Event:</span> {event.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Seats:</span> {booking.seats.join(', ')}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Total Amount:</span> ${booking.totalAmount.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Booking ID:</span> {booking._id}
              </div>
            </div>
            
            <button
              onClick={downloadQRCode}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Download QR Code
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                {event?.description}
              </p>
              <div className="mt-4">
                <div>
                  <span className="font-semibold">Date:</span> {new Date(event?.date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Venue:</span> {event?.venue}
                </div>
                <div>
                  <span className="font-semibold">Ticket Price:</span> ${seatingPlan.ticketPrice.toFixed(2)} per seat
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Your Seats</h2>
              
              <div className="flex justify-center mb-6">
                <div className="w-3/4 h-10 bg-gray-300 rounded-t-3xl flex items-center justify-center mb-8">
                  STAGE
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                {seatingPlan.rows.map((row) => (
                  <div key={row} className="flex items-center mb-2">
                    <div className="w-8 text-center font-bold">{row}</div>
                    <div className="flex gap-2">
                      {Array.from({ length: seatingPlan.seatsPerRow }, (_, i) => {
                        const seatNum = i + 1;
                        const seat = `${row}${seatNum}`;
                        const isSelected = selectedSeats.includes(seat);
                        const isUnavailable = seatingPlan.unavailableSeats.includes(seat);
                        
                        return (
                          <button
                            key={seat}
                            onClick={() => handleSeatClick(seat)}
                            disabled={isUnavailable}
                            className={`w-8 h-8 rounded-t-sm flex items-center justify-center text-sm
                              ${isSelected 
                                ? 'bg-primary text-white' 
                                : isUnavailable 
                                  ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                                  : 'bg-green-100 hover:bg-green-200'
                              }`}
                          >
                            {seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary rounded mr-2"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 rounded mr-2 opacity-50"></div>
                  <span className="text-sm">Unavailable</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-lg font-semibold">
                    {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
                  </div>
                  <div>
                    {selectedSeats.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {selectedSeats.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xl font-bold">
                  Total: ${(selectedSeats.length * seatingPlan.ticketPrice).toFixed(2)}
                </div>
              </div>
              
              <button
                onClick={handleBookSeats}
                disabled={selectedSeats.length === 0 || loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Book ${selectedSeats.length} ${selectedSeats.length === 1 ? 'seat' : 'seats'}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleSeatBooking;