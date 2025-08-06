import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

// Theme Provider
import { ThemeProvider } from './contexts/ThemeContext';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './components/HomePage';
import EnhancedGameScreen from './components/EnhancedGameScreen';
import GameScreen from './components/GameScreen'; // Keep original for backward compatibility
import StatisticsPage from './components/StatisticsPage';
import SettingsPage from './components/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<EnhancedGameScreen />} />
            <Route path="/game-classic" element={<GameScreen onHome={() => window.location.href = '/'} />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
        <Analytics />
      </Router>
    </ThemeProvider>
  );
}

export default App;
