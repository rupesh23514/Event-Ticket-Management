import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

function EventCard({ event, onClick }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!event) {
    return null;
  }
  
  return (
    <Card 
      className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image || 'https://via.placeholder.com/400x200?text=Event+Image'} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Category Tag */}
        {event.category && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs">
            {event.category}
          </div>
        )}
        
        {/* Date Tag */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-1 rounded text-xs font-medium">
          {formatDate(event.dateTime)}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
        <div className="flex items-center text-sm text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{event.venue}, {event.location?.city}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        {event.description && (
          <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-2">
        <div className="font-medium">
          {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice?.toFixed(2) || '99.99'}`}
        </div>
        <Link to={`/events/${event._id || event.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default EventCard;