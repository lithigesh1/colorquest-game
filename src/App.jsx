import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import StartScreen from './components/StartScreen';
import Game from './components/GameScreen';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? <Game onHome={() => setStarted(false)} /> : <StartScreen onStart={() => setStarted(true)} />}
      <Analytics />
    </>
  );
}

export default App;
