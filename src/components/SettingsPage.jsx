/**
 * SettingsPage Component - Game settings and preferences
 */

import React, { useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function SettingsPage() {
  const { isDark } = useTheme();

  // state: settings
  const [settings, setSettings] = useState({
    difficulty: 'normal',
    soundEnabled: true,
    hintsEnabled: true,
  });

  // effect: load settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('colorquest-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // persistence: localStorage
  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('colorquest-settings', JSON.stringify(next));
      return next;
    });
  };

  // events: toggle switches
  const toggleBool = (key) => updateSetting(key, !settings[key]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Game Settings */}
          <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Game Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Difficulty</label>
                {/* forms: controlled select */}
                <select
                  value={settings.difficulty}
                  onChange={(e) => updateSetting('difficulty', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* events: toggle switches */}
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${isDark ? 'text-slate-200' : 'text-gray-900'} font-medium`}>Sound Effects</div>
                  <div className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-sm`}>Enable button clicks and correct/incorrect sounds</div>
                </div>
                <button
                  onClick={() => toggleBool('soundEnabled')}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-green-600' : isDark ? 'bg-slate-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* events: toggle switches */}
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${isDark ? 'text-slate-200' : 'text-gray-900'} font-medium`}>Hints</div>
                  <div className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-sm`}>Show subtle hints for beginners</div>
                </div>
                <button
                  onClick={() => toggleBool('hintsEnabled')}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    settings.hintsEnabled ? 'bg-green-600' : isDark ? 'bg-slate-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      settings.hintsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Data Management</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  // persistence: localStorage
                  const data = {
                    history: JSON.parse(localStorage.getItem('colorquest-history') || '[]'),
                    settings: JSON.parse(localStorage.getItem('colorquest-settings') || '{}'),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'colorquest-backup.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Export Data
              </button>

              <button
                onClick={() => {
                  // persistence: localStorage
                  if (confirm('This will clear your game history and settings. Continue?')) {
                    localStorage.removeItem('colorquest-history');
                    localStorage.removeItem('colorquest-settings');
                    setSettings({ difficulty: 'normal', soundEnabled: true, hintsEnabled: true });
                  }
                }}
                className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
