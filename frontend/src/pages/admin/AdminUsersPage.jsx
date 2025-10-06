import React, { useState, useEffect } from 'react';
import { exportUserData } from '../../utils/exportUtils';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample user data for demonstration
  const mockUsers = [
    { id: 1, name: 'Raj Kumar', email: 'raj@example.com', phone: '9876543210', role: 'user', status: 'active', registeredDate: '2025-09-15' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', role: 'organizer', status: 'active', registeredDate: '2025-09-18' },
    { id: 3, name: 'Vikram Patel', email: 'vikram@example.com', phone: '9876543212', role: 'user', status: 'active', registeredDate: '2025-09-20' },
    { id: 4, name: 'Lakshmi Nair', email: 'lakshmi@example.com', phone: '9876543213', role: 'user', status: 'inactive', registeredDate: '2025-09-22' },
    { id: 5, name: 'Arjun Reddy', email: 'arjun@example.com', phone: '9876543214', role: 'organizer', status: 'active', registeredDate: '2025-09-25' },
    { id: 6, name: 'Meera Sharma', email: 'meera@example.com', phone: '9876543215', role: 'admin', status: 'active', registeredDate: '2025-09-10' },
    { id: 7, name: 'Rajesh Khanna', email: 'rajesh@example.com', phone: '9876543216', role: 'user', status: 'active', registeredDate: '2025-09-28' },
    { id: 8, name: 'Sonia Gandhi', email: 'sonia@example.com', phone: '9876543217', role: 'user', status: 'inactive', registeredDate: '2025-09-05' },
    { id: 9, name: 'Amit Shah', email: 'amit@example.com', phone: '9876543218', role: 'organizer', status: 'active', registeredDate: '2025-09-12' },
    { id: 10, name: 'Nirmala Devi', email: 'nirmala@example.com', phone: '9876543219', role: 'user', status: 'active', registeredDate: '2025-09-30' },
    { id: 11, name: 'Rahul Dravid', email: 'rahul@example.com', phone: '9876543220', role: 'user', status: 'active', registeredDate: '2025-10-01' },
    { id: 12, name: 'Sachin Tendulkar', email: 'sachin@example.com', phone: '9876543221', role: 'organizer', status: 'active', registeredDate: '2025-10-02' },
    { id: 13, name: 'MS Dhoni', email: 'dhoni@example.com', phone: '9876543222', role: 'user', status: 'active', registeredDate: '2025-10-03' },
    { id: 14, name: 'Virat Kohli', email: 'virat@example.com', phone: '9876543223', role: 'user', status: 'active', registeredDate: '2025-10-04' },
    { id: 15, name: 'Rohit Sharma', email: 'rohit@example.com', phone: '9876543224', role: 'admin', status: 'active', registeredDate: '2025-10-05' },
  ];

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        setTimeout(() => {
          setUsers(mockUsers);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search and filtering
  const filteredUsers = users.filter(user => {
    // Filter by search query
    const matchesQuery = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    // Filter by role
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesQuery && matchesRole;
  });

  // Handle sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice(
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

  const handleExportUserData = () => {
    // Map users data to expected format
    const usersForExport = filteredUsers.map(user => ({
      id: user.id,
      fullName: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.registeredDate,
      lastLogin: user.lastLoginDate || user.registeredDate
    }));
    
    exportUserData(usersForExport);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <button 
          onClick={handleExportUserData}
          className="flex items-center bg-violet-700 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Users
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-violet-900/20 rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="block w-full bg-black/40 border border-violet-900/20 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="block w-full bg-black/40 border border-violet-900/20 rounded-lg px-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="user">User</option>
          </select>

          <select
            className="block w-full bg-black/40 border border-violet-900/20 rounded-lg px-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
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

      {/* Users Table */}
      <div className="bg-gray-900 border border-violet-900/20 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/40">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
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
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === 'email' && (
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center">
                    Role
                    {sortField === 'role' && (
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
                  onClick={() => handleSort('registeredDate')}
                >
                  <div className="flex items-center">
                    Registered Date
                    {sortField === 'registeredDate' && (
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
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-black/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-900/20 text-red-400' : 
                      user.role === 'organizer' ? 'bg-blue-900/20 text-blue-400' : 
                      'bg-violet-900/20 text-violet-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-900/20 text-green-400' : 
                      'bg-gray-700/50 text-gray-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.registeredDate}</td>
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
        <div className="px-6 py-4 bg-black/20 border-t border-violet-900/20 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-white">
              {Math.min(currentPage * pageSize, filteredUsers.length)}
            </span>{' '}
            of <span className="font-medium text-white">{filteredUsers.length}</span> users
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
                      ? 'bg-violet-900/40 text-white'
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

export default AdminUsersPage;