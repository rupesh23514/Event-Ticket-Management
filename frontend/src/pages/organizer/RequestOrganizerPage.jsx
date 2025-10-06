import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const RequestOrganizerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    websiteUrl: '',
    reason: '',
    eventExperience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      await axios.post('/api/users/request-organizer', formData);
      
      toast({
        title: "Request Submitted",
        description: "Your organizer access request has been submitted successfully. We'll review it shortly.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting organizer request:', error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role === 'organizer') {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-50 text-green-800 p-4 rounded-md text-center">
          <h2 className="text-xl font-bold">You're already an organizer!</h2>
          <p className="mt-2">You already have organizer privileges and can create events.</p>
          <button 
            onClick={() => navigate('/dashboard/events/create')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Create an Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Request Organizer Access</h1>
      
      <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-6">
        <p>
          Becoming an organizer allows you to create and manage events on our platform. 
          Please provide the following information so we can review your request.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-6">
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium mb-1">
            Organization Name*
          </label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium mb-1">
            Website URL
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            placeholder="https://www.yourorganization.com"
          />
        </div>
        
        <div>
          <label htmlFor="eventExperience" className="block text-sm font-medium mb-1">
            Previous Event Experience*
          </label>
          <textarea
            id="eventExperience"
            name="eventExperience"
            rows="3"
            value={formData.eventExperience}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            placeholder="Describe your experience organizing events"
            required
          />
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-1">
            Why do you want to organize events on our platform?*
          </label>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="flex justify-end pt-4">
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
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestOrganizerPage;