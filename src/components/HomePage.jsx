/**
 * HomePage Component - Enhanced welcome screen with game modes and features
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function HomePage() {
  const { isDark } = useTheme();
  // state: stats
  const [stats, setStats] = useState({
    totalGames: 0,
    averageScore: 0,
    bestScore: 0,
    totalCorrect: 0,
  });

  // effect: load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('colorquest-history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      const totalGames = history.length;
      const totalCorrect = history.reduce((sum, game) => sum + game.score, 0);
      const totalQuestions = history.reduce((sum, game) => sum + game.totalQuestions, 0);
      const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const bestScore = history.reduce((best, game) => Math.max(best, game.percentage), 0);

      setStats({
        totalGames,
        averageScore,
        bestScore,
        totalCorrect,
      });
    }
  }, []);

  // list & keys: game features
  const gameFeatures = [
    {
      title: "Classic",
      description: "Match colors with cute pictures",
      icon: "🎨",
      path: "/game",
      difficulty: "Easy",
    },
    {
      title: "Timer Fun",
      description: "Beat the clock and match colors!",
      icon: "⏱️",
      path: "/game?mode=timed",
      difficulty: "Medium",
    },
    {
      title: "Tricky Shades",
      description: "Spot the tricky color shades",
      icon: "🧠",
      path: "/game?mode=hard",
      difficulty: "Hard",
    },
    {
      title: "Speed Run",
      description: "Go super fast!",
      icon: "💨",
      path: "/game?mode=speed",
      difficulty: "Expert",
    },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-pulse ${
          isDark ? 'bg-green-500/20' : 'bg-green-400/30'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-40 h-40 rounded-full blur-xl animate-pulse delay-1000 ${
          isDark ? 'bg-purple-500/15' : 'bg-purple-400/25'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-2xl animate-pulse delay-500 ${
          isDark ? 'bg-green-400/10' : 'bg-green-300/20'
        }`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className={`inline-block p-6 rounded-full mb-6 shadow-2xl ${
            isDark ? 'bg-green-600' : 'bg-green-500'
          }`}>
            <span className="text-6xl md:text-8xl animate-bounce" aria-hidden="true">🎨</span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-extrabold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ColorQuest
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 font-medium max-w-3xl mx-auto ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Learn colors with fun games and friendly pictures!
          </p>

          {/* Quick Stats */}
          {stats.totalGames > 0 && (
            // responsive layout: grid columns
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className={`backdrop-blur-sm rounded-xl p-4 border transition-colors ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700' 
                  : 'bg-white/80 border-gray-200'
              }`}>
                <div className="text-2xl font-bold text-green-500">{stats.totalGames}</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>🎮 Games Played</div>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-4 border transition-colors ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700' 
                  : 'bg-white/80 border-gray-200'
              }`}>
                <div className="text-2xl font-bold text-green-500">{stats.averageScore}%</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>⭐ Average</div>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-4 border transition-colors ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700' 
                  : 'bg-white/80 border-gray-200'
              }`}>
                <div className="text-2xl font-bold text-purple-500">{stats.bestScore}%</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>🏅 Best</div>
              </div>
            </div>
          )}
        </div>

        {/* Game Modes */}
        <div className="mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Choose Your Challenge
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameFeatures.map((feature, index) => (
              // routing link
              <Link
                key={index}
                to={feature.path}
                className={`group backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-800/90 border-slate-700 hover:border-green-500' 
                    : 'bg-white/90 border-gray-300 hover:border-green-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-green-400' 
                      : 'text-gray-900 group-hover:text-green-600'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm mb-4 transition-colors ${
                    isDark 
                      ? 'text-slate-400 group-hover:text-slate-300' 
                      : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    feature.difficulty === 'Easy' ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                    feature.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                    feature.difficulty === 'Hard' ? 'bg-red-600/20 text-red-400 border border-red-600/30' :
                    'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                  }`}>
                    {feature.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      
        {/* Quick Actions */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* routing link */}
            <Link
              to="/game"
              aria-label="Start playing the color game"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400"
            >
              <span className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Start Playing</span>
              </span>
            </Link>
            
            {/* routing link */}
            <Link
              to="/statistics"
              aria-label="View your game stats"
              className={`font-bold py-5 px-10 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>📈</span>
                <span>View Stats</span>
              </span>
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
}
