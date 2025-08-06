/**
 * Layout Component - Main navigation and layout wrapper
 * Provides consistent navigation across all pages
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }) {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <span className="text-2xl">🎨</span>
              <span className={`text-xl font-bold transition-colors ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>ColorQuest</span>
            </Link>

            {/* Navigation Links */}
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
                        : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Theme Toggle */}
              <div className="ml-4 flex items-center">
                <button
                  onClick={toggleTheme}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDark 
                      ? 'bg-green-600 focus:ring-green-500' 
                      : 'bg-gray-300 focus:ring-green-400'
                  }`}
                  title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center text-xs ${
                      isDark 
                        ? 'translate-x-7 bg-white text-gray-900' 
                        : 'translate-x-0.5 bg-white text-gray-600'
                    }`}
                  >
                    {isDark ? '🌙' : '☀️'}
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                  isDark 
                    ? 'bg-green-600' 
                    : 'bg-gray-300'
                }`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center text-xs ${
                    isDark 
                      ? 'translate-x-6 bg-white text-gray-900' 
                      : 'translate-x-0.5 bg-white text-gray-600'
                  }`}
                >
                  {isDark ? '🌙' : '☀️'}
                </div>
              </button>
              
              <button className={`p-2 transition-colors ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isDark 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-500 text-white'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
