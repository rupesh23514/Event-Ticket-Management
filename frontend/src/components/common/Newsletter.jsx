import React, { useState } from 'react';
import { Button } from '../ui/button';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about upcoming events, exclusive offers, and special promotions.
        </p>
        
        {subscribed ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm max-w-md mx-auto">
            <svg 
              className="mx-auto h-12 w-12 text-green-500 dark:text-green-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
            <p className="text-slate-600 dark:text-slate-400">
              You'll receive our newsletter with the latest events and offers directly to your inbox.
            </p>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              required
            />
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;