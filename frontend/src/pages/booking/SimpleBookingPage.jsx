import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleSeatBooking from '../../components/booking/SimpleSeatBooking';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

function SimpleBookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, fetch event from API
    // For this example, we'll use mock data
    setLoading(true);
    
    setTimeout(() => {
      // Mock event data
      const mockEvent = {
        id: eventId || '123',
        name: 'Sample Concert Event',
        date: new Date('2025-10-25T19:00:00').toISOString(),
        venue: 'Sample Concert Hall',
        location: 'New York, NY',
        description: 'Join us for an amazing night of music featuring top artists from around the world. This concert promises to be an unforgettable experience with state-of-the-art sound and lighting.',
        image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        ticketPrice: 59.99,
        availableSeats: 120,
        category: 'Concert'
      };
      
      setEvent(mockEvent);
      setLoading(false);
    }, 800);
  }, [eventId]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Button 
            onClick={() => navigate('/events')}
            className="mt-4"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="md:col-span-1">
          <div className="bg-card p-6 rounded-lg border shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                }}
              />
            </div>
            
            <h3 className="text-lg font-bold mb-2">{event.name}</h3>
            
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center text-muted-foreground">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.venue}, {event.location}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-muted-foreground">Price per ticket</span>
                <span className="font-medium">${event.ticketPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available seats</span>
                <span className="font-medium">{event.availableSeats}</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-4">
                {event.description.slice(0, 150)}
                {event.description.length > 150 ? '...' : ''}
              </p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                View Full Event Details
              </Button>
            </div>
          </div>
        </div>
        
        {/* Booking Component */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Select Your Seats</h1>
          <SimpleSeatBooking eventId={event.id} />
        </div>
      </div>
    </div>
  );
}

export default SimpleBookingPage;