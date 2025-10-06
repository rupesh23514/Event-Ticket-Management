import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookMyShowEventCard from '../../components/events/BookMyShowEventCard';
import { useAuth } from '../../context/AuthContext';
import eventData from '../../data/eventData';

function BookMyShowStyleEventPage() {
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
        
        // Use the imported event data
        let filteredEvents = [...eventData];
        
        // Apply filters
        if (filters.category) {
          filteredEvents = filteredEvents.filter(event => 
            event.category && event.category.toLowerCase() === filters.category.toLowerCase()
          );
        }
        
        if (filters.location) {
          filteredEvents = filteredEvents.filter(event => 
            event.location && 
            event.location.city && 
            event.location.city.toLowerCase() === filters.location.toLowerCase()
          );
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredEvents = filteredEvents.filter(event => 
            (event.title && event.title.toLowerCase().includes(searchLower)) || 
            (event.description && event.description.toLowerCase().includes(searchLower))
          );
        }
        
        if (filters.date) {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + (6 - today.getDay()));
          const weekStart = new Date(today);
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          
          filteredEvents = filteredEvents.filter(event => {
            if (!event.eventDate && !event.dateTime) return true;
            
            const eventDate = new Date(event.eventDate || event.dateTime);
            
            switch(filters.date) {
              case 'today':
                return eventDate.toDateString() === today.toDateString();
              case 'weekend':
                return eventDate >= today && eventDate <= weekEnd;
              case 'week':
                return eventDate >= today && eventDate <= new Date(today.setDate(today.getDate() + 7));
              case 'month':
                return eventDate >= today && eventDate <= monthEnd;
              default:
                return true;
            }
          });
        }
        
        if (filters.price) {
          filteredEvents = filteredEvents.filter(event => {
            const price = Number(event.ticketPrice);
            
            switch(filters.price) {
              case 'free':
                return price === 0;
              case '<25':
                return price > 0 && price < 25;
              case '25-50':
                return price >= 25 && price <= 50;
              case '50-100':
                return price > 50 && price <= 100;
              case '>100':
                return price > 100;
              default:
                return true;
            }
          });
        }
        
        setEvents(filteredEvents);
        setError(null);
      } catch (err) {
        console.error('Error processing events:', err);
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
  const categories = [
    'Technology', 'Entertainment', 'Food', 'Business', 
    'Arts', 'Health', 'Education', 'Sports', 'Lifestyle'
  ];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Austin', 'San Francisco', 'Seattle', 'Boston'];
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
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Banner */}
      <div className="w-full bg-red-600 bg-opacity-95">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Find Events Near You</h1>
          <p className="text-white text-opacity-90 mt-2">Discover amazing experiences and book tickets in minutes</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-3xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search for events, venues, cities..."
                  className="w-full p-3 rounded-md border-0 focus:ring-2 focus:ring-red-400"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
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
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
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
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <select
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <select
                    name="price"
                    value={filters.price}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Create Event Button (for organizers) */}
            {user?.role === 'organizer' && (
              <div className="mt-6 bg-white p-5 rounded-lg shadow-sm">
                <button
                  onClick={() => navigate('/organizer/events/create')}
                  className="w-full py-3 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 font-medium"
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
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Category Sections */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-5">Featured Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.slice(0, 3).map((event) => (
                      <BookMyShowEventCard 
                        key={event._id || event.id || Math.random().toString(36).substring(7)} 
                        event={event} 
                        onClick={() => handleViewEvent(event._id || event.id)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-5">All Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.slice(3).map((event) => (
                      <BookMyShowEventCard 
                        key={event._id || event.id || Math.random().toString(36).substring(7)} 
                        event={event} 
                        onClick={() => handleViewEvent(event._id || event.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookMyShowStyleEventPage;