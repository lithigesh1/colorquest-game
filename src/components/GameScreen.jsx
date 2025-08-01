/**
 * GameScreen Component - Main game interface for ColorQuest
 * Handles the color matching game logic, scoring, and user interactions
 */

import React, { useState, useEffect } from 'react';
import getShuffledQuestions from '../data';

export default function Game({ onHome }) {
  // ==================== STATE MANAGEMENT ====================
  
  // Game flow state
  const [currentIndex, setCurrentIndex] = useState(0);           // Current question index
  const [feedback, setFeedback] = useState('');                 // User feedback message
  const [isFinished, setIsFinished] = useState(false);          // Game completion status
  const [showFeedback, setShowFeedback] = useState(false);      // Show/hide feedback animation
  const [isTransitioning, setIsTransitioning] = useState(false); // Question transition animation
  
  // Game data state
  const [score, setScore] = useState(0);                        // Player's current score
  const [showHistory, setShowHistory] = useState(false);       // Toggle history display
  const [gameHistory, setGameHistory] = useState([]);          // Past game results
  const [questions, setQuestions] = useState([]);              // Shuffled questions array
  const [selectedOption, setSelectedOption] = useState(null);  // Track selected option for visual feedback

  // ==================== SIDE EFFECTS ====================
  
  // Initialize shuffled questions when component mounts
  // This ensures every game session has randomized question order and options
  useEffect(() => {
    setQuestions(getShuffledQuestions());
  }, []);

  // Load game history from localStorage on component mount
  // Persists player's past game results across browser sessions
  useEffect(() => {
    const savedHistory = localStorage.getItem('colorquest-history');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  // ==================== COMPUTED VALUES ====================
  
  // Current question object based on the current index
  const currentQuestion = questions[currentIndex];

  // ==================== LOADING STATE ====================
  
  // Show loading spinner while questions are being initialized
  // Prevents errors when trying to access currentQuestion before questions are loaded
  if (!questions.length || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 p-8 text-center">
          {/* Animated loading spinner */}
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-400 font-semibold">Loading ColorQuest...</p>
        </div>
      </div>
    );
  }

  // ==================== GAME LOGIC FUNCTIONS ====================
  
  /**
   * Save game result to localStorage and update history state
   * @param {number} finalScore - The player's final score
   */
  const saveGameResult = (finalScore) => {
    // Create game result object with score, percentage, and timestamp
    const gameResult = {
      id: Date.now(),                                                    // Unique identifier
      score: finalScore,                                                 // Questions answered correctly
      totalQuestions: questions.length,                                  // Total questions in game
      percentage: Math.round((finalScore / questions.length) * 100),    // Success percentage
      date: new Date().toLocaleDateString(),                            // Game date
      time: new Date().toLocaleTimeString(),                            // Game time
    };

    // Update history: add new result to beginning, keep only last 10 games
    const updatedHistory = [gameResult, ...gameHistory].slice(0, 10);
    setGameHistory(updatedHistory);
    localStorage.setItem('colorquest-history', JSON.stringify(updatedHistory));
  };

  /**
   * Handle user's answer selection
   * @param {boolean} isCorrect - Whether the selected answer is correct
   * @param {number} optionIndex - Index of the selected option
   */
  const handleSelect = (isCorrect, optionIndex) => {
    // Track which option was selected for visual feedback
    setSelectedOption(optionIndex);
    
    if (isCorrect) {
      // ========== CORRECT ANSWER LOGIC ==========
      setScore(score + 1);                           // Increment score
      setFeedback('✅ Correct! Amazing!');           // Show success message
    } else {
      // ========== INCORRECT ANSWER LOGIC ==========
      setFeedback('❌ Wrong! Answer');   // Show error message
    }
    
    // Show feedback animation for both correct and incorrect answers
    setShowFeedback(true);
    
    // Delayed progression to next question (1.8s feedback + 0.4s transition)
    // This applies to both correct and incorrect answers - always move forward
    setTimeout(() => {
      setIsTransitioning(true);                    // Start transition animation
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          // Move to next question and reset selection
          setCurrentIndex(currentIndex + 1);
          setFeedback('');
          setShowFeedback(false);
          setIsTransitioning(false);
          setSelectedOption(null);               // Reset selected option
        } else {
          // Game completed - save results and show completion screen
          // Use current score + 1 if the last answer was correct, otherwise just current score
          const finalScore = isCorrect ? score + 1 : score;
          saveGameResult(finalScore);
          setIsFinished(true);
        }
      }, 400);
    }, 1800);
  };

  /**
   * Restart the game with new shuffled questions
   * Resets all game state and generates fresh question order
   */
  const handleRestart = () => {
    setCurrentIndex(0);                          // Reset to first question
    setScore(0);                                 // Reset score
    setFeedback('');                             // Clear any feedback
    setIsFinished(false);                        // Set game as active
    setShowFeedback(false);                      // Hide feedback display
    setIsTransitioning(false);                   // Clear transition state
    setShowHistory(false);                       // Hide history panel
    setSelectedOption(null);                     // Reset selected option
    setQuestions(getShuffledQuestions());        // Generate new shuffled questions
  };

  /**
   * Return to start screen
   * Resets all game state and calls parent component's onHome function
   */
  const handleHome = () => {
    // Reset all game state to initial values
    setCurrentIndex(0);
    setScore(0);
    setFeedback('');
    setIsFinished(false);
    setShowFeedback(false);
    setIsTransitioning(false);
    setShowHistory(false);
    setSelectedOption(null);
    
    // Navigate back to start screen via parent component
    if (onHome) {
      onHome();
    }
  };

  // ==================== GAME COMPLETION SCREEN ====================
  
  // Render completion screen when game is finished
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-2 md:p-4 relative overflow-hidden">
        {/* Decorative background elements for celebration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-blue-500/30 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-blue-400/40 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-blue-600/25 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-blue-300/35 rounded-full"></div>
        </div>
        
        {/* Main completion card */}
        <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 p-4 md:p-8 text-center max-w-xl w-full relative z-10">
          {/* Congratulations content */}
          <div className="mb-6">
            {/* Celebration emoji */}
            <div className="inline-block p-4 bg-blue-600 rounded-full mb-4 shadow-lg">
              <span className="text-4xl md:text-5xl">🎉</span>
            </div>
            
            {/* Success message */}
            <h2 className="text-2xl md:text-4xl font-extrabold text-blue-400 mb-3">
              Congratulations!
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-4 font-semibold">
              You matched all the colors correctly!
            </p>
            
            {/* Score display card */}
            <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600 mb-6">
              <p className="text-xl md:text-2xl font-bold text-blue-400 mb-1">
                Final Score: {score}/{questions.length}
              </p>
              <p className="text-base md:text-lg font-semibold text-blue-300">
                {Math.round((score / questions.length) * 100)}% {
                  (() => {
                    const percentage = Math.round((score / questions.length) * 100);
                    if (percentage === 100) return 'Perfect! 🌟';
                    if (percentage >= 90) return 'Excellent! 🎉';
                    if (percentage >= 80) return 'Great Job! 👏';
                    if (percentage >= 70) return 'Good Work! 👍';
                    if (percentage >= 60) return 'Well Done! 🙂';
                    if (percentage >= 50) return 'Keep Trying! 💪';
                    return 'Practice More! 📚';
                  })()
                }
              </p>
            </div>
          </div>
          
          {/* Action buttons row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
            {/* Play Again button - starts new game with shuffled questions */}
            <button 
              onClick={handleRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>🔄</span>
                <span>Play Again</span>
              </span>
            </button>
            
            {/* History toggle button - shows/hides past game results */}
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>History</span>
              </span>
            </button>

            {/* Home button - returns to start screen */}
            <button 
              onClick={handleHome}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>🏠</span>
                <span>Home</span>
              </span>
            </button>
          </div>
          {/* Game History Section - conditionally rendered */}
          {showHistory && (
            <div className="mt-4">
              {/* History header */}
              <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-4">
                🏆 Game History
              </h3>
              
              {/* Scrollable history container */}
              <div className="max-h-40 overflow-y-auto bg-gray-800/30 rounded-xl p-3 border border-gray-600 custom-scrollbar">
                {gameHistory.length === 0 ? (
                  /* Empty state message */
                  <p className="text-gray-400 text-sm font-medium">No previous games yet!</p>
                ) : (
                  /* History list */
                  <div className="space-y-2">
                    {gameHistory.map((game) => (
                      <div 
                        key={game.id} 
                        className="bg-gray-700/60 p-3 rounded-lg shadow-md border border-gray-600"
                      >
                        <div className="flex justify-between items-center gap-2">
                          {/* Game result info */}
                          <div className="flex items-center space-x-2">
                            {/* Performance emoji based on score percentage */}
                            <span className="text-lg">
                              {game.percentage === 100 ? '🏆' : game.percentage >= 80 ? '🥈' : game.percentage >= 60 ? '🥉' : '🎯'}
                            </span>
                            <div>
                              {/* Score and percentage */}
                              <p className="font-bold text-sm text-gray-200">
                                {game.score}/{game.totalQuestions} ({game.percentage}%)
                              </p>
                              {/* Game date */}
                              <p className="text-xs text-gray-400">
                                {game.date}
                              </p>
                            </div>
                          </div>
                          
                          {/* Performance badge */}
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
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

  // ==================== MAIN GAME INTERFACE ====================
  
  return (
    <div className="min-h-screen bg-gray-900 p-2 md:p-3 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-2 md:left-10 w-16 md:w-24 h-16 md:h-24 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-2 md:right-10 w-20 md:w-28 h-20 md:h-28 bg-blue-600/15 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 md:w-40 h-24 md:h-40 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Main game container */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Game header with progress and score */}
        <div className="text-center mb-4 md:mb-6">
          {/* Round and score indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
            {/* Current round display */}
            <div className="bg-gray-800/90 backdrop-blur-sm px-3 md:px-4 py-2 md:py-3 rounded-xl shadow-lg border border-gray-700">
              <span className="text-sm md:text-base font-bold text-gray-200">
                Round {currentIndex + 1} of {questions.length}
              </span>
            </div>
            
            {/* Current score display */}
            <div className="bg-blue-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl shadow-lg font-bold text-sm md:text-base">
              Score: {score}
            </div>
          </div>

          {/* Visual progress bar */}
          <div className="max-w-xs mx-auto mb-4">
            {/* Progress bar container */}
            <div className="bg-gray-800/50 rounded-full h-2 md:h-3 overflow-hidden shadow-inner border border-gray-700">
              {/* Progress bar fill - width calculated based on current progress */}
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            {/* Progress percentage text */}
            <p className="text-xs md:text-sm text-gray-400 mt-1 font-medium">
              Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </p>
          </div>

          {/* Game instructions */}
          <div className="bg-gray-800/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-lg border border-gray-700 inline-block">
            <span className="text-xs md:text-sm font-semibold text-gray-300">
              🎯 Match the color with the correct object!
            </span>
          </div>
        </div>

        {/* Main game content with transition animation */}
        <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Color display section */}
          <div className="flex flex-col items-center mb-4 md:mb-6">
            {/* Color canvas with decorative border */}
            <div className="relative mb-3">
              {/* Canvas element displaying the current color */}
              <canvas 
                width={100} 
                height={100} 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl shadow-2xl border-4 border-white/70 transition-all duration-300 hover:scale-105 hover:shadow-3xl"
                ref={(canvas) => {
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = currentQuestion.color;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                  }
                }}
              />
              {/* Decorative glow effect behind canvas */}
              <div className="absolute -inset-2 bg-blue-500/40 rounded-2xl blur opacity-40"></div>
            </div>
            
            {/* Color name display */}
            <div className="bg-gray-800/90 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-xl border border-gray-700 hover:scale-105 transition-all duration-300">
              <p className="text-base md:text-xl font-extrabold text-gray-200">
                {currentQuestion.color.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Answer options grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 max-w-3xl mx-auto">
            {currentQuestion.options.map((option, index) => {
              // Determine if this option should be highlighted
              const isSelected = selectedOption === index;
              const isCorrectOption = option.isCorrect;
              const shouldHighlightCorrect = selectedOption !== null && !currentQuestion.options[selectedOption].isCorrect && isCorrectOption;
              const shouldHighlightWrong = isSelected && !isCorrectOption;
              const shouldHighlightSelectedCorrect = isSelected && isCorrectOption; // New: highlight when correct answer is selected
              
              return (
                <button 
                  key={index} 
                  onClick={() => handleSelect(option.isCorrect, index)}
                  disabled={selectedOption !== null} // Disable all buttons after selection
                  className={`group relative rounded-2xl shadow-xl hover:shadow-2xl p-3 md:p-4 border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    shouldHighlightCorrect || shouldHighlightSelectedCorrect
                      ? 'bg-green-600/90 border-green-400 backdrop-blur-sm' // Correct answer highlighting (both cases)
                      : shouldHighlightWrong 
                      ? 'bg-red-600/90 border-red-400 backdrop-blur-sm'     // Wrong answer highlighting
                      : selectedOption !== null
                      ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'   // Disabled state
                      : 'bg-gray-800/90 backdrop-blur-sm border-gray-700 hover:border-blue-500' // Normal state
                  } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Hover effect overlay - only show when not disabled */}
                  {selectedOption === null && (
                    <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  {/* Option content */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Option image */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                      <img 
                        src={option.image} 
                        alt={option.label} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                    </div>
                    {/* Option label with conditional coloring */}
                    <span className={`text-xs md:text-sm font-bold text-center transition-colors duration-300 ${
                      shouldHighlightCorrect || shouldHighlightSelectedCorrect
                        ? 'text-green-100'           // Correct answer text (both cases)
                        : shouldHighlightWrong 
                        ? 'text-red-100'             // Wrong answer text
                        : selectedOption !== null
                        ? 'text-gray-400'            // Disabled text
                        : 'text-gray-200 group-hover:text-blue-400' // Normal text
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback message section */}
          <div className="text-center h-12 md:h-16 flex items-center justify-center">
            {feedback && (
              <div className={`transition-all duration-500 ${showFeedback ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                {/* Feedback message with conditional styling */}
                <div className={`px-6 md:px-8 py-2 md:py-3 rounded-2xl shadow-2xl font-extrabold text-base md:text-xl border-4 transition-all duration-300 ${
                  feedback.includes('✅') 
                    ? 'bg-blue-600 text-white border-blue-500 hover:scale-105'    // Success styling
                    : 'bg-red-600 text-white border-red-500 hover:scale-105'      // Error styling
                }`}>
                  {feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
