import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { format } from 'date-fns';
import { Loader2, PlusCircle, Edit2, BarChart, Trash2, Eye } from 'lucide-react';

const EventManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Fetch organizer's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/events/organizer');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load your events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  // Filter events based on status
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.status === filter);
  
  // Handle event deletion
  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`/api/events/${eventId}`);
      
      setEvents(events.filter(event => event._id !== eventId));
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  // Handle event status update (publish/unpublish)
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await axios.patch(`/api/events/${eventId}/status`, { status: newStatus });
      
      // Update local state
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: newStatus } : event
      ));
      
      toast({
        title: "Success",
        description: `Event ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Error",
        description: `Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} event`,
        variant: "destructive",
      });
    }
  };

  // Check if user is an organizer or admin
  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="mt-2">You need organizer privileges to manage events.</p>
          <button 
            onClick={() => navigate('/dashboard/request-organizer')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Request Organizer Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Your Events</h1>
        <Link 
          to="/dashboard/events/create"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Create Event</span>
        </Link>
      </div>
      
      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-md ${
            filter === 'draft' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
        >
          Drafts
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-md ${
            filter === 'published' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-md ${
            filter === 'cancelled' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Events listing */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No events found</h2>
          {filter !== 'all' ? (
            <p className="text-muted-foreground mb-4">
              No {filter} events found. Try a different filter or create a new event.
            </p>
          ) : (
            <p className="text-muted-foreground mb-4">
              You haven't created any events yet. Start by creating your first event.
            </p>
          )}
          <Link
            to="/dashboard/events/create"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <PlusCircle size={18} className="mr-2" />
            Create New Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event._id} 
              className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="flex h-40">
                <img 
                  src={event.posterImage?.url} 
                  alt={event.title}
                  className="w-1/3 h-full object-cover"
                />
                <div className="p-4 flex flex-col justify-between w-2/3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${event.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                        ${event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${event.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(event.eventDate.startDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Tickets sold: {event.ticketsSold || 0}</span>
                    <span className="mx-2">|</span>
                    <span>Revenue: ${event.revenue?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-2 grid grid-cols-5 gap-1">
                <Link
                  to={`/events/${event._id}`}
                  className="flex flex-col items-center p-2 hover:bg-secondary rounded-md text-sm"
                >
                  <Eye size={16} />
                  <span>View</span>
                </Link>
                
                <Link
                  to={`/dashboard/events/${event._id}/edit`}
                  className="flex flex-col items-center p-2 hover:bg-secondary rounded-md text-sm"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </Link>
                
                <Link
                  to={`/dashboard/events/${event._id}/analytics`}
                  className="flex flex-col items-center p-2 hover:bg-secondary rounded-md text-sm"
                >
                  <BarChart size={16} />
                  <span>Analytics</span>
                </Link>
                
                <button
                  onClick={() => handleUpdateStatus(
                    event._id, 
                    event.status === 'published' ? 'draft' : 'published'
                  )}
                  className="flex flex-col items-center p-2 hover:bg-secondary rounded-md text-sm"
                >
                  {event.status === 'published' ? (
                    <>
                      <span className="i-lucide-eye-off" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <span className="i-lucide-globe" />
                      <span>Publish</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex flex-col items-center p-2 hover:bg-destructive/10 rounded-md text-sm text-destructive"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventManagementPage;