import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import Game from './components/GameScreen';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? <Game onHome={() => setStarted(false)} /> : <StartScreen onStart={() => setStarted(true)} />}
    </>
  );
}

export default App;
