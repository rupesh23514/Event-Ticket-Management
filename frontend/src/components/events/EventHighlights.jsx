import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

function EventHighlights() {
  const navigate = useNavigate();
  
  // Featured event that gets special treatment
  const featuredEvent = {
    id: '501',
    name: 'Annual Music Festival',
    description: 'Experience three days of amazing performances from top artists across multiple genres. Our annual music festival brings together the best talent from around the world for an unforgettable weekend of music, food, and fun.',
    image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    date: '2023-07-15',
    location: 'Central Park, New York',
    category: 'Music Festival'
  };
  
  // Other highlighted events
  const highlights = [
    {
      id: '1',
      name: 'Summer Music Festival',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
      date: '2025-10-15',
      category: 'Festivals',
      featured: true,
    },
    {
      id: '2',
      name: 'Tech Conference 2025',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      date: '2025-11-20',
      category: 'Conferences',
      featured: true,
    },
    {
      id: '3',
      name: 'Broadway Theater Show',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      date: '2025-10-25',
      category: 'Theater',
      featured: true,
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">Event Highlights</h2>
      
      {/* Main Featured Event */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
        {/* Image Column */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-600 rounded-3xl transform translate-x-3 translate-y-3 -z-10 opacity-20"></div>
          <img 
            src={featuredEvent.image} 
            alt={featuredEvent.name}
            className="w-full h-[500px] object-cover rounded-3xl shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x500?text=Featured+Event';
            }}
          />
        </div>
        
        {/* Content Column */}
        <div className="p-4">
          <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
            Featured Event
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4">{featuredEvent.name}</h3>
          
          <div className="flex flex-wrap items-center mb-6 text-slate-600 dark:text-slate-400 gap-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(featuredEvent.date)}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{featuredEvent.location}</span>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {featuredEvent.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => navigate(`/events/${featuredEvent.id}`)}
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
              onClick={() => navigate(`/events/${featuredEvent.id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
      
      {/* Other Highlighted Events */}
      <h3 className="text-2xl font-bold mb-6">More Highlights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id} className="group">
            <div className="relative rounded-xl overflow-hidden h-80 bg-slate-200 dark:bg-slate-800">
              {/* Image with gradient overlay */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x600?text=Event';
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium bg-indigo-600/80 text-white px-2 py-1 rounded-full">
                    {event.category}
                  </span>
                  <span className="text-xs text-white/90 ml-2">{formatDate(event.date)}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    View details
                  </span>
                  <svg 
                    className="h-4 w-4 ml-1 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default EventHighlights;