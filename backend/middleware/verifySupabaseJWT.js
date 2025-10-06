import supabase from '../config/supabaseConfig.js';

/**
 * Middleware to verify Supabase JWT tokens
 * 
 * This middleware validates the JWT token from Supabase in the Authorization header
 * and adds the user information to the request object for downstream handlers
 */
export const verifySupabaseJWT = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token format' 
      });
    }

    try {
      // Verify the JWT token with Supabase
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) {
        console.error('Supabase token verification error:', error);
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Invalid token' 
        });
      }
      
      // Extract user information from Supabase response
      const { id: userId, email } = data.user;

      // Add user data to request object
      req.user = {
        id: userId,
        email,
        // Add any other user data you need from the token
      };
      
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication'
    });
  }
};

export default verifySupabaseJWT;