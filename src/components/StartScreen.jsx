/**
 * StartScreen Component - Welcome screen for ColorQuest game
 * Displays game introduction, start button, and game history
 * Provides entry point to the game and historical performance review
 */

import React, { useState, useEffect } from 'react';

export default function StartScreen({ onStart }) {
  // ==================== STATE MANAGEMENT ====================
  
  const [showHistory, setShowHistory] = useState(false);     // Controls history panel visibility
  const [gameHistory, setGameHistory] = useState([]);       // Stores past game results from localStorage

  // ==================== SIDE EFFECTS ====================
  
  // Load game history from localStorage when component mounts
  // This persists user's game history across browser sessions
  useEffect(() => {
    const savedHistory = localStorage.getItem('colorquest-history');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  // ==================== MAIN UI RENDER ====================
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements for visual appeal */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-600/15 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Main welcome card container */}
      <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 p-8 md:p-12 text-center max-w-2xl w-full relative z-10">
        {/* Welcome header section */}
        <div className="mb-8">
          {/* Game icon - paint palette emoji */}
          <div className="inline-block p-6 bg-blue-600 rounded-full mb-6 shadow-lg">
            <span className="text-6xl md:text-7xl">🎨</span>
          </div>
          
          {/* Main title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-400 mb-4">
            Welcome to ColorQuest
          </h1>
          
          {/* Game description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
            Learn colors by matching them with real-world objects!
          </p>
        </div>

        {/* Action buttons section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          {/* Start Game button - triggers onStart callback to parent component */}
          <button 
            onClick={onStart} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 md:py-5 px-8 md:px-10 rounded-2xl text-lg md:text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Start Game</span>
            </span>
          </button>
          
          {/* History toggle button - shows/hides game history panel */}
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 md:py-5 px-8 md:px-10 rounded-2xl text-lg md:text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>History</span>
            </span>
          </button>
        </div>

        {/* Game History Section - conditionally rendered based on showHistory state */}
        {showHistory && (
          <div className="mt-8">
            {/* History section header */}
            <h3 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6">
              🏆 Game History
            </h3>
            
            {/* Scrollable history container */}
            <div className="max-h-64 overflow-y-auto bg-gray-800/30 rounded-2xl p-4 border border-gray-600 custom-scrollbar">
              {gameHistory.length === 0 ? (
                /* Empty state - no games played yet */
                <p className="text-gray-400 text-lg font-medium">No previous games yet!</p>
              ) : (
                /* History list - displays past game results */
                <div className="space-y-3">
                  {gameHistory.map((game) => (
                    <div 
                      key={game.id} 
                      className="bg-gray-700/60 p-4 rounded-xl shadow-md border border-gray-600"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        {/* Game result information */}
                        <div className="flex items-center space-x-3">
                          {/* Performance emoji based on score percentage */}
                          <span className="text-2xl">
                            {game.percentage === 100 ? '🏆' : game.percentage >= 80 ? '🥈' : game.percentage >= 60 ? '🥉' : '🎯'}
                          </span>
                          <div>
                            {/* Score display with percentage */}
                            <p className="font-bold text-lg text-gray-200">
                              {game.score}/{game.totalQuestions} ({game.percentage}%)
                            </p>
                            {/* Game timestamp */}
                            <p className="text-sm text-gray-400">
                              {game.date} at {game.time}
                            </p>
                          </div>
                        </div>
                        
                        {/* Performance badge with conditional styling */}
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          game.percentage === 100 ? 'bg-blue-600 text-blue-100' :
                          game.percentage >= 80 ? 'bg-blue-700 text-blue-200' :
                          game.percentage >= 60 ? 'bg-blue-800 text-blue-300' :
                          'bg-gray-600 text-gray-200'
                        }`}>
                          {game.percentage === 100 ? 'Perfect!' :
                           game.percentage >= 80 ? 'Excellent!' :
                           game.percentage >= 60 ? 'Good!' : 'Keep Trying!'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
