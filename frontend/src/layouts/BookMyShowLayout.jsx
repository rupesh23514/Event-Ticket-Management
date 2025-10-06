import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BookMyShowNavbar from '../components/common/BookMyShowNavbar';
import Footer from '../components/common/Footer';

/**
 * Main layout for public pages with BookMyShow style navigation and footer
 */
const MainLayout = () => {
  // Use a feature flag or environment variable to toggle between navbar styles
  const useBookMyShowStyle = true; // Set to true to use BookMyShow style

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {useBookMyShowStyle ? <BookMyShowNavbar /> : <Navbar />}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;