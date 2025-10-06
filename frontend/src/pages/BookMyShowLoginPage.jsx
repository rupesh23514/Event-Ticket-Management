import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';

function BookMyShowLoginPage() {
  const { signIn, signInWithSocial, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Check for redirect message in location state and URL parameters
  useEffect(() => {
    // Check for location state message
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
    }
    
    // Check if this is a verified email redirect
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now log in.');
    }
    
    // Redirect if already logged in
    if (user) {
      const redirectTo = location.state?.redirectTo || '/events';
      navigate(redirectTo);
    }
  }, [location, user, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      // ALWAYS TRY TEST ACCOUNT FIRST for most reliable experience
      if (data.email === 'test@example.com' && data.password === 'password') {
        console.log("Using test account login");
        try {
          await signIn(data.email, data.password);
          const redirectTo = location.state?.redirectTo || '/events';
          navigate(redirectTo);
          return;
        } catch (testError) {
          console.error("Even test account failed:", testError);
          // If test account fails, show special error
          setError("System authentication error. Please try again later.");
          return;
        }
      } else if (data.email === 'admin@example.com' && data.password === 'password123') {
        console.log("Using admin account login");
        try {
          await signIn(data.email, data.password);
          console.log("Admin login successful");
          // Redirect admin to the admin dashboard
          navigate('/admin/dashboard');
          return;
        } catch (adminError) {
          console.error("Admin account login failed:", adminError);
          setError("Admin authentication error. Please try again later.");
          return;
        }
      }
      
      // For normal accounts, use our signIn method which handles both scenarios
      try {
        console.log("Attempting to sign in with:", data.email);
        const result = await signIn(data.email, data.password);
        console.log("Login successful");
        
        // Check if user is admin and redirect accordingly
        const isAdmin = 
          (result?.user?.user_metadata?.role === 'admin') || 
          (result?.user?.role === 'admin') || 
          (result?.data?.user?.user_metadata?.role === 'admin');
        
        if (isAdmin) {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate('/admin/dashboard');
        } else {
          // Regular user - redirect to normal dashboard
          const redirectTo = location.state?.redirectTo || '/events';
          navigate(redirectTo);
        }
      } catch (signInError) {
        console.error("Sign in error:", signInError);
        // If it's an invalid credentials error, show user-friendly message
        if (signInError.message && signInError.message.includes("Invalid login")) {
          setError("Invalid email or password. Try test@example.com / password for testing.");
        } else {
          // For other errors, show the actual error message
          setError(signInError.message || "Login failed. Please try test@example.com / password.");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Supabase social login
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Note: Redirect is handled by Supabase OAuth flow
      
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(`Failed to login with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 text-white p-8 rounded-lg shadow-lg border border-violet-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">Welcome back!</h2>
          <p className="text-sm text-gray-300 mb-6">
            Sign in to continue to your account
          </p>
          
          {redirectMessage && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-4 text-sm">
              {redirectMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">
              {successMessage}
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-red-600 hover:text-red-500">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <path d="M6 12C6 9.3 7.3 6.9 9.5 5.5L6.8 2.8C3.7 4.8 2 8.1 2 12C2 15.9 3.7 19.2 6.8 21.2L9.5 18.5C7.3 17.1 6 14.7 6 12Z" fill="#FFC107"/>
                <path d="M21.8 10H19.7V10H12V14H17.7C16.9 16.3 14.7 18 12 18C8.7 18 6 15.3 6 12C6 8.7 8.7 6 12 6C13.7 6 15.2 6.7 16.3 7.8L19 5.1C17.1 3.3 14.7 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 11.3 21.9 10.6 21.8 10Z" fill="#2196F3"/>
                <path d="M3.2 7.2L5.9 9.1C6.7 7.2 9.1 6 12 6C13.7 6 15.2 6.7 16.3 7.8L19 5.1C17.1 3.3 14.7 2 12 2C8.1 2 4.8 4.1 3.2 7.2Z" fill="#F44336"/>
                <path d="M12 22C14.6 22 16.9 21 18.8 19.3L16 16.8C14.9 17.6 13.5 18 12 18C9.3 18 7.1 16.3 6.3 14H3.5V16.8C5.1 19.9 8.2 22 12 22Z" fill="#00796B"/>
              </svg>
              Google
            </button>
            
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
              Sign up
            </Link>
          </p>
        </div>
        
        {/* For demo purposes */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center mb-2">Test Account</div>
          <button
            type="button"
            onClick={() => {
              const testData = { email: 'test@example.com', password: 'password' };
              onSubmit(testData);
            }}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign in as Test User
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookMyShowLoginPage;