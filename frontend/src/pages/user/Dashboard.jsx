import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    favoriteCategories: [],
  });
  
  // Placeholder data for dashboard
  const [tickets, setTickets] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // In a real app, fetch tickets from API
    // For this example, we'll use mock data
    setTimeout(() => {
      const mockTickets = [
        {
          _id: '1',
          eventId: '101',
          title: 'Summer Music Festival',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          venue: 'Central Park',
          location: 'New York, NY',
          ticketCount: 2,
          totalAmount: 179.98,
          seats: ['A12', 'A13'],
          purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          category: 'Music',
          image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-101-1',
        },
        {
          _id: '2',
          eventId: '102',
          title: 'Tech Conference 2023',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          venue: 'Convention Center',
          location: 'San Francisco, CA',
          ticketCount: 1,
          totalAmount: 299.99,
          seats: [],
          purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          category: 'Conference',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-102-2',
        },
        {
          _id: '3',
          eventId: '103',
          title: 'Championship Basketball Game',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          venue: 'Sports Arena',
          location: 'Chicago, IL',
          ticketCount: 3,
          totalAmount: 360.00,
          seats: ['C5', 'C6', 'C7'],
          purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'attended',
          category: 'Sports',
          image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-103-3',
        }
      ];
      
      // Sample recommended events
      const mockRecommendedEvents = [
        {
          id: '201',
          title: 'Jazz Night at Blue Note',
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Blue Note Jazz Club, New York',
          price: 45.00,
          category: 'Music',
          image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        },
        {
          id: '202',
          title: 'Digital Marketing Summit',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Marriott Hotel, Boston',
          price: 199.00,
          category: 'Conference',
          image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        },
        {
          id: '203',
          title: 'Local Theater Production',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Community Theater, Seattle',
          price: 35.00,
          category: 'Theater',
          image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1741&q=80',
        },
      ];
      
      setTickets(mockTickets);
      setRecommendedEvents(mockRecommendedEvents);
      
      // Calculate user stats
      const upcoming = mockTickets.filter(ticket => new Date(ticket.date) > new Date()).length;
      const past = mockTickets.filter(ticket => new Date(ticket.date) <= new Date()).length;
      const categories = [...new Set(mockTickets.map(ticket => ticket.category))];
      
      setUserStats({
        totalBookings: mockTickets.length,
        upcomingEvents: upcoming,
        pastEvents: past,
        favoriteCategories: categories,
      });
      
      setLoading(false);
    }, 1000);
  }, [user, navigate]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter tickets based on active tab
  const filteredTickets = tickets.filter(ticket => {
    const eventDate = new Date(ticket.date);
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return eventDate > now;
    } else {
      return eventDate <= now;
    }
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading">My Tickets</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/events')}
            variant="default"
          >
            Browse Events
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">Upcoming Events</h3>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {userStats.upcomingEvents}
              </div>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">Total Tickets</h3>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {userStats.totalBookings}
              </div>
              <div className="mt-2">
                <Link 
                  to="/dashboard/bookings" 
                  className="text-sm text-violet-500 hover:text-violet-400 flex items-center"
                >
                  View all bookings
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6 border">
          <div>
            <h3 className="text-lg font-medium mb-3">Favorite Categories</h3>
            <div className="flex flex-wrap gap-2">
              {userStats.favoriteCategories.map((category) => (
                <span 
                  key={category}
                  className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-card rounded-lg shadow border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-6 ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-3 px-6 ${
              activeTab === 'past'
                ? 'border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            Past Events
          </button>
        </div>
        
        {/* Tickets List */}
        <div className="p-6">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <svg className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p className="mb-2">No {activeTab} events found</p>
              <p className="text-sm mb-6">
                {activeTab === 'upcoming' 
                  ? "You haven't booked any upcoming events yet."
                  : "You haven't attended any events yet."
                }
              </p>
              <Button 
                onClick={() => navigate('/events')}
                variant="outline"
              >
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTickets.map((ticket) => (
                <div 
                  key={ticket._id} 
                  className="flex flex-col md:flex-row border rounded-lg overflow-hidden bg-card"
                >
                  {/* Event Image */}
                  <div className="md:w-1/4 h-48 md:h-auto relative">
                    <img 
                      src={ticket.image} 
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                      }}
                    />
                    {ticket.status === 'attended' && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Attended
                      </div>
                    )}
                  </div>
                  
                  {/* Ticket Details */}
                  <div className="md:w-2/4 p-6">
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">
                        {ticket.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{ticket.title}</h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(ticket.date)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{ticket.venue}, {ticket.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{ticket.ticketCount} {ticket.ticketCount === 1 ? 'Ticket' : 'Tickets'}</span>
                      </div>
                      
                      {ticket.seats.length > 0 && (
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Seats: {ticket.seats.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    {activeTab === 'upcoming' && (
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={() => navigate(`/events/${ticket.eventId}`)}
                          variant="outline"
                          size="sm"
                        >
                          Event Details
                        </Button>
                        <Button 
                          onClick={() => {}}
                          size="sm"
                        >
                          View Ticket
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* QR Code & Price */}
                  <div className="md:w-1/4 bg-muted p-6 flex flex-col items-center justify-center space-y-4 border-t md:border-t-0 md:border-l">
                    {/* QR Code */}
                    <div className="bg-white p-2 rounded">
                      <img 
                        src={ticket.qrCodeUrl} 
                        alt="Ticket QR Code" 
                        className="w-24 h-24"
                      />
                    </div>
                    
                    <div className="text-sm text-center text-muted-foreground">
                      Present this QR code at the venue
                    </div>
                    
                    <div className="text-lg font-bold mt-2">
                      ${ticket.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Events Section */}
      <div className="bg-card rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map((event) => (
            <div key={event.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                  {event.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {formatDate(event.date)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {event.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">${event.price.toFixed(2)}</span>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Event
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;