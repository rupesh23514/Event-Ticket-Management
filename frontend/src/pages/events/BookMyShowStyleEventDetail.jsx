import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import SeatSelection from '../../components/booking/SeatSelection';
import TicketQuantity from '../../components/booking/TicketQuantity';
import { toast } from 'react-hot-toast';
import eventData from '../../data/eventData';

function BookMyShowStyleEventDetail() {
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
  const [activeTab, setActiveTab] = useState('about');
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
          console.log("API fetch failed, falling back to local data:", apiError);
          // Continue to fallback data
        }
        
        // Find the event in the local data
        const foundEvent = eventData.find(e => e._id === eventId || e.id === eventId);
        
        if (foundEvent) {
          console.log("Found event in local data:", foundEvent);
          setEvent(foundEvent);
          setError(null);
        } else {
          console.error("Event not found in local data");
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
      navigate('/login', { 
        state: { 
          redirectTo: `/checkout/${eventId}`,
          message: 'Please log in to book tickets'
        }
      });
      return;
    }
    
    // Navigate to our new BookMyShow style checkout page
    navigate(`/checkout/${eventId}`);
    
    /* Original code for reference - disabled
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
    */
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
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
            className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Banner */}
      <div 
        className="w-full bg-cover bg-center h-64 md:h-96 relative" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${event.image || 'https://via.placeholder.com/1200x400?text=Event+Image'})` 
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="w-full md:w-3/4 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.name}</h1>
            <div className="flex flex-wrap gap-4 mb-6">
              {event.category && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  {event.category}
                </span>
              )}
              {event.language && (
                <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                  {event.language}
                </span>
              )}
              {event.ageRestriction && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {event.ageRestriction}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content - Event Details */}
          <div className="lg:w-8/12">
            {/* Booking Information Card (Mobile Only) */}
            <div className="lg:hidden mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-bold">{formatDate(event.dateTime)}</div>
                  <div className="text-sm text-gray-300">
                    {formatTime(event.dateTime)} - {event.endDateTime ? formatTime(event.endDateTime) : 'Onwards'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${event.ticketPrice.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">per ticket</div>
                </div>
              </div>
              <button
                onClick={handleBookNow}
                disabled={isEventPast() || isEventSoldOut()}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEventPast() ? 'Event Ended' : isEventSoldOut() ? 'Sold Out' : 'Book Tickets'}
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-t-lg shadow-sm mb-1">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`py-4 px-6 text-center whitespace-nowrap ${
                    activeTab === 'about'
                      ? 'text-red-600 border-b-2 border-red-600 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  About
                </button>
                {event.artists && event.artists.length > 0 && (
                  <button
                    onClick={() => setActiveTab('artists')}
                    className={`py-4 px-6 text-center whitespace-nowrap ${
                      activeTab === 'artists'
                        ? 'text-red-600 border-b-2 border-red-600 font-medium'
                        : 'text-gray-600'
                    }`}
                  >
                    Artists
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('venue')}
                  className={`py-4 px-6 text-center whitespace-nowrap ${
                    activeTab === 'venue'
                      ? 'text-red-600 border-b-2 border-red-600 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  Venue
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`py-4 px-6 text-center whitespace-nowrap ${
                    activeTab === 'faq'
                      ? 'text-red-600 border-b-2 border-red-600 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  FAQs
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-lg shadow-md p-6 mb-6">
              {activeTab === 'about' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">About {event.name}</h2>
                  
                  <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="md:w-7/12">
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {event.longDescription || event.description}
                        </p>
                      </div>
                    </div>
                    <div className="md:w-5/12">
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={event.images?.[1] || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                          alt={event.name} 
                          className="w-full h-64 md:h-72 object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {event.schedule && event.schedule.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Event Schedule</h3>
                      <div className="space-y-4">
                        {event.schedule.map((item, index) => (
                          <div key={index} className="flex border-l-2 border-red-600 pl-4">
                            <div className="w-20 flex-shrink-0 text-gray-600">
                              {item.time}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Terms & Conditions</h3>
                    <ul className="list-disc list-outside ml-5 space-y-2 text-gray-600">
                      <li>Ticket prices are subject to change without prior notice.</li>
                      <li>No refunds or exchanges except in case of event cancellation.</li>
                      <li>Age restrictions apply as indicated in event details.</li>
                      <li>Entry will be denied if tickets are resold or transferred.</li>
                      <li>Photography and recording policies vary by event.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'artists' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {event.category === 'movie' || event.name?.toLowerCase().includes('minion') || event.name?.toLowerCase().includes('gru') 
                      ? 'Featured Characters' 
                      : 'Featured Artists'
                    }
                  </h2>
                  
                  {/* For movie events with Gru and Minions, show character cards */}
                  {(event.category === 'movie' || event.name?.toLowerCase().includes('minion') || event.name?.toLowerCase().includes('gru')) ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Gru character card */}
                      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <div className="h-60 overflow-hidden">
                          <img 
                            src="https://www.hollywoodreporter.com/wp-content/uploads/2015/07/gru_minions_h_15.jpg" 
                            alt="Gru" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg">Gru</h3>
                          <p className="text-gray-600">Main Character</p>
                          <p className="mt-2 text-sm text-gray-500">A reformed super-villain and the adoptive father of Margo, Edith, and Agnes, as well as the current boss of the Minions.</p>
                        </div>
                      </div>
                      
                      {/* Minions character card */}
                      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <div className="h-60 overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/14783578/pexels-photo-14783578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="Minions" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg">Minions</h3>
                          <p className="text-gray-600">Supporting Characters</p>
                          <p className="mt-2 text-sm text-gray-500">Small, yellow creatures who have existed since the beginning of time, evolving from single-celled organisms into beings who exist only to serve history's most despicable masters.</p>
                        </div>
                      </div>
                      
                      {/* Movie scene card */}
                      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <div className="h-60 overflow-hidden">
                          <img 
                            src="https://images.pexels.com/photos/11465845/pexels-photo-11465845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="Movie Scene" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg">Exciting Adventures</h3>
                          <p className="text-gray-600">Movie Scenes</p>
                          <p className="mt-2 text-sm text-gray-500">Join Gru and the Minions on their hilarious adventures as they face new challenges and villains.</p>
                        </div>
                      </div>
                    </div>
                  ) : (!event.artists || event.artists.length === 0) ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {['A.R. Rahman', 'Shreya Ghoshal', 'Sonu Nigam', 'Anirudh Ravichander'].map((name, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={`https://source.unsplash.com/random/300x200?music,artist&sig=${index}`} 
                              alt={name} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg">{name}</h3>
                            <p className="text-gray-600">{'Performer' + (index % 2 === 0 ? ' • Vocalist' : ' • Musician')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {event.artists.map((artist, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={artist.image || `https://source.unsplash.com/random/300x200?music,artist&sig=${index}`} 
                              alt={artist.name} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg">{artist.name}</h3>
                            <p className="text-gray-600">{artist.role || 'Performer'}</p>
                            {artist.bio && <p className="text-sm mt-2">{artist.bio}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'venue' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-bold text-lg mb-2">{event.venue}</h3>
                    <p className="text-gray-600 mb-1">
                      {event.location.address}, {event.location.city}
                    </p>
                    <p className="text-gray-600">
                      {event.location.state}, {event.location.zipCode}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Accessibility</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Wheelchair accessible</li>
                        <li>Accessible restrooms</li>
                        <li>Accessible seating available</li>
                      </ul>
                      
                      <h3 className="font-semibold mt-4 mb-2">Amenities</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Food and beverages available</li>
                        <li>ATM on premises</li>
                        <li>Coat check available</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Getting There</h3>
                      <div className="space-y-3 text-gray-600">
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 mt-0.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Parking available at venue ($15-25)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 mt-0.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Public transit: Green Line to Central Station (5 min walk)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 mt-0.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Ride services drop-off at main entrance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                    <img 
                      src="https://maps.googleapis.com/maps/api/staticmap?center=Chennai,India&zoom=14&size=800x400&markers=color:red%7CChennai,India&key=AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik" 
                      alt="Venue Map" 
                      className="w-full h-72 object-cover"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-bold mb-2">What time should I arrive?</h3>
                      <p className="text-gray-600">We recommend arriving at least 30 minutes before the event starts to allow time for entry procedures and finding your seats.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-bold mb-2">Is there a dress code?</h3>
                      <p className="text-gray-600">Unless otherwise specified, there is no strict dress code. However, we recommend comfortable attire appropriate for the venue and event type.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-bold mb-2">Can I bring food and drinks?</h3>
                      <p className="text-gray-600">Outside food and beverages are generally not permitted. Food and drinks will be available for purchase at the venue.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-bold mb-2">Are cameras allowed?</h3>
                      <p className="text-gray-600">Professional cameras (with detachable lenses) are not permitted without prior authorization. Personal smartphones and small cameras are typically allowed for non-commercial use.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-bold mb-2">What happens if the event is canceled?</h3>
                      <p className="text-gray-600">In case of cancellation, ticket holders will be notified and tickets will be automatically refunded to the original payment method.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Right Sidebar - Booking Widget */}
          <div className="lg:w-4/12">
            <div className="sticky top-24">
              {/* Booking Card */}
              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-bold">{formatDate(event.dateTime)}</h3>
                  </div>
                  <div className="flex items-center gap-2 ml-7 text-gray-600">
                    {formatTime(event.dateTime)} - {event.endDateTime ? formatTime(event.endDateTime) : 'Onwards'}
                  </div>
                </div>
                
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-start gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold">{event.venue}</h3>
                      <p className="text-gray-600 text-sm">{event.location.city}, {event.location.state}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Select Tickets</h3>
                  {event.seatingType !== 'reserved' && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Standard Ticket</span>
                        <span className="font-bold">${event.ticketPrice.toFixed(2)}</span>
                      </div>
                      <TicketQuantity
                        quantity={ticketQuantity}
                        onChange={handleTicketQuantityChange}
                        maxAvailable={event.ticketsAvailable}
                      />
                    </div>
                  )}

                  {/* Seat Selection Button (for reserved seating) */}
                  {event.seatingType === 'reserved' && (
                    <div className="mb-6">
                      <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="w-full py-2 px-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Select Seats
                      </button>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between font-bold text-lg border-t pt-4">
                    <span>Total</span>
                    <span>
                      ${(event.ticketPrice * (event.seatingType === 'reserved' ? selectedSeats.length : ticketQuantity)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  disabled={isEventPast() || isEventSoldOut() || (event.seatingType === 'reserved' && selectedSeats.length === 0)}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEventPast() ? 'Event Ended' : isEventSoldOut() ? 'Sold Out' : 'Book Now'}
                </button>
                
                {/* Additional Information */}
                <div className="mt-6 text-sm text-gray-500">
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Sales end 2 hours before event starts</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                    </svg>
                    <span>Tickets delivered instantly via email</span>
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-4">Share this event</h3>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seat Selection Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Your Seats</h2>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Select {ticketQuantity} {ticketQuantity === 1 ? 'seat' : 'seats'} on the seating chart below:
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-100 border border-gray-300 rounded-sm mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-red-600 rounded-sm mr-2"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-400 rounded-sm mr-2"></div>
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
                <p className="text-sm text-gray-600">
                  Total: ${(event.ticketPrice * selectedSeats.length).toFixed(2)}
                </p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
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
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
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

export default BookMyShowStyleEventDetail;