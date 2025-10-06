import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

function VerificationPage() {
  const { loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  useEffect(() => {
    // Get email from location state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const checkVerificationStatus = async () => {
    if (!email) return;
    
    try {
      setVerificationStatus('checking');
      
      // Check if user exists and is verified
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error) {
        console.error('Verification check error:', error);
        setVerificationStatus('error');
        return;
      }
      
      if (data?.user?.email_confirmed_at) {
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('not_verified');
      }
      
    } catch (err) {
      console.error('Verification check failed:', err);
      setVerificationStatus('error');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg border-violet-900 border">
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-primary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" 
            />
          </svg>
          
          <h1 className="mt-4 text-2xl font-bold">Verify your email</h1>
          
          {email && (
            <p className="mt-2 text-primary font-medium">
              {email}
            </p>
          )}
          
          <p className="mt-2 text-muted-foreground">
            We've sent a verification link to your email address.
          </p>
        </div>

        <div className="bg-primary/10 text-primary p-4 rounded-md text-sm">
          <p className="font-medium">Please check your inbox and click the verification link to complete your registration.</p>
          
          {verificationStatus === 'checking' && (
            <p className="mt-2 text-blue-600">Checking verification status...</p>
          )}
          
          {verificationStatus === 'verified' && (
            <p className="mt-2 text-green-600 font-medium">Your email has been verified! You can now log in.</p>
          )}
          
          {verificationStatus === 'not_verified' && (
            <p className="mt-2 text-orange-600">Your email is not yet verified. Please check your inbox and click the verification link.</p>
          )}
          
          {verificationStatus === 'error' && (
            <p className="mt-2 text-red-600">Unable to check verification status. Please try again later.</p>
          )}
        </div>

        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            The verification link will expire in 24 hours. If you don't see the email, check your spam folder.
          </p>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={checkVerificationStatus}
              disabled={!email || verificationStatus === 'checking'}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {verificationStatus === 'checking' ? 'Checking...' : 'Check Verification Status'}
            </button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm">
              Already verified your email?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm">
              Didn't receive the email?{' '}
              <Link to="/resend-verification" className="text-primary hover:underline">
                Resend verification email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;