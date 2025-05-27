import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-2">
        {/* Logo */}
        <div className="flex justify-center py-2">
          <img src={logo} alt="100 Days Work Logo" className="h-12" />
        </div>

        {/* Header */}
        <Header darkMode={darkMode} />

        {/* Navigation */}
        <nav className={`flex justify-around p-2 mb-4 rounded-lg ${darkMode ? 'bg-green-700' : 'bg-green-600'}`}>
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? (darkMode ? 'bg-gray-800' : 'bg-gray-200') : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/groups" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/groups' ? (darkMode ? 'bg-gray-800' : 'bg-gray-200') : ''}`}
          >
            Groups
          </Link>
          <Link 
            to="/add-user" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/add-user' ? (darkMode ? 'bg-gray-800' : 'bg-gray-200') : ''}`}
          >
            Add User
          </Link>
          <Link 
            to="/reports" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/reports' ? (darkMode ? 'bg-gray-800' : 'bg-gray-200') : ''}`}
          >
            Reports
          </Link>
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </nav>

        {/* Main Content */}
        <main className="pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;