import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import SeatSelection from '../../components/booking/SeatSelection';
import TicketQuantity from '../../components/booking/TicketQuantity';
import EventMap from '../../components/events/EventMap';
import { toast } from 'react-hot-toast';

function EventDetailPage() {
  // Get either eventId or id from params (supporting both route patterns)
  const params = useParams();
  const eventId = params.eventId || params.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        // Make sure we have an eventId to work with
        if (!eventId) {
          setError('No event ID provided');
          setEvent(null);
          setLoading(false);
          return;
        }
        
        console.log("Fetching event details for ID:", eventId);
        
        // Try to fetch from API with a short timeout
        try {
          const response = await axios.get(`/api/events/${eventId}`, { timeout: 5000 });
          if (response.data) {
            console.log("API returned event data:", response.data);
            setEvent(response.data);
            setError(null);
            setLoading(false);
            return; // Exit early if API call succeeds
          }
        } catch (apiError) {
          console.log("API fetch failed, using fallback data:", apiError);
          // Continue to fallback data
        }
        
        console.log("Using fallback data for event ID:", eventId);
        
        // Fallback hardcoded event data if API fails
        const fallbackEvents = {
          "1": {
            _id: "1",
            title: "Tech Conference 2025",
            name: "Tech Conference 2025",
            description: "Join us for a full day of tech talks, networking, and innovation showcases. This premier technology event brings together industry leaders, developers, and tech enthusiasts for a day of learning and collaboration. Topics include AI, blockchain, cloud computing, and more.",
            location: {
              address: "123 Tech Avenue",
              city: "San Francisco",
              state: "CA",
              country: "USA",
              zipCode: "94105"
            },
            venue: "Tech Center",
            eventDate: "2025-12-15T09:00:00.000Z",
            dateTime: "2025-12-15T09:00:00.000Z",
            category: "Technology",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
            ticketPrice: 99.99,
            availableSeats: 150,
            ticketsAvailable: 150,
            seatingType: "general",
            organizer: {
              name: "Tech Events Inc",
              email: "info@techevents.com",
              since: "2020"
            }
          },
          "2": {
            _id: "2",
            title: "Music Festival 2025",
            name: "Music Festival 2025",
            description: "A weekend of amazing live performances across multiple stages featuring top artists from around the world. Experience unforgettable performances, great food, and an incredible atmosphere.",
            location: {
              address: "456 Music Blvd",
              city: "Los Angeles",
              state: "CA",
              country: "USA",
              zipCode: "90001"
            },
            venue: "City Amphitheater",
            eventDate: "2025-11-20T10:00:00.000Z",
            dateTime: "2025-11-20T10:00:00.000Z",
            category: "Entertainment",
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
            ticketPrice: 149.99,
            availableSeats: 500,
            ticketsAvailable: 500,
            seatingType: "general",
            organizer: {
              name: "Festival Productions",
              email: "info@festivalprods.com",
              since: "2015"
            }
          },
          "3": {
            _id: "3",
            title: "Food & Wine Expo",
            name: "Food & Wine Expo",
            description: "Taste the best cuisines and wines from around the world. Meet celebrity chefs, attend cooking demonstrations, and sample exquisite dishes and beverages.",
            location: {
              address: "789 Gourmet Street",
              city: "Chicago",
              state: "IL",
              country: "USA",
              zipCode: "60007"
            },
            venue: "Convention Center",
            eventDate: "2025-10-05T11:00:00.000Z",
            dateTime: "2025-10-05T11:00:00.000Z",
            category: "Food",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
            ticketPrice: 75.00,
            availableSeats: 300,
            ticketsAvailable: 300,
            seatingType: "general",
            organizer: {
              name: "Gourmet Events",
              email: "info@gourmetevents.com",
              since: "2018"
            }
          }
        };
        
        // Check if we have a fallback for this event ID
        if (fallbackEvents[eventId]) {
          setEvent(fallbackEvents[eventId]);
          setError(null);
        } else {
          setError('Event not found. Please try another event.');
          setEvent(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length < ticketQuantity) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        toast.error(`You can only select ${ticketQuantity} seats`);
      }
    }
  };

  const handleTicketQuantityChange = (quantity) => {
    setTicketQuantity(quantity);
    // Clear selected seats if quantity is reduced
    if (quantity < selectedSeats.length) {
      setSelectedSeats(selectedSeats.slice(0, quantity));
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    
    if (event.seatingType === 'reserved' && selectedSeats.length < ticketQuantity) {
      toast.error('Please select all required seats');
      return;
    }
    
    // For reserved seating
    if (event.seatingType === 'reserved') {
      navigate('/booking/checkout', { 
        state: { 
          eventId: event._id,
          eventName: event.name,
          ticketPrice: event.ticketPrice,
          selectedSeats,
          totalAmount: selectedSeats.length * event.ticketPrice
        }
      });
    } 
    // For general admission
    else {
      navigate('/booking/checkout', { 
        state: { 
          eventId: event._id,
          eventName: event.name,
          ticketPrice: event.ticketPrice,
          quantity: ticketQuantity,
          totalAmount: ticketQuantity * event.ticketPrice
        }
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy • h:mm a');
  };

  const isEventPast = () => {
    if (!event) return false;
    const eventDate = new Date(event.dateTime);
    return eventDate < new Date();
  };

  const isEventSoldOut = () => {
    if (!event) return false;
    
    if (event.seatingType === 'reserved') {
      return event.availableSeats === 0;
    } else {
      return event.ticketsAvailable === 0;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    // If we reach this point with no event and no error, it means we're still looking for fallback data
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Event Image */}
          <div className="relative rounded-lg overflow-hidden h-80 mb-6">
            <img 
              src={event.image || 'https://via.placeholder.com/800x400?text=Event+Image'} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
            {isEventPast() && (
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground py-1 px-3 rounded-full font-semibold">
                Event Ended
              </div>
            )}
            {!isEventPast() && isEventSoldOut() && (
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground py-1 px-3 rounded-full font-semibold">
                Sold Out
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-5 ${
                activeTab === 'details'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('venue')}
              className={`py-3 px-5 ${
                activeTab === 'venue'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Venue & Directions
            </button>
            <button
              onClick={() => setActiveTab('organizer')}
              className={`py-3 px-5 ${
                activeTab === 'organizer'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Organizer
            </button>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'details' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Event Description</h2>
                <p className="whitespace-pre-line mb-6">
                  {event.description}
                </p>

                {event.schedule && event.schedule.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Event Schedule</h3>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex border-l-2 border-primary pl-4">
                          <div className="w-20 flex-shrink-0 text-muted-foreground">
                            {item.time}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            {item.description && (
                              <p className="text-muted-foreground text-sm mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'venue' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">{event.venue}</h3>
                    <p className="text-muted-foreground">
                      {event.location.address}, {event.location.city}
                      <br />
                      {event.location.state}, {event.location.zipCode}
                    </p>
                    
                    {event.venue && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Accessibility</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Wheelchair accessible</li>
                          <li>Accessible restrooms</li>
                          <li>Accessible seating available</li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Getting There</h3>
                    <div className="space-y-3 text-muted-foreground">
                      {event.location.parkingInfo && (
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          <span>{event.location.parkingInfo}</span>
                        </div>
                      )}
                      {event.location.publicTransport && (
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>{event.location.publicTransport}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 h-64 md:h-80 rounded-lg overflow-hidden">
                  <EventMap 
                    location={{
                      lat: event.location.coordinates?.lat || 40.7128,
                      lng: event.location.coordinates?.lng || -74.0060,
                      address: `${event.venue}, ${event.location.address}, ${event.location.city}`
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'organizer' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About the Organizer</h2>
                
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mr-4">
                    {event.organizer?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{event.organizer?.name || 'Event Organizer'}</h3>
                    <p className="text-muted-foreground">Organizer since {event.organizer?.since || '2023'}</p>
                  </div>
                </div>
                
                <p className="mb-6">
                  {event.organizer?.bio || 'This organizer has not provided a bio yet.'}
                </p>

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{event.organizer?.email || 'contact@example.com'}</span>
                    </div>
                    {event.organizer?.phone && (
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{event.organizer.phone}</span>
                      </div>
                    )}
                    {event.organizer?.website && (
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a 
                          href={event.organizer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {event.organizer.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Event Info & Booking */}
        <div className="lg:w-1/3">
          <div className="bg-card p-6 rounded-lg border shadow-sm sticky top-24">
            <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.dateTime)}</span>
            </div>
            
            <div className="flex items-start mb-6">
              <svg className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div className="font-medium">{event.venue}</div>
                <div className="text-muted-foreground text-sm">
                  {event.location.address}, {event.location.city}
                </div>
              </div>
            </div>
            
            <div className="border-t border-b py-4 my-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">${event.ticketPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available tickets</span>
                <span className="font-semibold">
                  {event.seatingType === 'reserved' ? event.availableSeats : event.ticketsAvailable}
                </span>
              </div>
            </div>
            
            {/* Ticket Quantity Selector (for general admission) */}
            {event.seatingType !== 'reserved' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Number of Tickets
                </label>
                <TicketQuantity
                  quantity={ticketQuantity}
                  onChange={handleTicketQuantityChange}
                  maxAvailable={event.ticketsAvailable}
                />
              </div>
            )}

            {/* Seat Selection (for reserved seating) */}
            {event.seatingType === 'reserved' && (
              <div className="mb-6">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-2 px-4 bg-accent text-accent-foreground border border-accent rounded-md hover:bg-accent/90 transition-colors flex items-center justify-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Select Seats
                </button>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between text-lg mb-6">
              <span className="font-medium">Total</span>
              <span className="font-bold">
                ${(event.ticketPrice * (event.seatingType === 'reserved' ? selectedSeats.length : ticketQuantity)).toFixed(2)}
              </span>
            </div>
            
            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={isEventPast() || isEventSoldOut() || (event.seatingType === 'reserved' && selectedSeats.length === 0)}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEventPast() ? 'Event Ended' : isEventSoldOut() ? 'Sold Out' : 'Book Now'}
            </button>
            
            {/* Additional Information */}
            <div className="mt-6 text-sm text-muted-foreground">
              <div className="flex items-center mb-3">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Sales end 2 hours before event starts</span>
              </div>
              <div className="flex items-center mb-3">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure payment</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                <span>Tickets delivered instantly via email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seat Selection Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Your Seats</h2>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Select {ticketQuantity} {ticketQuantity === 1 ? 'seat' : 'seats'} on the seating chart below:
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-accent rounded-sm mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-primary rounded-sm mr-2"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-muted-foreground rounded-sm mr-2"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Number of Tickets
              </label>
              <TicketQuantity
                quantity={ticketQuantity}
                onChange={handleTicketQuantityChange}
                maxAvailable={Math.min(10, event.availableSeats)}
              />
            </div>
            
            <div className="py-4">
              <SeatSelection 
                venue={event.venue}
                seatingPlan={event.seatingPlan || {}} // Assuming seatingPlan is part of the event data
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                maxSelectable={ticketQuantity}
              />
            </div>
            
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <div>
                <p className="font-medium">
                  {selectedSeats.length} of {ticketQuantity} seats selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: ${(event.ticketPrice * selectedSeats.length).toFixed(2)}
                </p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="py-2 px-4 border border-muted rounded-md hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    if (selectedSeats.length === ticketQuantity) {
                      handleBookNow();
                    }
                  }}
                  disabled={selectedSeats.length !== ticketQuantity}
                  className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;