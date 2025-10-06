import React, { useState, useEffect } from 'react';

function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Event-Goer",
      quote: "This platform made finding and booking tickets so easy! The seat selection feature is amazing, and I love the e-ticket delivery. Will definitely use for all my future events.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      name: "Michael Thompson",
      role: "Concert Enthusiast",
      quote: "I've tried many ticketing services, but EventTix is by far the best. The user interface is intuitive, prices are fair, and I never have to worry about ticket security.",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Theater Lover",
      quote: "As someone who attends a lot of shows, I appreciate how easy EventTix makes the booking process. The mobile tickets are convenient, and customer service is top-notch.",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    },
    {
      id: 4,
      name: "David Chen",
      role: "Conference Organizer",
      quote: "As an event organizer, I love how easy it is to set up and manage ticket sales. The dashboard gives me all the insights I need to track performance.",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg"
    }
  ];
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {/* Testimonial */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 md:p-10 relative">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hidden md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/4 flex flex-col items-center md:items-start">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
              <img 
                src={testimonials[currentIndex].avatar} 
                alt={testimonials[currentIndex].name} 
                className="rounded-full object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonials[currentIndex].name)}&background=random`;
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-600 opacity-75"></div>
            </div>
            <h3 className="font-bold text-lg">{testimonials[currentIndex].name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{testimonials[currentIndex].role}</p>
          </div>
          
          <div className="md:w-3/4 text-center md:text-left">
            <svg className="h-10 w-10 text-indigo-200 dark:text-indigo-800 mb-4 hidden md:block" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10 8v6a4 4 0 01-4 4H4v4h2a8 8 0 008-8V8h-4zm12 0v6a4 4 0 01-4 4h-2v4h2a8 8 0 008-8V8h-4z" />
            </svg>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 italic">
              "{testimonials[currentIndex].quote}"
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 right-0 -mt-8 flex justify-between px-4 md:px-0">
        <button
          onClick={goToPrevious}
          className="bg-white dark:bg-slate-700 rounded-full p-2 shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
          aria-label="Previous testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="bg-white dark:bg-slate-700 rounded-full p-2 shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
          aria-label="Next testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TestimonialCarousel;