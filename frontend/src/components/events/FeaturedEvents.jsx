import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch featured events
    setTimeout(() => {
      const mockEvents = [
        {
          _id: '101',
          name: 'Summer Music Festival',
          description: 'Enjoy a weekend of amazing live performances from top artists',
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          venue: 'Central Park',
          location: { city: 'New York', state: 'NY' },
          ticketPrice: 89.99,
          image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          category: 'Concert'
        },
        {
          _id: '102',
          name: 'Tech Conference 2023',
          description: 'Learn about the latest technologies from industry experts',
          dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          venue: 'Convention Center',
          location: { city: 'San Francisco', state: 'CA' },
          ticketPrice: 299.99,
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          category: 'Conference'
        },
        {
          _id: '103',
          name: 'Championship Basketball Game',
          description: 'Watch the final match of the season with the top two teams',
          dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          venue: 'Sports Arena',
          location: { city: 'Chicago', state: 'IL' },
          ticketPrice: 120.00,
          image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          category: 'Sports'
        },
        {
          _id: '104',
          name: 'Contemporary Art Exhibition',
          description: 'Experience modern art from renowned artists around the world',
          dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          venue: 'Modern Art Gallery',
          location: { city: 'Miami', state: 'FL' },
          ticketPrice: 35.00,
          image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          category: 'Art & Culture'
        }
      ];
      
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-slate-200 aspect-[3/2] animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-8 bg-indigo-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event._id} 
          event={event} 
          onClick={() => handleEventClick(event._id)}
        />
      ))}
    </div>
  );
}

export default FeaturedEvents;