import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const EventCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venueType: 'indoor',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    eventDate: {
      startDate: '',
      endDate: '',
      doorsOpen: '',
    },
    ticketTiers: [
      {
        name: 'General Admission',
        price: 0,
        capacity: 100,
        description: 'Standard entry ticket',
      }
    ],
    refundPolicy: 'No refunds',
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTicketTierChange = (index, field, value) => {
    const updatedTiers = [...formData.ticketTiers];
    updatedTiers[index][field] = field === 'price' || field === 'capacity' 
      ? Number(value) 
      : value;
    
    setFormData({
      ...formData,
      ticketTiers: updatedTiers
    });
  };

  const addTicketTier = () => {
    setFormData({
      ...formData,
      ticketTiers: [
        ...formData.ticketTiers,
        {
          name: '',
          price: 0,
          capacity: 50,
          description: '',
        }
      ]
    });
  };

  const removeTicketTier = (index) => {
    if (formData.ticketTiers.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one ticket tier",
        variant: "destructive",
      });
      return;
    }

    const updatedTiers = [...formData.ticketTiers];
    updatedTiers.splice(index, 1);
    setFormData({
      ...formData,
      ticketTiers: updatedTiers
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData({
      ...formData,
      tags
    });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // First, upload poster image to Cloudinary via backend
      const posterData = new FormData();
      posterData.append('file', posterFile);
      
      const uploadResponse = await axios.post('/api/events/upload-image', posterData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const posterImage = uploadResponse.data;
      
      // Then create event
      const response = await axios.post('/api/events', {
        ...formData,
        posterImage,
      });
      
      toast({
        title: "Success!",
        description: "Event created successfully",
      });
      
      navigate(`/dashboard/events/${response.data._id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if user is an organizer or admin
  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="mt-2">You need organizer privileges to create events.</p>
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
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Event Title*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
                <option value="comedy">Comedy</option>
                <option value="exhibition">Exhibition</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="venueType" className="block text-sm font-medium mb-1">
                Venue Type*
              </label>
              <select
                id="venueType"
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="hybrid">Hybrid</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="poster" className="block text-sm font-medium mb-1">
                Event Poster*
              </label>
              <input
                id="poster"
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
              {posterPreview && (
                <div className="mt-2">
                  <img 
                    src={posterPreview} 
                    alt="Poster preview" 
                    className="h-40 object-contain" 
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Event Location</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="location.address" className="block text-sm font-medium mb-1">
                Address*
              </label>
              <input
                id="location.address"
                name="location.address"
                type="text"
                value={formData.location.address}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location.city" className="block text-sm font-medium mb-1">
                  City*
                </label>
                <input
                  id="location.city"
                  name="location.city"
                  type="text"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location.state" className="block text-sm font-medium mb-1">
                  State/Province*
                </label>
                <input
                  id="location.state"
                  name="location.state"
                  type="text"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location.country" className="block text-sm font-medium mb-1">
                  Country*
                </label>
                <input
                  id="location.country"
                  name="location.country"
                  type="text"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location.zipCode" className="block text-sm font-medium mb-1">
                  Zip/Postal Code*
                </label>
                <input
                  id="location.zipCode"
                  name="location.zipCode"
                  type="text"
                  value={formData.location.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Date & Time */}
        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Date & Time</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate.startDate" className="block text-sm font-medium mb-1">
                  Start Date & Time*
                </label>
                <input
                  id="eventDate.startDate"
                  name="eventDate.startDate"
                  type="datetime-local"
                  value={formData.eventDate.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="eventDate.endDate" className="block text-sm font-medium mb-1">
                  End Date & Time*
                </label>
                <input
                  id="eventDate.endDate"
                  name="eventDate.endDate"
                  type="datetime-local"
                  value={formData.eventDate.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="eventDate.doorsOpen" className="block text-sm font-medium mb-1">
                Doors Open*
              </label>
              <input
                id="eventDate.doorsOpen"
                name="eventDate.doorsOpen"
                type="datetime-local"
                value={formData.eventDate.doorsOpen}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </section>

        {/* Ticket Tiers */}
        <section className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ticket Tiers</h2>
            <button
              type="button"
              onClick={addTicketTier}
              className="text-primary hover:text-primary/80"
            >
              + Add Tier
            </button>
          </div>
          
          {formData.ticketTiers.map((tier, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-background">
              <div className="flex justify-between">
                <h3 className="font-medium">Ticket Tier {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeTicketTier(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => handleTicketTierChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price ($)*
                    </label>
                    <input
                      type="number"
                      value={tier.price}
                      min="0"
                      step="0.01"
                      onChange={(e) => handleTicketTierChange(index, 'price', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Capacity*
                    </label>
                    <input
                      type="number"
                      value={tier.capacity}
                      min="1"
                      onChange={(e) => handleTicketTierChange(index, 'capacity', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => handleTicketTierChange(index, 'description', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Additional Information */}
        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="refundPolicy" className="block text-sm font-medium mb-1">
                Refund Policy*
              </label>
              <textarea
                id="refundPolicy"
                name="refundPolicy"
                rows="3"
                value={formData.refundPolicy}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                placeholder="music, festival, outdoor"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/events')}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreatePage;