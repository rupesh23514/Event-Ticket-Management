import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import FeaturedEvents from '../components/events/FeaturedEvents';
import CategoriesSection from '../components/events/CategoriesSection';
import Newsletter from '../components/common/Newsletter';
import EventHighlights from '../components/events/EventHighlights';
import TestimonialCarousel from '../components/common/TestimonialCarousel';

function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalOrganizers: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    // In a real app, fetch statistics from API
    // For this example, we'll use mock data
    setTimeout(() => {
      setStats({
        totalEvents: 865,
        totalOrganizers: 145,
        totalAttendees: 75000,
        upcomingEvents: 258,
      });
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col gap-12 bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-violet-600/90 dark:from-indigo-900/90 dark:to-violet-900/90 mix-blend-multiply"></div>
        <div className="relative py-24 px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white">
              Book Your Next Adventure
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Find and book tickets to the best concerts, sports, theater, and more with our secure
              ticketing platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/events')}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                Browse Events
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white/20"
              >
                Organize Event
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {stats.totalEvents.toLocaleString()}+
            </div>
            <div className="text-slate-600 dark:text-slate-400">Total Events</div>
          </div>
          <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
            <div className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              {stats.totalOrganizers.toLocaleString()}+
            </div>
            <div className="text-slate-600 dark:text-slate-400">Event Organizers</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {stats.totalAttendees.toLocaleString()}+
            </div>
            <div className="text-slate-600 dark:text-slate-400">Happy Attendees</div>
          </div>
          <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
            <div className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              {stats.upcomingEvents.toLocaleString()}+
            </div>
            <div className="text-slate-600 dark:text-slate-400">Upcoming Events</div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            View all events →
          </Link>
        </div>
        
        <FeaturedEvents />
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-5 rounded-full mb-6">
              <svg
                className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Discover Events</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Find events that match your interests from our curated selection of top experiences.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-5 rounded-full mb-6">
              <svg
                className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Book Tickets</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Select your preferred seats and securely purchase tickets in just a few clicks.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-5 rounded-full mb-6">
              <svg
                className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Attend & Enjoy</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Get your e-tickets instantly and enjoy a seamless experience at the venue.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        <CategoriesSection />
      </section>
      
      {/* Event Highlights */}
      <EventHighlights />
      
      {/* Testimonials */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
        <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
        <TestimonialCarousel />
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-800 dark:to-violet-800 rounded-3xl text-white">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Amazing Events?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of people who discover and attend events through our platform every day.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/events')}
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              Explore Events
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/register')}
              className="text-white border-white hover:bg-white/20"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Recently Shared Events */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Recently Shared Events</h2>
          
          <div className="bg-gray-900 border border-violet-800/20 rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className="bg-violet-900/20 p-4 rounded-xl mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Share Your Events</h3>
                    <p className="text-gray-400">Help others discover amazing events in Tamil Nadu</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Our community has shared <span className="font-bold text-violet-400">245</span> events this month, 
                  reaching over <span className="font-bold text-violet-400">10,000+</span> users across Tamil Nadu.
                </p>
                
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white rounded-md transition-colors">
                    Share an Event
                  </button>
                  <button className="px-4 py-2 border border-violet-700 text-violet-400 hover:bg-violet-900/20 rounded-md transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black/40 p-4 rounded-lg">
                  <h4 className="text-3xl font-bold text-violet-400 mb-1">12</h4>
                  <p className="text-sm text-gray-400">Events shared today</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg">
                  <h4 className="text-3xl font-bold text-red-400 mb-1">48</h4>
                  <p className="text-sm text-gray-400">Events shared this week</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg">
                  <h4 className="text-3xl font-bold text-blue-400 mb-1">245</h4>
                  <p className="text-sm text-gray-400">Events shared this month</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg">
                  <h4 className="text-3xl font-bold text-green-400 mb-1">1,270</h4>
                  <p className="text-sm text-gray-400">Events shared this year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;