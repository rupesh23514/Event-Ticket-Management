import { supabase } from '../supabaseClient';

// Function to test Supabase connection and auth
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test simple query to check connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('_not_exists_test_table')
      .select('*')
      .limit(1);
      
    if (connectionError && connectionError.code !== 'PGRST116') {
      // If we get errors other than "relation does not exist", there's a connection issue
      console.error('Supabase connection test failed:', connectionError);
      return {
        success: false,
        message: `Connection error: ${connectionError.message}`,
        error: connectionError
      };
    }
    
    console.log('Supabase connection successful');
    
    // Test auth system
    console.log('Testing Supabase auth system...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Supabase auth test failed:', authError);
      return {
        success: false,
        message: `Auth system error: ${authError.message}`,
        error: authError
      };
    }
    
    console.log('Supabase auth system is working');
    return {
      success: true,
      message: 'Supabase connection and auth system are working properly',
      session: authData.session
    };
    
  } catch (error) {
    console.error('Unexpected error during Supabase test:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    };
  }
};

// Export a function to test user signup
export const testSupabaseSignup = async (email, password) => {
  try {
    console.log(`Testing signup with ${email}...`);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
      }
    });
    
    if (error) {
      console.error('Signup test failed:', error);
      return {
        success: false,
        message: `Signup error: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Signup test successful',
      data
    };
  } catch (error) {
    console.error('Unexpected error during signup test:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    };
  }
};

// Function to test login with email and password
export const testSupabaseLogin = async (email, password) => {
  try {
    console.log(`Testing login with ${email}...`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login test failed:', error);
      return {
        success: false,
        message: `Login error: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Login test successful',
      data
    };
  } catch (error) {
    console.error('Unexpected error during login test:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    };
  }
};

// Function to check if a user exists in Supabase
export const checkUserExists = async (email) => {
  try {
    // This is a hack since Supabase doesn't provide a direct way to check if a user exists
    // We'll try a password reset request - if user exists, it'll succeed, otherwise fail
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error && error.message.includes('not found')) {
      return {
        exists: false,
        message: 'User does not exist'
      };
    } else if (error) {
      return {
        exists: false,
        message: `Error checking user: ${error.message}`
      };
    }
    
    return {
      exists: true,
      message: 'User exists (password reset email sent)'
    };
  } catch (error) {
    return {
      exists: false,
      message: `Error: ${error.message}`
    };
  }
};