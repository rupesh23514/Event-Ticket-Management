import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { exportPaymentData } from '../../utils/exportUtils';

function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock payment data
  const mockPayments = [
    {
      id: 'pay_001',
      userId: 'user_123',
      userName: 'Ajay Kumar',
      eventId: 'evt_001',
      eventName: 'Chennai Music Festival',
      amount: 2500,
      paymentMethod: 'Credit Card',
      status: 'completed',
      date: '2025-10-15T14:32:00',
      transactionId: 'txn_89012345'
    },
    {
      id: 'pay_002',
      userId: 'user_456',
      userName: 'Priya Singh',
      eventId: 'evt_003',
      eventName: 'Bharatanatyam Performance',
      amount: 1500,
      paymentMethod: 'UPI',
      status: 'completed',
      date: '2025-10-14T09:45:00',
      transactionId: 'txn_67890123'
    },
    {
      id: 'pay_003',
      userId: 'user_789',
      userName: 'Vikram Patel',
      eventId: 'evt_002',
      eventName: 'Comedy Night with Kapil',
      amount: 3000,
      paymentMethod: 'Debit Card',
      status: 'pending',
      date: '2025-10-15T16:20:00',
      transactionId: 'txn_56789012'
    },
    {
      id: 'pay_004',
      userId: 'user_101',
      userName: 'Nirmala Devi',
      eventId: 'evt_004',
      eventName: 'IPL Chennai vs Mumbai',
      amount: 5000,
      paymentMethod: 'Credit Card',
      status: 'completed',
      date: '2025-10-13T11:15:00',
      transactionId: 'txn_45678901'
    },
    {
      id: 'pay_005',
      userId: 'user_202',
      userName: 'Raj Kumar',
      eventId: 'evt_007',
      eventName: 'Tech Conference 2025',
      amount: 7500,
      paymentMethod: 'Net Banking',
      status: 'completed',
      date: '2025-10-12T10:30:00',
      transactionId: 'txn_34567890'
    },
    {
      id: 'pay_006',
      userId: 'user_303',
      userName: 'Lakshmi Nair',
      eventId: 'evt_009',
      eventName: 'Classical Music Night',
      amount: 2000,
      paymentMethod: 'UPI',
      status: 'failed',
      date: '2025-10-14T18:45:00',
      transactionId: 'txn_23456789'
    },
    {
      id: 'pay_007',
      userId: 'user_404',
      userName: 'Arjun Reddy',
      eventId: 'evt_010',
      eventName: 'Startup Pitch Event',
      amount: 1000,
      paymentMethod: 'Wallet',
      status: 'completed',
      date: '2025-10-15T09:00:00',
      transactionId: 'txn_12345678'
    },
    {
      id: 'pay_008',
      userId: 'user_505',
      userName: 'Meera Sharma',
      eventId: 'evt_008',
      eventName: 'Diwali Cultural Show',
      amount: 3500,
      paymentMethod: 'Credit Card',
      status: 'refunded',
      date: '2025-10-11T14:20:00',
      transactionId: 'txn_01234567'
    },
    {
      id: 'pay_009',
      userId: 'user_606',
      userName: 'Sachin Tendulkar',
      eventId: 'evt_012',
      eventName: 'Photography Workshop',
      amount: 1200,
      paymentMethod: 'Debit Card',
      status: 'pending',
      date: '2025-10-16T11:30:00',
      transactionId: 'txn_90123456'
    },
    {
      id: 'pay_010',
      userId: 'user_707',
      userName: 'Rohit Sharma',
      eventId: 'evt_013',
      eventName: 'Food Festival',
      amount: 500,
      paymentMethod: 'UPI',
      status: 'completed',
      date: '2025-10-15T13:15:00',
      transactionId: 'txn_78901234'
    },
    {
      id: 'pay_011',
      userId: 'user_808',
      userName: 'MS Dhoni',
      eventId: 'evt_011',
      eventName: 'Poetry Slam',
      amount: 800,
      paymentMethod: 'Net Banking',
      status: 'completed',
      date: '2025-10-14T15:45:00',
      transactionId: 'txn_67890123'
    },
    {
      id: 'pay_012',
      userId: 'user_909',
      userName: 'Virat Kohli',
      eventId: 'evt_014',
      eventName: 'Yoga Retreat',
      amount: 4500,
      paymentMethod: 'Credit Card',
      status: 'pending',
      date: '2025-10-17T08:30:00',
      transactionId: 'txn_56789012'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch payments
    const fetchPayments = async () => {
      try {
        setTimeout(() => {
          setPayments(mockPayments);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search, status, and date range
  const filteredPayments = payments.filter(payment => {
    // Filter by search query
    const matchesQuery = 
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    // Filter by date range
    const paymentDate = new Date(payment.date);
    const matchesDateRange = 
      (!dateRange.start || new Date(dateRange.start) <= paymentDate) &&
      (!dateRange.end || new Date(dateRange.end) >= paymentDate);
    
    return matchesQuery && matchesStatus && matchesDateRange;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate statistics
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = filteredPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleExportPaymentData = () => {
    exportPaymentData(filteredPayments);
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
        <h1 className="text-2xl font-bold text-white">Payment Management</h1>
        <button 
          onClick={handleExportPaymentData}
          className="flex items-center bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-violet-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-violet-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-green-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed Payments</p>
              <p className="text-xl font-bold text-white">{formatCurrency(completedAmount)}</p>
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
              <p className="text-sm text-gray-400">Pending Payments</p>
              <p className="text-xl font-bold text-white">{formatCurrency(pendingAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-900/20 p-3 rounded-lg mr-3">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Refunded Amount</p>
              <p className="text-xl font-bold text-white">{formatCurrency(refundedAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-violet-900/20 rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by user, event, or transaction ID..."
              className="block w-full bg-black/40 border border-violet-900/20 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="block w-full bg-black/40 border border-violet-900/20 rounded-lg px-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <div>
            <input
              type="date"
              className="block w-full bg-black/40 border border-violet-900/20 rounded-lg px-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              placeholder="Start Date"
            />
          </div>

          <div>
            <input
              type="date"
              className="block w-full bg-black/40 border border-violet-900/20 rounded-lg px-4 py-2 text-white focus:ring-violet-500 focus:border-violet-500"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-gray-900 border border-violet-900/20 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/40">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-black/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {payment.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {payment.eventName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'completed' ? 'bg-green-900/20 text-green-400' : 
                      payment.status === 'pending' ? 'bg-blue-900/20 text-blue-400' :
                      payment.status === 'failed' ? 'bg-red-900/20 text-red-400' :
                      'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {format(new Date(payment.date), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-violet-400 hover:text-violet-300">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {payment.status === 'pending' && (
                        <>
                          <button className="text-green-400 hover:text-green-300">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </>
                      )}
                      {payment.status === 'completed' && (
                        <button className="text-yellow-400 hover:text-yellow-300">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </button>
                      )}
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
              {Math.min(currentPage * pageSize, filteredPayments.length)}
            </span>{' '}
            of <span className="font-medium text-white">{filteredPayments.length}</span> payments
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
              {[...Array(Math.min(totalPages, 5)).keys()].map(page => (
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
              {totalPages > 5 && <span className="px-2 py-1 text-gray-400">...</span>}
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

export default AdminPaymentsPage;