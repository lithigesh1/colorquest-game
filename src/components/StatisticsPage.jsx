/**
 * StatisticsPage Component - Detailed game statistics and analytics
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function StatisticsPage() {
  // state: game history and computed statistics
  const [gameHistory, setGameHistory] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 100,
    perfectGames: 0,
    improvementTrend: 0,
    favoriteTimeOfDay: 'N/A',
    longestStreak: 0,
    currentStreak: 0,
  });

  // effect: load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('colorquest-history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setGameHistory(history);
      calculateStatistics(history);
    }
  }, []);

  // derived data: recompute aggregate statistics from history
  const calculateStatistics = (history) => {
    if (history.length === 0) return;

    const totalGames = history.length;
    const totalCorrect = history.reduce((sum, game) => sum + game.score, 0);
    const totalQuestions = history.reduce((sum, game) => sum + game.totalQuestions, 0);
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const bestScore = history.reduce((best, game) => Math.max(best, game.percentage), 0);
    const worstScore = history.reduce((worst, game) => Math.min(worst, game.percentage), 100);
    const perfectGames = history.filter(game => game.percentage === 100).length;

    // trend: compare last 5 games vs previous 5 games
    let improvementTrend = 0;
    if (history.length >= 10) {
      const recent5 = history.slice(0, 5);
      const previous5 = history.slice(5, 10);
      const recentAvg = recent5.reduce((sum, game) => sum + game.percentage, 0) / 5;
      const previousAvg = previous5.reduce((sum, game) => sum + game.percentage, 0) / 5;
      improvementTrend = Math.round(recentAvg - previousAvg);
    }

    // derived data: streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < history.length; i++) {
      if (history[i].percentage >= 80) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
        if (i === 0) currentStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    setStats({
      totalGames,
      totalCorrect,
      totalQuestions,
      averageScore,
      bestScore,
      worstScore: history.length > 0 ? worstScore : 0,
      perfectGames,
      improvementTrend,
      favoriteTimeOfDay: 'Evening', // placeholder: could compute from timestamps
      longestStreak,
      currentStreak,
    });
  };

  // events: clear history with confirmation + persistence updates
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all game history? This action cannot be undone.')) {
      localStorage.removeItem('colorquest-history');
      setGameHistory([]);
      setStats({
        totalGames: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        perfectGames: 0,
        improvementTrend: 0,
        favoriteTimeOfDay: 'N/A',
        longestStreak: 0,
        currentStreak: 0,
      });
    }
  };

  // utility: presentation helpers
  const getPerformanceEmoji = (percentage) => {
    if (percentage === 100) return '🏆';
    if (percentage >= 90) return '🥇';
    if (percentage >= 80) return '🥈';
    if (percentage >= 70) return '🥉';
    if (percentage >= 60) return '🎯';
    return '📚';
  };

  // utility: color scale selection
  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-yellow-400';
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-blue-400';
    if (percentage >= 60) return 'text-purple-400';
    return 'text-gray-400';
  };

  // conditional rendering: empty state vs statistics UI
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📊 Game Statistics
          </h1>
          <p className="text-xl text-gray-300">
            Track your ColorQuest journey and improvement
          </p>
        </div>

        {gameHistory.length === 0 ? (
          /* No Data State */
          <div className="text-center py-16">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-gray-700">
              <span className="text-6xl mb-4 block">📈</span>
              <h3 className="text-2xl font-bold text-white mb-4">No Statistics Yet</h3>
              <p className="text-gray-400 mb-6">
                Play some games to see your statistics and progress!
              </p>
              {/* routing link */}
              <Link
                to="/game"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>🎮</span>
                <span>Start Playing</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.totalGames}</div>
                <div className="text-sm text-gray-400">Total Games</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.averageScore}%</div>
                <div className="text-sm text-gray-400">Average Score</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.bestScore}%</div>
                <div className="text-sm text-gray-400">Best Score</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.perfectGames}</div>
                <div className="text-sm text-gray-400">Perfect Games</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-red-400">{stats.longestStreak}</div>
                <div className="text-sm text-gray-400">Longest Streak</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Performance Overview */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Performance Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Correct Answers</span>
                    <span className="text-green-400 font-bold">{stats.totalCorrect}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Questions</span>
                    <span className="text-blue-400 font-bold">{stats.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Accuracy Rate</span>
                    <span className="text-yellow-400 font-bold">
                      {stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Improvement Trend</span>
                    <span className={`font-bold ${stats.improvementTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.improvementTrend >= 0 ? '+' : ''}{stats.improvementTrend}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievement Highlights */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🏅</span>
                  Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏆</span>
                      <div>
                        <div className="text-sm font-semibold text-white">Perfect Scores</div>
                        <div className="text-xs text-gray-400">100% accuracy games</div>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-bold">{stats.perfectGames}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔥</span>
                      <div>
                        <div className="text-sm font-semibold text-white">Best Streak</div>
                        <div className="text-xs text-gray-400">Consecutive good games</div>
                      </div>
                    </div>
                    <span className="text-orange-400 font-bold">{stats.longestStreak}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📈</span>
                      <div>
                        <div className="text-sm font-semibold text-white">Best Score</div>
                        <div className="text-xs text-gray-400">Highest percentage</div>
                      </div>
                    </div>
                    <span className="text-green-400 font-bold">{stats.bestScore}%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {/* routing link */}
                  <Link
                    to="/game"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>🎮</span>
                    <span>Play Again</span>
                  </Link>

                  {/* routing link */}
                  <Link
                    to="/settings"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={clearHistory}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>🗑️</span>
                    <span>Clear History</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Games History */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Recent Games
              </h3>
              <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    {/* list & keys: render up to 20 recent games */}
                    {gameHistory.slice(0, 20).map((game, index) => (
                      <div 
                        key={game.id} 
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{getPerformanceEmoji(game.percentage)}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white">
                                Game #{gameHistory.length - index}
                              </span>
                              <span className={`text-sm font-semibold ${getPerformanceColor(game.percentage)}`}>
                                {game.score}/{game.totalQuestions} ({game.percentage}%)
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {game.date} at {game.time}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            game.percentage === 100 ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                            game.percentage >= 90 ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                            game.percentage >= 80 ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' :
                            game.percentage >= 70 ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' :
                            game.percentage >= 60 ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30' :
                            'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                          }`}>
                            {game.percentage === 100 ? 'Perfect!' :
                             game.percentage >= 90 ? 'Excellent!' :
                             game.percentage >= 80 ? 'Great!' :
                             game.percentage >= 70 ? 'Good!' :
                             game.percentage >= 60 ? 'Fair' : 'Practice More'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
