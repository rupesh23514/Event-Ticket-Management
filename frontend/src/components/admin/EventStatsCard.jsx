import React from 'react';

const EventStatsCard = () => {
  // Hardcoded stats matching the image
  const stats = {
    monthTotal: 245,
    todayTotal: 12,
    weekTotal: 48,
    yearTotal: 1270
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Recently Shared Events</h2>
        <a href="/admin/events" className="text-violet-400 hover:text-violet-300 text-sm">
          View All →
        </a>
      </div>

      <div className="flex items-center mt-4">
        <div className="mr-4">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Total events shared this month</div>
          <div className="text-2xl font-bold text-white">{stats.monthTotal}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-900 p-4 rounded-lg text-center">
          <div className="text-red-400 text-3xl font-bold">{stats.todayTotal}</div>
          <div className="text-gray-400 text-sm mt-1">events shared today</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-center">
          <div className="text-violet-400 text-3xl font-bold">{stats.weekTotal}</div>
          <div className="text-gray-400 text-sm mt-1">events shared this week</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-center">
          <div className="text-blue-400 text-3xl font-bold">{stats.yearTotal}</div>
          <div className="text-gray-400 text-sm mt-1">events shared this year</div>
        </div>
      </div>
    </div>
  );
};

export default EventStatsCard;