import React from 'react';
import { Link } from 'react-router-dom';

function BookMyShowEventCard({ event, onClick }) {
  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!event) {
    return null;
  }
  
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full"
      onClick={onClick}
    >
      {/* Event Image with Gradient Overlay */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={event.image || 'https://via.placeholder.com/400x300?text=Event+Image'} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Category Tag */}
        {event.category && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-sm text-xs font-medium">
            {event.category}
          </div>
        )}
        
        {/* Title and Date (positioned at bottom of image) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold text-lg line-clamp-2">{event.name}</h3>
          <div className="flex items-center text-sm mt-1 opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(event.dateTime)}
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-3 flex-grow">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{event.venue}, {event.location?.city}</span>
        </div>
        
        {/* Language Tags */}
        {event.language && (
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {event.language}
            </span>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-3 pb-3 pt-2 mt-auto border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Tickets from</span>
            <div className="font-bold text-red-600">
              ${event.ticketPrice?.toFixed(2) || '99.99'}
            </div>
          </div>
          <Link 
            to={`/events/${event._id || event.id}`}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-sm text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookMyShowEventCard;