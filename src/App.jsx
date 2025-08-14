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
    // context: global theme provider (ThemeProvider)
    <ThemeProvider>
      <Router>
        <Layout>
          {/* routing: application routes */}
          <Routes>
            {/* route – specific route definition */}
            <Route path="/" element={<HomePage />} />
            {/* route – specific route definition */}
            <Route path="/game" element={<EnhancedGameScreen />} />
            {/* route – specific route definition */}
            {/* props: passing onHome callback */}
            <Route path="/game-classic" element={<GameScreen onHome={() => window.location.href = '/'} />} />
            {/* route – specific route definition */}
            <Route path="/statistics" element={<StatisticsPage />} />
            {/* route – specific route definition */}
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
        <Analytics />
      </Router>
    </ThemeProvider>
  );
}

export default App;
