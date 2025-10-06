import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignOutPage = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('signing-out');
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Start the progress bar
        const interval = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prevProgress + 2;
          });
        }, 20);

        // Actual sign out
        await signOut();
        
        // Update status and finish progress
        setStatus('success');
        clearInterval(interval);
        setProgress(100);
        
        // Redirect after a delay
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setStatus('error');
        console.error('Sign out error:', error);
      }
    };

    performSignOut();
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Sign Out</h2>
          
          <div className="mt-6">
            {status === 'signing-out' && (
              <p className="text-lg text-gray-600">Signing you out...</p>
            )}
            {status === 'success' && (
              <p className="text-lg text-green-600">You've been signed out successfully</p>
            )}
            {status === 'error' && (
              <p className="text-lg text-red-600">Failed to sign out. Please try again.</p>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
            <div 
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {status === 'success' && (
            <div className="mt-8">
              <Link to="/" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-5 text-center w-full text-gray-500">
        <p>BookMyEvent — Your premier destination for booking events</p>
      </div>
    </div>
  );
};

export default SignOutPage;