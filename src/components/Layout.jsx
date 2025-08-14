/**
 * Layout Component - Main navigation and layout wrapper
 * Provides consistent navigation across all pages
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }) {
  // router hook: current location
  const location = useLocation();
  // context hook: theme (toggle removed)
  const { isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // list & keys: building nav items
  const navigation = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/game', label: 'Play Game', icon: '🎮' },
    { path: '/statistics', label: 'Stats', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-gray-50'
    }`}>
      {/* Navigation Header */}
      <nav className={`backdrop-blur-lg border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-800/95 border-slate-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <span className="text-2xl">🎨</span>
              <span className={`text-xl font-bold transition-colors ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>ColorQuest</span>
            </Link>

            {/* responsive nav: desktop vs mobile */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                      isActive
                        ? isDark 
                          ? 'bg-green-600 text-white shadow-lg' 
                          : 'bg-green-500 text-white shadow-lg'
                        : 'text-gray-900 hover:text-gray-900 hover:bg-green-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              {/* event: hamburger toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 transition-colors text-gray-900 hover:text-gray-900"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isDark 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-500 text-white'
                        : 'text-gray-900 hover:text-gray-900 hover:bg-green-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
}
