import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventData from '../data/eventData';

function BookMyShowHomePage() {
  const { user } = useAuth();

  // Filter featured events (first 4 events)
  const featuredEvents = eventData.slice(0, 4);
  
  // Filter recommended events (next 4 events)
  const recommendedEvents = eventData.slice(4, 8);
  
  // Custom categories relevant for Tamil Nadu users
  const categories = [
    'Cinema', 
    'Music', 
    'Comedy', 
    'Theatre', 
    'Bharatanatyam', 
    'Sports', 
    'Workshops', 
    'Exhibitions'
  ];
  
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-violet-900 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Experience the Magic of Live Events
            </h1>
            <p className="text-xl text-white text-opacity-90 mb-8">
              Discover and book tickets for concerts, movies, sports, and more - all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/events" 
                className="bg-white text-red-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Events
              </Link>
              {!user && (
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Events Carousel */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Events</h2>
            <Link to="/events" className="text-red-600 hover:text-red-700 font-medium text-sm">
              View All Events &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <div 
                key={event._id} 
                className="rounded-lg overflow-hidden shadow-md bg-white flex flex-col h-full"
              >
                {/* Event Image with Category Tag */}
                <div className="relative h-48">
                  <img 
                    src={event.image || 'https://via.placeholder.com/400x300?text=Event'} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="font-bold text-white text-lg line-clamp-2">{event.title || event.name}</h3>
                  </div>
                  {event.category && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-sm text-xs font-medium">
                      {event.category}
                    </div>
                  )}
                </div>
                
                {/* Event Details */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.eventDate || event.dateTime).toLocaleDateString('en-US', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue}, {event.location?.city}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">From</span>
                      <div className="text-lg font-bold text-red-600">${event.ticketPrice?.toFixed(2) || '99.99'}</div>
                    </div>
                    <Link 
                      to={`/events/${event._id}`} 
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              // Define specific icon and color based on category
              let icon;
              let bgColor;
              let iconColor;
              
              switch(category.toLowerCase()) {
                case 'music':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />;
                  bgColor = "bg-violet-900/30";
                  iconColor = "text-violet-400";
                  break;
                case 'comedy':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
                  bgColor = "bg-red-900/30";
                  iconColor = "text-red-400";
                  break;
                case 'cinema':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />;
                  bgColor = "bg-red-900/30";
                  iconColor = "text-red-400";
                  break;
                case 'bharatanatyam':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
                  bgColor = "bg-yellow-900/30";
                  iconColor = "text-yellow-400";
                  break;
                case 'theatre':
                case 'theater':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />;
                  bgColor = "bg-purple-900/30";
                  iconColor = "text-purple-400";
                  break;
                case 'sports':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />;
                  bgColor = "bg-blue-900/30";
                  iconColor = "text-blue-400";
                  break;
                case 'workshops':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
                  bgColor = "bg-green-900/30";
                  iconColor = "text-green-400";
                  break;
                case 'exhibitions':
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
                  bgColor = "bg-amber-900/30";
                  iconColor = "text-amber-400";
                  break;
                default:
                  icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
                  bgColor = "bg-red-900/30";
                  iconColor = "text-red-400";
              }
              
              return (
                <Link 
                  key={index} 
                  to={`/events?category=${category.toLowerCase()}`}
                  className="rounded-lg bg-gray-900 hover:bg-gray-800 border border-violet-900/20 shadow-lg hover:shadow-violet-900/20 transition-all p-5 flex flex-col items-center text-center hover:translate-y-[-2px]"
                >
                  {/* Icon based on category */}
                  <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-4 shadow-inner`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {icon}
                    </svg>
                  </div>
                  <span className="font-medium text-white">{category}</span>
                </Link>
              );
            })}
          </div>
        </section>
        
        {/* Recommended Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedEvents.map((event) => (
              <div 
                key={event._id} 
                className="rounded-lg overflow-hidden shadow-md bg-white flex flex-col h-full"
              >
                {/* Event Image with Category Tag */}
                <div className="relative h-48">
                  <img 
                    src={event.image || 'https://via.placeholder.com/400x300?text=Event'} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="font-bold text-white text-lg line-clamp-2">{event.title || event.name}</h3>
                  </div>
                  {event.category && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-sm text-xs font-medium">
                      {event.category}
                    </div>
                  )}
                </div>
                
                {/* Event Details */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.eventDate || event.dateTime).toLocaleDateString('en-US', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue}, {event.location?.city}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">From</span>
                      <div className="text-lg font-bold text-red-600">${event.ticketPrice?.toFixed(2) || '99.99'}</div>
                    </div>
                    <Link 
                      to={`/events/${event._id}`} 
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose BookMyShow Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-500">Book your tickets in seconds, not minutes. Our platform is optimized for speed.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
              <p className="text-gray-500">Your payment and personal information are always protected with our secure systems.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">No Hidden Fees</h3>
              <p className="text-gray-500">Transparent pricing with no surprise charges. What you see is what you pay.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-500">Our customer service team is available around the clock to assist with any questions.</p>
            </div>
          </div>
        </section>
        
        {/* Newsletter Subscription */}
        <section className="bg-red-600 rounded-lg p-8 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Never Miss an Event</h2>
            <p className="mb-6">Subscribe to our newsletter to receive updates on new events and special offers.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
                required
              />
              <button 
                type="submit" 
                className="bg-gray-900 text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BookMyShowHomePage;