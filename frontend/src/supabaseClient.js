import { createClient } from '@supabase/supabase-js';

// Use environment variables (with fallback to hardcoded values for safety)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yrzaxeehoiiyvdgwlzpd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyemF4ZWVob2lpeXZkZ3dsenBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDMwMTQsImV4cCI6MjA3NTE3OTAxNH0.nAPssbE9jPqOdcEyd06BCuZoxDNduOsxEYvwWdh3yhk';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a mock auth function for testing
export const getMockUser = () => {
  return {
    id: '123456',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    isEmailVerified: true,
    token: 'mock-jwt-token'
  };
};