import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exportEventData } from '../../utils/exportUtils';

function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample event data for demonstration
  const mockEvents = [
    { id: 1, title: 'Chennai Music Festival', category: 'Music', date: '2025-11-15', time: '18:00', location: 'Chennai', organizer: 'Priya Singh', status: 'upcoming', ticketsSold: 245 },
    { id: 2, title: 'Comedy Night with Kapil', category: 'Comedy', date: '2025-10-25', time: '20:00', location: 'Bangalore', organizer: 'Arjun Reddy', status: 'upcoming', ticketsSold: 189 },
    { id: 3, title: 'Bharatanatyam Performance', category: 'Dance', date: '2025-11-05', time: '17:30', location: 'Chennai', organizer: 'Lakshmi Nair', status: 'upcoming', ticketsSold: 120 },
    { id: 4, title: 'IPL Chennai vs Mumbai', category: 'Sports', date: '2025-12-10', time: '19:00', location: 'Chennai', organizer: 'Rahul Dravid', status: 'upcoming', ticketsSold: 5000 },
    { id: 5, title: 'Web Development Workshop', category: 'Workshop', date: '2025-10-12', time: '10:00', location: 'Hyderabad', organizer: 'Vikram Patel', status: 'completed', ticketsSold: 45 },
    { id: 6, title: 'Art Exhibition', category: 'Exhibition', date: '2025-09-28', time: '09:00', location: 'Delhi', organizer: 'Meera Sharma', status: 'completed', ticketsSold: 75 },
    { id: 7, title: 'Tech Conference 2025', category: 'Conference', date: '2025-11-20', time: '09:30', location: 'Bangalore', organizer: 'Amit Shah', status: 'upcoming', ticketsSold: 320 },
    { id: 8, title: 'Diwali Cultural Show', category: 'Festival', date: '2025-11-01', time: '18:30', location: 'Mumbai', organizer: 'Raj Kumar', status: 'upcoming', ticketsSold: 450 },
    { id: 9, title: 'Classical Music Night', category: 'Music', date: '2025-10-18', time: '19:00', location: 'Chennai', organizer: 'Nirmala Devi', status: 'upcoming', ticketsSold: 210 },
    { id: 10, title: 'Startup Pitch Event', category: 'Business', date: '2025-10-30', time: '14:00', location: 'Pune', organizer: 'Sachin Tendulkar', status: 'upcoming', ticketsSold: 85 },
    { id: 11, title: 'Poetry Slam', category: 'Literature', date: '2025-09-15', time: '17:00', location: 'Kolkata', organizer: 'MS Dhoni', status: 'completed', ticketsSold: 60 },
    { id: 12, title: 'Photography Workshop', category: 'Workshop', date: '2025-11-08', time: '11:00', location: 'Chennai', organizer: 'Virat Kohli', status: 'upcoming', ticketsSold: 30 },
    { id: 13, title: 'Food Festival', category: 'Festival', date: '2025-12-05', time: '12:00', location: 'Mumbai', organizer: 'Rohit Sharma', status: 'upcoming', ticketsSold: 750 },
    { id: 14, title: 'Yoga Retreat', category: 'Health', date: '2025-11-12', time: '06:30', location: 'Rishikesh', organizer: 'Priya Singh', status: 'upcoming', ticketsSold: 40 },
    { id: 15, title: 'Film Screening', category: 'Cinema', date: '2025-10-22', time: '19:30', location: 'Chennai', organizer: 'Arjun Reddy', status: 'upcoming', ticketsSold: 175 },
  ];

  useEffect(() => {
    // Simulate API call to fetch events
    const fetchEvents = async () => {
      try {
        setTimeout(() => {
          setEvents(mockEvents);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(events.map(event => event.category))];

  // Handle search and filtering
  const filteredEvents = events.filter(event => {
    // Filter by search query
    const matchesQuery = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  // Handle sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle pagination
  const totalPages = Math.ceil(sortedEvents.length / pageSize);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleExportEvents = () => {
    exportEventData(filteredEvents);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Event Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportEvents}
            className="flex items-center bg-violet-700 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
          <Link 
            to="/admin/events/create"
            className="flex items-center bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Event
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-red-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Events</p>
              <p className="text-xl font-bold text-white">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-blue-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Upcoming Events</p>
              <p className="text-xl font-bold text-white">{events.filter(e => e.status === 'upcoming').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-green-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed Events</p>
              <p className="text-xl font-bold text-white">{events.filter(e => e.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-violet-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-violet-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Tickets Sold</p>
              <p className="text-xl font-bold text-white">{events.reduce((sum, e) => sum + e.ticketsSold, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-red-900/20 rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, organizer, or location..."
              className="block w-full bg-black/40 border border-red-900/20 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-red-500 focus:border-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="block w-full bg-black/40 border border-red-900/20 rounded-lg px-4 py-2 text-white focus:ring-red-500 focus:border-red-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            className="block w-full bg-black/40 border border-red-900/20 rounded-lg px-4 py-2 text-white focus:ring-red-500 focus:border-red-500"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-gray-900 border border-red-900/20 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/40">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title
                    {sortField === 'title' && (
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Organizer</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('ticketsSold')}
                >
                  <div className="flex items-center">
                    Tickets Sold
                    {sortField === 'ticketsSold' && (
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-black/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-900/20 text-red-400">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.organizer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'upcoming' ? 'bg-blue-900/20 text-blue-400' : 
                      'bg-green-900/20 text-green-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.ticketsSold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-violet-400 hover:text-violet-300">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-blue-400 hover:text-blue-300">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-black/20 border-t border-red-900/20 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-white">
              {Math.min(currentPage * pageSize, filteredEvents.length)}
            </span>{' '}
            of <span className="font-medium text-white">{filteredEvents.length}</span> events
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-black/40 text-gray-300 hover:bg-black/60'
              }`}
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages).keys()].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page + 1
                      ? 'bg-red-900/40 text-white'
                      : 'bg-black/40 text-gray-300 hover:bg-black/60'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-black/40 text-gray-300 hover:bg-black/60'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEventsPage;