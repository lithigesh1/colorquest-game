/**
 * EnhancedGameScreen Component - Multi-mode game interface with timer and difficulty settings
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import getShuffledQuestions from '../data';

export default function EnhancedGameScreen() {
  // routing hooks: read query params and navigate
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const gameMode = searchParams.get('mode') || 'classic';
  
  // state: core game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // state: timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  
  // state: per-mode configuration
  const [modeSettings, setModeSettings] = useState({
    timeLimit: null,
    showTimer: false,
    autoAdvance: true,
    feedbackDuration: 1800,
    questionTime: null,
  });

  // derived config: set mode settings based on query param
  const initializeGameMode = useCallback(() => {
    switch (gameMode) {
      case 'timed':
        setModeSettings({
          timeLimit: 60,
          showTimer: true,
          autoAdvance: true,
          feedbackDuration: 1000,
          questionTime: null,
        });
        setTimeLeft(60);
        setTotalTime(60);
        break;
      case 'speed':
        setModeSettings({
          timeLimit: null,
          showTimer: true,
          autoAdvance: true,
          feedbackDuration: 800,
          questionTime: null,
        });
        setTimeLeft(0);
        setTotalTime(0);
        break;
      case 'hard':
        setModeSettings({
          timeLimit: 90,
          showTimer: true,
          autoAdvance: true,
          feedbackDuration: 1200,
          questionTime: 15,
        });
        setTimeLeft(90);
        setTotalTime(90);
        break;
      default: // classic
        setModeSettings({
          timeLimit: null,
          showTimer: false,
          autoAdvance: true,
          feedbackDuration: 1800,
          questionTime: null,
        });
        break;
    }
  }, [gameMode]);

  // persistence: save results to localStorage
  const saveGameResult = useCallback((finalScore) => {
    const endTime = Date.now();
    const duration = gameStartTime ? Math.floor((endTime - gameStartTime) / 1000) : 0;
    
    const gameResult = {
      id: Date.now(),
      score: finalScore,
      totalQuestions: questions.length,
      percentage: Math.round((finalScore / questions.length) * 100),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      gameMode: gameMode,
      duration: duration,
      timeBonus: gameMode === 'speed' ? Math.max(0, 300 - duration) : 0,
    };

    const savedHistory = localStorage.getItem('colorquest-history');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const updatedHistory = [gameResult, ...history].slice(0, 50);
    
    localStorage.setItem('colorquest-history', JSON.stringify(updatedHistory));
  }, [questions.length, gameMode, gameStartTime]);

  // effects: initialize game and questions
  useEffect(() => {
    initializeGameMode();
    setQuestions(getShuffledQuestions());
    setGameStartTime(Date.now());
  }, [gameMode, initializeGameMode]);

  // effects: countdown for timed/hard
  useEffect(() => {
    if (modeSettings.timeLimit && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [modeSettings.timeLimit, timeLeft, isFinished]);

  // effects: count-up timer for speed mode
  useEffect(() => {
    if (gameMode === 'speed' && !isFinished && gameStartTime) {
      const timer = setInterval(() => {
        setTimeLeft(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [gameMode, isFinished, gameStartTime]);

  const currentQuestion = questions[currentIndex];

  if (!questions.length || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-400 font-semibold">Loading ColorQuest...</p>
        </div>
      </div>
    );
  }

  // events: handle answer selection and auto-advance
  const handleSelect = (isCorrect, optionIndex) => {
    setSelectedOption(optionIndex);
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('✅ Correct! Amazing!');
    } else {
      setFeedback('❌ Wrong Answer!');
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
          setFeedback('');
          setShowFeedback(false);
          setIsTransitioning(false);
          setSelectedOption(null);
        } else {
          const finalScore = isCorrect ? score + 1 : score;
          saveGameResult(finalScore);
          setIsFinished(true);
        }
      }, 400);
    }, modeSettings.feedbackDuration);
  };

  // events: restart & navigation
  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setFeedback('');
    setIsFinished(false);
    setShowFeedback(false);
    setIsTransitioning(false);
    setSelectedOption(null);
    setQuestions(getShuffledQuestions());
    setGameStartTime(Date.now());
    initializeGameMode();
  };

  const handleHome = () => {
    navigate('/');
  };

  // derived UI info per mode
  const getGameModeInfo = () => {
    const modes = {
      classic: { name: 'Classic Mode', icon: '🎨', color: 'green' },
      timed: { name: 'Timed Challenge', icon: '⏱️', color: 'yellow' },
      speed: { name: 'Speed Run', icon: '💨', color: 'green' },
      hard: { name: 'Hard Mode', icon: '🧠', color: 'red' },
    };
    return modes[gameMode] || modes.classic;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    const gameInfo = getGameModeInfo();
    const finalTime = gameMode === 'speed' ? timeLeft : (totalTime - timeLeft);
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 p-8 text-center max-w-2xl w-full relative z-10">
          <div className="mb-6">
            <div className="inline-block p-4 bg-green-600 rounded-full mb-4 shadow-lg">
              <span className="text-4xl md:text-5xl">🎉</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-extrabold text-green-400 mb-3">
              {gameMode === 'timed' && timeLeft === 0 ? 'Time\'s Up!' : 'Congratulations!'}
            </h2>
            
            <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">{gameInfo.icon}</span>
                <span className="text-lg font-bold text-white">{gameInfo.name}</span>
              </div>
              
              <p className="text-xl md:text-2xl font-bold text-green-400 mb-2">
                Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
              </p>
              
              {modeSettings.showTimer && (
                <p className="text-lg text-gray-300">
                  {gameMode === 'speed' ? `Completed in: ${formatTime(timeLeft)}` : 
                   gameMode === 'timed' ? `Time remaining: ${formatTime(timeLeft)}` :
                   `Time taken: ${formatTime(finalTime)}`}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleRestart}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>🔄</span>
              <span>Play Again</span>
            </button>
            
            <button
              onClick={() => navigate('/statistics')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>📊</span>
              <span>View Stats</span>
            </button>

            <button 
              onClick={handleHome}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gameInfo = getGameModeInfo();

  return (
    <div className="min-h-screen bg-gray-900 p-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Game Header */}
        <div className="text-center mb-6">
          {/* Game Mode Badge */}
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className={`bg-${gameInfo.color}-600/20 border border-${gameInfo.color}-600/30 px-4 py-2 rounded-xl flex items-center space-x-2`}>
              <span className="text-2xl">{gameInfo.icon}</span>
              <span className="font-bold text-white">{gameInfo.name}</span>
            </div>
            
            {modeSettings.showTimer && (
              <div className={`px-4 py-2 rounded-xl font-bold text-xl ${
                gameMode === 'timed' ? 
                  timeLeft <= 10 ? 'bg-red-600 text-white animate-pulse' : 'bg-yellow-600 text-white' :
                gameMode === 'speed' ? 'bg-green-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {gameMode === 'speed' ? `⏱️ ${formatTime(timeLeft)}` : 
                 `⏰ ${formatTime(timeLeft)}`}
              </div>
            )}
          </div>

          {/* Progress and Score */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
            <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700">
              <span className="font-bold text-gray-200">
                Round {currentIndex + 1} of {questions.length}
              </span>
            </div>
            
            <div className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold">
              Score: {score}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xs mx-auto mb-4">
            <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden border border-gray-700">
              <div 
                className={`bg-${gameInfo.color}-500 h-full rounded-full transition-all duration-700`}
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Game Content */}
        <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Color Display */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <canvas 
                width={120} 
                height={120} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-2xl border-4 border-white/70 transition-all duration-300 hover:scale-105"
                ref={(canvas) => {
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = currentQuestion.color;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                  }
                }}
              />
              <div className="absolute -inset-2 bg-green-500/40 rounded-2xl blur opacity-40"></div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
              <p className="text-xl font-extrabold text-gray-200">
                {currentQuestion.color.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = option.isCorrect;
              const shouldHighlightCorrect = selectedOption !== null && !currentQuestion.options[selectedOption].isCorrect && isCorrectOption;
              const shouldHighlightWrong = isSelected && !isCorrectOption;
              const shouldHighlightSelectedCorrect = isSelected && isCorrectOption;
              
              return (
                // list & keys: answer options
                <button 
                  key={index} 
                  onClick={() => handleSelect(option.isCorrect, index)}
                  disabled={selectedOption !== null}
                  className={`group relative rounded-2xl shadow-xl p-4 border-2 transition-all duration-300 transform hover:scale-105 ${
                    shouldHighlightCorrect || shouldHighlightSelectedCorrect
                      ? 'bg-green-600/90 border-green-400'
                      : shouldHighlightWrong 
                      ? 'bg-red-600/90 border-red-400'
                      : selectedOption !== null
                      ? 'bg-gray-800/50 border-gray-600'
                      : 'bg-gray-800/90 border-gray-700 hover:border-green-500'
                  } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-2 rounded-xl overflow-hidden shadow-xl">
                      <img 
                        src={option.image} 
                        alt={option.label} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                    </div>
                    <span className={`text-sm font-bold text-center ${
                      shouldHighlightCorrect || shouldHighlightSelectedCorrect
                        ? 'text-green-100'
                        : shouldHighlightWrong 
                        ? 'text-red-100'
                        : selectedOption !== null
                        ? 'text-gray-400'
                        : 'text-gray-200 group-hover:text-green-400'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <div className="text-center h-16 flex items-center justify-center">
            {feedback && (
              <div className={`transition-all duration-500 ${showFeedback ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                <div className={`px-8 py-3 rounded-2xl font-extrabold text-xl border-4 ${
                  feedback.includes('✅') 
                    ? 'bg-green-600 text-white border-green-500'
                    : 'bg-red-600 text-white border-red-500'
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
