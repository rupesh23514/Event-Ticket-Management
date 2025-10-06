import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-black text-white">
      <div className="text-center">
        {/* Visual element */}
        <div className="mb-8 relative">
          <div className="text-[15rem] font-extrabold leading-none text-primary/10">404</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg className="h-32 w-32 text-primary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold">Page Not Found</h2>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg"
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go Home
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate(user ? '/user/dashboard' : '/events')}
            className="border-primary text-primary hover:bg-primary/5"
          >
            {user ? 'Go to Dashboard' : 'Browse Events'}
          </Button>
        </div>
        
        <div className="mt-12 text-muted-foreground">
          <p>Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;