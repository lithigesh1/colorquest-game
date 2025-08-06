/**
 * SettingsPage Component - Game settings and preferences
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function SettingsPage() {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'dark',
    difficulty: 'normal',
    autoAdvance: true,
    showHints: true,
    gameMode: 'classic',
    language: 'en'
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('colorquest-settings');
    if (savedSettings) {
      setSettings(prevSettings => ({ ...prevSettings, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('colorquest-settings', JSON.stringify(newSettings));
  };

  const resetAllData = () => {
    localStorage.removeItem('colorquest-history');
    localStorage.removeItem('colorquest-settings');
    setSettings({
      soundEnabled: true,
      animationsEnabled: true,
      theme: 'dark',
      difficulty: 'normal',
      autoAdvance: true,
      showHints: true,
      gameMode: 'classic',
      language: 'en'
    });
    setShowResetConfirm(false);
    alert('All data has been reset successfully!');
  };

  const exportData = () => {
    const history = localStorage.getItem('colorquest-history');
    const settings = localStorage.getItem('colorquest-settings');
    
    const exportData = {
      history: history ? JSON.parse(history) : [],
      settings: settings ? JSON.parse(settings) : {},
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `colorquest-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const settingSections = [
    {
      title: 'Gameplay',
      icon: '🎮',
      settings: [
        {
          key: 'difficulty',
          label: 'Difficulty Level',
          type: 'select',
          options: [
            { value: 'easy', label: 'Easy - More time, hints available' },
            { value: 'normal', label: 'Normal - Balanced gameplay' },
            { value: 'hard', label: 'Hard - Less time, no hints' },
            { value: 'expert', label: 'Expert - Challenge mode' }
          ]
        },
        {
          key: 'gameMode',
          label: 'Default Game Mode',
          type: 'select',
          options: [
            { value: 'classic', label: 'Classic - Standard gameplay' },
            { value: 'timed', label: 'Timed - Race against clock' },
            { value: 'speed', label: 'Speed - Fast-paced mode' },
            { value: 'zen', label: 'Zen - Relaxed, no pressure' }
          ]
        },
        {
          key: 'autoAdvance',
          label: 'Auto-advance to next question',
          type: 'toggle'
        },
        {
          key: 'showHints',
          label: 'Show helpful hints',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Audio & Visual',
      icon: '🎨',
      settings: [
        {
          key: 'soundEnabled',
          label: 'Sound Effects',
          type: 'toggle'
        },
        {
          key: 'animationsEnabled',
          label: 'Animations & Transitions',
          type: 'toggle'
        },
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'dark', label: 'Dark - Easy on the eyes' },
            { value: 'light', label: 'Light - Bright and clean' },
            { value: 'auto', label: 'Auto - Follow system theme' }
          ]
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ⚙️ Settings
          </h1>
          <p className={`text-xl ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Customize your ColorQuest experience
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingSections.map((section) => (
            <div key={section.title} className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white/80 border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-6 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="mr-3 text-2xl">{section.icon}</span>
                {section.title}
              </h3>
              
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.key} className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-300 ${
                    isDark ? 'bg-slate-700/50' : 'bg-gray-100/50'
                  }`}>
                    <div className="flex-1">
                      <h4 className={`font-medium mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{setting.label}</h4>
                      {setting.type === 'select' && (
                        <p className={`text-sm ${
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          {setting.options.find(opt => opt.value === settings[setting.key])?.label}
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {setting.type === 'toggle' ? (
                        <button
                          onClick={() => updateSetting(setting.key, !settings[setting.key])}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            settings[setting.key] ? 'bg-green-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                            settings[setting.key] ? 'transform translate-x-6' : ''
                          }`} />
                        </button>
                      ) : (
                        <select
                          value={settings[setting.key]}
                          onChange={(e) => updateSetting(setting.key, e.target.value)}
                          className={`px-3 py-2 rounded-lg border transition-colors duration-300 focus:outline-none ${
                            isDark 
                              ? 'bg-slate-600 text-white border-slate-500 focus:border-green-500' 
                              : 'bg-white text-gray-900 border-gray-300 focus:border-green-500'
                          }`}
                        >
                          {setting.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label.split(' - ')[0]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Management */}
        <div className={`backdrop-blur-sm rounded-2xl p-6 border mt-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-800/80 border-slate-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="mr-3 text-2xl">💾</span>
            Data Management
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Export Data */}
            <div className={`p-4 rounded-xl transition-colors duration-300 ${
              isDark ? 'bg-slate-700/50' : 'bg-gray-100/50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Export Your Data</h4>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Download your game history and settings as a backup file
              </p>
              <button
                onClick={exportData}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>📥</span>
                <span>Export Data</span>
              </button>
            </div>

            {/* Reset Data */}
            <div className={`p-4 rounded-xl transition-colors duration-300 ${
              isDark ? 'bg-slate-700/50' : 'bg-gray-100/50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Reset All Data</h4>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Clear all game history, statistics, and settings
              </p>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🗑️</span>
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>


        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-6 max-w-md w-full border transition-colors duration-300 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-300'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>⚠️ Confirm Reset</h3>
              <p className={`mb-6 ${
                isDark ? 'text-slate-300' : 'text-gray-600'
              }`}>
                This will permanently delete all your game history, statistics, and settings. 
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={resetAllData}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
