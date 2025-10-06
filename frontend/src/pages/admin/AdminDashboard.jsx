import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  // Mock data for dashboard statistics
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    payments: 0,
    revenue: 0,
    registrations: 0,
    recentUsers: []
  });

  // Mock data for recent activity
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, fetch data from API
        setTimeout(() => {
          setStats({
            users: 1452,
            events: 245,
            payments: 1893,
            revenue: 35780.50,
            registrations: 2150,
            recentUsers: [
              { id: 1, name: 'Raj Kumar', email: 'raj@example.com', date: '2025-10-05', role: 'user' },
              { id: 2, name: 'Priya Singh', email: 'priya@example.com', date: '2025-10-04', role: 'organizer' },
              { id: 3, name: 'Vikram Patel', email: 'vikram@example.com', date: '2025-10-04', role: 'user' },
              { id: 4, name: 'Lakshmi Nair', email: 'lakshmi@example.com', date: '2025-10-03', role: 'user' },
              { id: 5, name: 'Arjun Reddy', email: 'arjun@example.com', date: '2025-10-02', role: 'organizer' },
            ]
          });
          
          setRecentActivity([
            { id: 1, type: 'new_user', user: 'Raj Kumar', date: '2025-10-05 14:32:45' },
            { id: 2, type: 'new_event', event: 'Chennai Music Festival', organizer: 'Priya Singh', date: '2025-10-05 12:21:10' },
            { id: 3, type: 'payment', amount: 450.00, user: 'Vikram Patel', event: 'Comedy Night', date: '2025-10-04 18:45:22' },
            { id: 4, type: 'new_user', user: 'Lakshmi Nair', date: '2025-10-03 09:12:33' },
            { id: 5, type: 'payment', amount: 1200.00, user: 'Arjun Reddy', event: 'Dance Workshop', date: '2025-10-02 16:38:17' },
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-violet-900/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-violet-900/20 p-3 rounded-lg mr-4">
              <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.users.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link to="/admin/users" className="text-sm text-violet-400 hover:text-violet-300">View all users &rarr;</Link>
            <Link to="/admin/users" className="text-sm text-green-400 hover:text-green-300 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-900/20 p-3 rounded-lg mr-4">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-white">{stats.events.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/events" className="text-sm text-red-400 hover:text-red-300">View all events &rarr;</Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-blue-900/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-900/20 p-3 rounded-lg mr-4">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Payments</p>
              <p className="text-2xl font-bold text-white">{stats.payments.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/payments" className="text-sm text-blue-400 hover:text-blue-300">View all payments &rarr;</Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-green-900/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-900/20 p-3 rounded-lg mr-4">
              <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/reports" className="text-sm text-green-400 hover:text-green-300">View reports &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Recent Users and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-gray-900 border border-violet-900/20 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-violet-900/20">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/40">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-black/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-red-900/20 text-red-400' : 
                        user.role === 'organizer' ? 'bg-blue-900/20 text-blue-400' : 
                        'bg-violet-900/20 text-violet-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-violet-900/20 bg-black/20">
            <Link to="/admin/users" className="text-sm text-violet-400 hover:text-violet-300">View all users &rarr;</Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-violet-900/20 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-violet-900/20">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    activity.type === 'new_user' ? 'bg-violet-900/20' : 
                    activity.type === 'new_event' ? 'bg-red-900/20' : 
                    'bg-green-900/20'
                  }`}>
                    {activity.type === 'new_user' && (
                      <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    )}
                    {activity.type === 'new_event' && (
                      <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {activity.type === 'payment' && (
                      <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      {activity.type === 'new_user' && (
                        <>New user <span className="font-medium">{activity.user}</span> registered</>
                      )}
                      {activity.type === 'new_event' && (
                        <>New event <span className="font-medium">{activity.event}</span> created by {activity.organizer}</>
                      )}
                      {activity.type === 'payment' && (
                        <>Payment of <span className="font-medium">₹{activity.amount}</span> received for {activity.event} from {activity.user}</>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-violet-900/20 bg-black/20">
            <Link to="/admin/activity" className="text-sm text-violet-400 hover:text-violet-300">View all activity &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-violet-900/20 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link to="/admin/users/export" className="flex items-center p-4 bg-black/30 rounded-lg border border-violet-900/10 hover:bg-black/40 transition-colors">
            <div className="bg-violet-900/20 p-2 rounded-lg mr-3">
              <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="text-white text-sm">Export User Data</span>
          </Link>

          <Link to="/admin/events/create" className="flex items-center p-4 bg-black/30 rounded-lg border border-red-900/10 hover:bg-black/40 transition-colors">
            <div className="bg-red-900/20 p-2 rounded-lg mr-3">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-white text-sm">Create Event</span>
          </Link>

          <Link to="/admin/reports/generate" className="flex items-center p-4 bg-black/30 rounded-lg border border-blue-900/10 hover:bg-black/40 transition-colors">
            <div className="bg-blue-900/20 p-2 rounded-lg mr-3">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-white text-sm">Generate Report</span>
          </Link>

          <Link to="/admin/settings" className="flex items-center p-4 bg-black/30 rounded-lg border border-green-900/10 hover:bg-black/40 transition-colors">
            <div className="bg-green-900/20 p-2 rounded-lg mr-3">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-white text-sm">System Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;