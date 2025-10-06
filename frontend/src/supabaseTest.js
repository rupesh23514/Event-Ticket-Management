import { createClient } from '@supabase/supabase-js';

// Use these hardcoded values for testing
const supabaseUrl = 'https://yrzaxeehoiiyvdgwlzpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyemF4ZWVob2lpeXZkZ3dsenBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDMwMTQsImV4cCI6MjA3NTE3OTAxNH0.nAPssbE9jPqOdcEyd06BCuZoxDNduOsxEYvwWdh3yhk';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export for testing
export default supabase;