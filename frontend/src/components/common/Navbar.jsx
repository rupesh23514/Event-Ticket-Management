import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });
  
  // Use AuthContext instead of hardcoded values
  const { user, signOut, loading } = useContext(AuthContext);
  
  // Check authentication status on load and when user changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    // Determine auth state using both context and localStorage
    const effectiveUser = user || storedUser;
    const isAuthenticated = !!effectiveUser;
    
    setAuthState({
      isAuthenticated,
      user: effectiveUser,
      role: effectiveUser?.role || null
    });
  }, [user]);
  
  const { isAuthenticated, role } = authState;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-black shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-violet-400 hover:text-violet-300">
                EventTix
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="border-transparent text-white hover:border-violet-500 hover:text-violet-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className="border-transparent text-white hover:border-violet-500 hover:text-violet-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Events
              </Link>
              {isAuthenticated && (authState.user?.role === 'organizer' || authState.user?.role === 'admin') && (
                <Link 
                  to="/dashboard" 
                  className="border-transparent text-white hover:border-violet-500 hover:text-violet-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              <Link 
                to="/about" 
                className="border-transparent text-white hover:border-violet-500 hover:text-violet-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="border-transparent text-white hover:border-violet-500 hover:text-violet-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="text-violet-300 hover:text-violet-400"
                >
                  {authState.user?.name ? `Hi, ${authState.user.name.split(' ')[0]}` : 'My Profile'}
                </Link>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-violet-400 hover:text-violet-300 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-black text-white`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-gray-900 hover:border-violet-500 hover:text-violet-300"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-gray-900 hover:border-violet-500 hover:text-violet-300"
            onClick={toggleMenu}
          >
            Events
          </Link>
          {effectiveIsAuthenticated && (effectiveUser?.role === 'organizer' || effectiveUser?.role === 'admin') && (
            <Link 
              to="/dashboard" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-gray-900 hover:border-violet-500 hover:text-violet-300"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
          )}
          <Link 
            to="/about" 
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-gray-900 hover:border-violet-500 hover:text-violet-300"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-gray-900 hover:border-violet-500 hover:text-violet-300"
            onClick={toggleMenu}
          >
            Contact
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {isAuthenticated ? (
            <div className="space-y-1">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-base font-medium text-violet-300 hover:text-violet-400 hover:bg-gray-900"
                onClick={toggleMenu}
              >
                {authState.user?.name ? `Hi, ${authState.user.name.split(' ')[0]}` : 'My Profile'}
              </Link>
              <button
                className="w-full text-left block px-4 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-900"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-4 flex flex-col space-y-2">
              <Button
                className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}
              >
                Login
              </Button>
              <Button
                className="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  navigate('/register');
                  toggleMenu();
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;