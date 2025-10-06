import React from 'react';
import { Link } from 'react-router-dom';

function CategoriesSection() {
  const categories = [
    { 
      id: 'concerts',
      name: 'Concerts', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      count: 42,
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700',
    },
    { 
      id: 'sports',
      name: 'Sports', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      ),
      count: 38,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
    },
    { 
      id: 'theater',
      name: 'Theater', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      count: 24,
      color: 'bg-amber-600',
      hoverColor: 'hover:bg-amber-700',
    },
    { 
      id: 'conferences',
      name: 'Conferences', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      count: 31,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
    },
    { 
      id: 'festivals',
      name: 'Festivals', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      count: 19,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
    },
    { 
      id: 'workshops',
      name: 'Workshops', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      count: 27,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
    },
    { 
      id: 'exhibitions',
      name: 'Exhibitions', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      count: 15,
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700',
    },
    { 
      id: 'networking',
      name: 'Networking', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      count: 22,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          to={`/events?category=${encodeURIComponent(category.name)}`}
          className="group border border-violet-900/30 bg-gray-900 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-900/10 hover:bg-gray-800 overflow-hidden"
        >
          <div className="flex items-center p-4">
            <div className="bg-opacity-30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform" 
                style={{ 
                  backgroundColor: category.color === 'bg-indigo-600' ? 'rgba(79, 70, 229, 0.2)' : 
                                  category.color === 'bg-red-600' ? 'rgba(220, 38, 38, 0.2)' :
                                  category.color === 'bg-amber-600' ? 'rgba(217, 119, 6, 0.2)' :
                                  category.color === 'bg-emerald-600' ? 'rgba(5, 150, 105, 0.2)' :
                                  category.color === 'bg-violet-600' ? 'rgba(124, 58, 237, 0.2)' :
                                  'rgba(79, 70, 229, 0.2)',
                  color: category.color === 'bg-indigo-600' ? 'rgb(129, 140, 248)' : 
                         category.color === 'bg-red-600' ? 'rgb(248, 113, 113)' :
                         category.color === 'bg-amber-600' ? 'rgb(252, 211, 77)' :
                         category.color === 'bg-emerald-600' ? 'rgb(52, 211, 153)' :
                         category.color === 'bg-violet-600' ? 'rgb(167, 139, 250)' :
                         'rgb(129, 140, 248)'
                }}>
              {category.icon}
            </div>
            <div>
              <h3 className="font-medium text-white">{category.name}</h3>
              <p className="text-xs text-gray-400">{category.count} events</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CategoriesSection;