import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

const BookMyShowNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Chennai');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  
  // Use AuthContext
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  
  // Create a ref for the location dropdown menu
  const locationDropdownRef = useRef(null);
  
  // Initialize location from localStorage if available
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    }
  }, []);
  
  // Add click outside handler to close location dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (locationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationDropdownOpen]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen(!locationDropdownOpen);
  };
  
  const handleLocationChange = (city) => {
    setCurrentLocation(city);
    // Save to localStorage for persistence
    localStorage.setItem('userLocation', city);
    // Close dropdown after selection
    setLocationDropdownOpen(false);
  };

  const handleLogout = () => {
    // Navigate to the sign out page instead of directly signing out
    navigate('/signout');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events?search=${searchQuery}`);
  };

  // Check if this is the active route
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-violet-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                BookMyEvent
              </Link>
            </div>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for Movies, Events, Plays, Sports and Activities"
                  className="w-full py-2 px-4 pr-10 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-red-300 bg-white/90 text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-0 h-full px-3 text-gray-500"
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* Auth Links - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center text-white space-x-1 py-2 bg-violet-800 hover:bg-violet-900 px-4 rounded-full transition-colors">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Hi, {user.name?.split(' ')[0] || 'User'}</span>
                    {(user.role === 'admin' || user.user_metadata?.role === 'admin') && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-md">Admin</span>
                    )}
                    <svg className="w-4 h-4 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    {(user.role === 'admin' || user.user_metadata?.role === 'admin') ? (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-red-600 font-semibold hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {user.role === 'organizer' && (
                      <Link to="/organizer/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Events
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div></div> 
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMenu} 
                className="text-white p-2"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-12">
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link 
                to="/events" 
                className={`hover:text-violet-400 px-2 py-3 ${isActive('/events') ? 'text-violet-400' : 'text-white'}`}
              >
                Events
              </Link>
              <Link 
                to="/events?category=music" 
                className={`hover:text-violet-400 px-2 py-3 ${location.search?.includes('music') ? 'text-violet-400' : 'text-white'}`}
              >
                Music
              </Link>
              <Link 
                to="/events?category=sports" 
                className={`hover:text-violet-400 px-2 py-3 ${location.search?.includes('sports') ? 'text-violet-400' : 'text-white'}`}
              >
                Sports
              </Link>
              <Link 
                to="/events?category=arts" 
                className={`hover:text-violet-400 px-2 py-3 ${location.search?.includes('arts') ? 'text-violet-400' : 'text-white'}`}
              >
                Arts & Theatre
              </Link>
              <Link 
                to="/events?category=comedy" 
                className={`hover:text-violet-400 px-2 py-3 ${location.search?.includes('comedy') ? 'text-violet-400' : 'text-white'}`}
              >
                Comedy Shows
              </Link>
            </div>
            
            {/* City Selector - Desktop */}
            <div className="hidden md:flex items-center">
              <div ref={locationDropdownRef} className="relative">
                <button 
                  onClick={toggleLocationDropdown}
                  className="flex items-center text-white space-x-1 py-1 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{currentLocation}</span>
                  <svg className={`w-4 h-4 transition-transform ${locationDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {locationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                    <button 
                      onClick={() => handleLocationChange('Chennai')} 
                      className={`block w-full text-left px-4 py-2 text-sm ${currentLocation === 'Chennai' ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-100 hover:text-violet-700'}`}
                    >
                      Chennai
                    </button>
                    <button 
                      onClick={() => handleLocationChange('Coimbatore')} 
                      className={`block w-full text-left px-4 py-2 text-sm ${currentLocation === 'Coimbatore' ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-100 hover:text-violet-700'}`}
                    >
                      Coimbatore
                    </button>
                    <button 
                      onClick={() => handleLocationChange('Madurai')} 
                      className={`block w-full text-left px-4 py-2 text-sm ${currentLocation === 'Madurai' ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-100 hover:text-violet-700'}`}
                    >
                      Madurai
                    </button>
                    <button 
                      onClick={() => handleLocationChange('Salem')} 
                      className={`block w-full text-left px-4 py-2 text-sm ${currentLocation === 'Salem' ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-100 hover:text-violet-700'}`}
                    >
                      Salem
                    </button>
                    <button 
                      onClick={() => handleLocationChange('Tiruchirapalli')} 
                      className={`block w-full text-left px-4 py-2 text-sm ${currentLocation === 'Tiruchirapalli' ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-100 hover:text-violet-700'}`}
                    >
                      Tiruchirapalli
                    </button>
                    <button 
                      onClick={() => handleLocationChange('Tirunelveli')} 
                      className={`block w-full text-left px-4 py-2 text-sm ${currentLocation === 'Tirunelveli' ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-100 hover:text-violet-700'}`}
                    >
                      Tirunelveli
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search events"
                className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-3 text-gray-500"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          
          <div className="space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              All Events
            </Link>
            <Link 
              to="/events?category=music" 
              className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Music
            </Link>
            <Link 
              to="/events?category=sports" 
              className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Sports
            </Link>
            <Link 
              to="/events?category=arts" 
              className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Arts & Theatre
            </Link>
          </div>
          
          {/* City Selector - Mobile */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-600 mb-2">Select City</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    handleLocationChange('Chennai');
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-center rounded-md text-sm ${currentLocation === 'Chennai' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Chennai
                </button>
                <button 
                  onClick={() => {
                    handleLocationChange('Coimbatore');
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-center rounded-md text-sm ${currentLocation === 'Coimbatore' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Coimbatore
                </button>
                <button 
                  onClick={() => {
                    handleLocationChange('Madurai');
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-center rounded-md text-sm ${currentLocation === 'Madurai' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Madurai
                </button>
                <button 
                  onClick={() => {
                    handleLocationChange('Salem');
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-center rounded-md text-sm ${currentLocation === 'Salem' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Salem
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-2 mb-2 bg-violet-100 rounded-md">
                  <div className="font-semibold text-violet-900">Hello, {user.name?.split(' ')[0] || 'User'}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  {(user.role === 'admin' || user.user_metadata?.role === 'admin') && (
                    <div className="mt-1 text-xs inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded">Admin</div>
                  )}
                </div>
                {(user.role === 'admin' || user.user_metadata?.role === 'admin') ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link 
                  to="/register" 
                  className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default BookMyShowNavbar;