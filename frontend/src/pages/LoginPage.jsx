import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

function LoginPage() {
  const { signIn, signInWithSocial } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Check for email verification success
  useEffect(() => {
    // Check if this is a verified email redirect
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now log in.');
    }
  }, [location]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Check for test credentials directly first
      if (data.email === 'test@example.com' && data.password === 'password') {
        // Create mock user directly
        const mockUser = {
          id: '123456',
          email: data.email,
          name: 'Test User',
          role: 'user',
          isEmailVerified: true,
          token: 'mock-jwt-token'
        };
        
        // Store in localStorage manually
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Redirect to home page or dashboard
        navigate('/events');
        return;
      }
      
      // Check for admin credentials
      if (data.email === 'admin@example.com' && data.password === 'password123') {
        try {
          await signIn(data.email, data.password);
          console.log("Admin login successful");
          // Redirect admin to the admin dashboard
          navigate('/admin/dashboard');
          return;
        } catch (adminError) {
          console.error("Admin login failed:", adminError);
          setError("Admin authentication error. Please try again later.");
          return;
        }
      }
      
      // If not test or admin credentials, use the AuthContext signIn function
      try {
        const result = await signIn(data.email, data.password);
        
        // Check if the user has admin role
        const isAdmin = 
          (result?.user?.user_metadata?.role === 'admin') || 
          (result?.user?.role === 'admin') ||
          (result?.data?.user?.user_metadata?.role === 'admin');
          
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (authError) {
        // If backend auth fails, suggest test account
        throw new Error('Authentication failed. Try test@example.com / password');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Show friendly error message
      if (err.isConnectionError) {
        setError(err.friendlyMessage || 'Network error. Use test@example.com / password');
      } else {
        setError(err.message || 'Failed to sign in. Try test@example.com / password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      setError('');
      
      await signInWithSocial(provider);
      
      // The redirect will be handled by the OAuth provider
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(err.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg border-violet-900 border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground mt-2">Welcome back to EventTix</p>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">
            {successMessage}
          </div>
        )}
        
        {/* Test credentials helper */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
          <p><strong>Test Account:</strong></p>
          <p>Email: test@example.com</p>
          <p>Password: password</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                }
              })}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                }
              })}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/reset-password" className="text-primary hover:text-primary/90">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin('google')}
            className="py-2 px-4 border rounded-md hover:bg-accent transition-colors flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="#4285F4"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            onClick={() => handleSocialLogin('github')}
            className="py-2 px-4 border rounded-md hover:bg-accent transition-colors flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                fill="#24292E"
              />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;