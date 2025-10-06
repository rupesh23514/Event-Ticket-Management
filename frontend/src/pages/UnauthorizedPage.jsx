import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const UnauthorizedPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md px-8 py-12 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Access Denied</h1>
          <div className="text-6xl mb-6">🔒</div>
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default">
              <Link to="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;