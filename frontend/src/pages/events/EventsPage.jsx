import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../../components/events/EventCard';
import { useAuth } from '../../context/AuthContext';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
    price: '',
    searchTerm: ''
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from API with a short timeout
        try {
          const response = await axios.get(`/api/events`, { timeout: 3000 });
          if (response.data && response.data.events && response.data.events.length > 0) {
            setEvents(response.data.events);
            setError(null);
            setLoading(false);
            return; // Exit early if API call succeeds
          }
        } catch (apiError) {
          console.log("API fetch failed, falling back to hardcoded data:", apiError);
          // Continue to fallback data
        }
        
        // Fallback to hardcoded events if API fails
        const hardcodedEvents = [
          {
            _id: "1",
            title: "Tech Conference 2025",
            description: "Join us for a full day of tech talks, networking, and innovation showcases.",
            location: {
              address: "123 Tech Avenue",
              city: "San Francisco",
              state: "CA",
              country: "USA"
            },
            eventDate: "2025-12-15T09:00:00.000Z",
            category: "Technology",
            name: "Tech Conference 2025",
            dateTime: "2025-12-15T09:00:00.000Z",
            venue: "Tech Center",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
            ticketPrice: 99.99
          },
          {
            _id: "2",
            title: "Music Festival 2025",
            description: "A weekend of amazing live performances across multiple stages.",
            location: {
              address: "456 Music Blvd",
              city: "Los Angeles",
              state: "CA",
              country: "USA"
            },
            eventDate: "2025-11-20T10:00:00.000Z",
            category: "Entertainment",
            name: "Music Festival 2025",
            dateTime: "2025-11-20T10:00:00.000Z",
            venue: "City Amphitheater",
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
            ticketPrice: 149.99
          },
          {
            _id: "3",
            title: "Food & Wine Expo",
            description: "Taste the best cuisines and wines from around the world.",
            location: {
              address: "789 Gourmet Street",
              city: "Chicago",
              state: "IL",
              country: "USA"
            },
            eventDate: "2025-10-05T11:00:00.000Z",
            category: "Food",
            name: "Food & Wine Expo",
            dateTime: "2025-10-05T11:00:00.000Z",
            venue: "Convention Center",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
            ticketPrice: 75.00
          }
        ];
        
        try {
          // First try to get real events from API
          // Build query string from filters
          const queryParams = new URLSearchParams();
          if (filters.category) queryParams.append('category', filters.category);
          if (filters.location) queryParams.append('location', filters.location);
          if (filters.date) queryParams.append('date', filters.date);
          if (filters.price) queryParams.append('price', filters.price);
          if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
          
          const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
          
          const response = await axios.get(`/api/events${queryString}`);
          
          // If we get a response with events, use those
          if (response.data && response.data.events && response.data.events.length > 0) {
            setEvents(response.data.events);
            setError(null);
            return;
          }
          
          // If API returned empty array, fall back to hardcoded events
          setEvents(hardcodedEvents);
          setError(null);
        } catch (apiError) {
          console.log('API error, using hardcoded events:', apiError);
          // If API fails, use hardcoded events
          setEvents(hardcodedEvents);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The effect will trigger a new search when filters change
  };

  const handleViewEvent = (eventId) => {
    if (!eventId) {
      console.error("Attempted to navigate to event with no ID");
      return;
    }
    console.log("Navigating to event:", eventId);
    navigate(`/events/${eventId}`);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      date: '',
      price: '',
      searchTerm: ''
    });
  };

  // Sample data for filters
  const categories = ['Concerts', 'Sports', 'Theater', 'Conferences', 'Festivals', 'Workshops', 'Networking'];
  const locations = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirapalli', 'Tirunelveli', 'Vellore', 'Thanjavur'];
  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Free', value: 'free' },
    { label: 'Under $25', value: '<25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '>100' }
  ];
  const dateOptions = [
    { label: 'Any Time', value: '' },
    { label: 'Today', value: 'today' },
    { label: 'This Weekend', value: 'weekend' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            
            <form onSubmit={handleSearch}>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Search events..."
                    className="w-full p-3 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location.toLowerCase()}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Date</label>
                <select
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>

          {/* Create Event Button (for organizers) */}
          {user?.role === 'organizer' && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/organizer/events/create')}
                className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Event
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Explore Events</h1>
            {events.length > 0 && (
              <p className="text-muted-foreground mt-2">
                Showing {events.length} events
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={clearFilters}
                className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard 
                  key={event._id || event.id || Math.random().toString(36).substring(7)} 
                  event={event} 
                  onClick={() => handleViewEvent(event._id || event.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;