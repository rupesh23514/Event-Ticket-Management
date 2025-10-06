import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Calendar,
  TicketIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Users,
  FileText,
  QrCode,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';

/**
 * Dashboard layout with sidebar navigation
 */
const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      {
        name: 'Dashboard',
        icon: <Home className="h-5 w-5" />,
        path: '/dashboard',
      },
      {
        name: 'Profile',
        icon: <User className="h-5 w-5" />,
        path: '/dashboard/profile',
      },
    ];

    const userLinks = [
      {
        name: 'My Bookings',
        icon: <TicketIcon className="h-5 w-5" />,
        path: '/dashboard/bookings',
      },
      {
        name: 'Request Organizer',
        icon: <Users className="h-5 w-5" />,
        path: '/dashboard/request-organizer',
      },
    ];

    const organizerLinks = [
      {
        name: 'My Events',
        icon: <Calendar className="h-5 w-5" />,
        path: '/dashboard/events',
      },
      {
        name: 'Create Event',
        icon: <FileText className="h-5 w-5" />,
        path: '/dashboard/events/create',
      },
      {
        name: 'Scan Tickets',
        icon: <QrCode className="h-5 w-5" />,
        path: '/dashboard/scan',
      },
    ];

    const adminLinks = [
      {
        name: 'Events',
        icon: <Calendar className="h-5 w-5" />,
        path: '/dashboard/admin/events',
      },
      {
        name: 'Users',
        icon: <Users className="h-5 w-5" />,
        path: '/dashboard/admin/users',
      },
      {
        name: 'Bookings',
        icon: <FileText className="h-5 w-5" />,
        path: '/dashboard/admin/bookings',
      },
      {
        name: 'Analytics',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/dashboard/admin/analytics',
      },
    ];

    if (user?.role === 'admin') {
      return [...commonLinks, ...adminLinks];
    } else if (user?.role === 'organizer') {
      return [...commonLinks, ...organizerLinks];
    }
    return [...commonLinks, ...userLinks];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-800 bg-black transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center space-x-2">
            <TicketIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EventTix</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={closeSidebar} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Separator />

        {/* User info */}
        <div className="flex flex-col items-center p-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profileImage} alt={user?.name} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <h3 className="mt-2 font-semibold">{user?.name}</h3>
          <p className="text-sm text-muted-foreground">{user?.role}</p>
        </div>
        <Separator />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    location.pathname === link.path
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground'
                  }`}
                  onClick={closeSidebar}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-2">
          <Separator className="my-2" />
          <div className="flex justify-between p-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col bg-gray-900">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-800 bg-black px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" className="text-white border-violet-600 hover:bg-violet-900" asChild>
              <Link to="/">Browse Events</Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;