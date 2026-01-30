import React, { useState } from 'react';
import HomePage from './HomePage.jsx';
import GridSelection from './GridSelection.jsx';
import PlayerSetup from './PlayerSetup.jsx';
import MultiplayerSetup from './MultiplayerSetup.jsx';
import GameBoard from './GameBoard.jsx';


function DotsGame() {
  const [gameState, setGameState] = useState('home');
  const [gameMode, setGameMode] = useState('');
  const [gridSize, setGridSize] = useState(4);
  const [darkMode, setDarkMode] = useState(true);
  const [player1Settings, setPlayer1Settings] = useState({
    name: 'Player 1',
    color: '#22c55e',
    avatar: '👤'
  });
  const [player2Settings, setPlayer2Settings] = useState({
    name: 'Player 2',
    color: '#ef4444',
    avatar: '👤'
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        {gameState !== 'home' && (
          <button
            onClick={() => setGameState('home')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            ← Back
          </button>
        )}
        {gameState === 'home' && <div></div>}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-transparent flex items-center gap-2 text-white"
        >
          <span className="text-xl">☀️</span>
          <div className={`w-12 h-6 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} relative transition-colors`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
          </div>
          <span className="text-xl">🌙</span>
        </button>
      </header>

      {/* Content */}
      {gameState === 'home' && (
        <HomePage
          setGameState={setGameState}
          setGameMode={setGameMode}
          darkMode={darkMode}
        />
      )}
      {gameState === 'gridSelection' && (
        <GridSelection
          setGameState={setGameState}
          gameMode={gameMode}
          gridSize={gridSize}
          setGridSize={setGridSize}
          darkMode={darkMode}
        />
      )}
      {gameState === 'setupPlayer' && (
        <PlayerSetup
          setGameState={setGameState}
          playerSettings={player1Settings}
          setPlayerSettings={setPlayer1Settings}
          darkMode={darkMode}
          gridSize={gridSize}
        />
      )}
      {gameState === 'multiplayerSetup' && (
        <MultiplayerSetup
          setGameState={setGameState}
          player1Settings={player1Settings}
          setPlayer1Settings={setPlayer1Settings}
          player2Settings={player2Settings}
          setPlayer2Settings={setPlayer2Settings}
          darkMode={darkMode}
        />
      )}
      {gameState === 'playing' && (
        <GameBoard
          mode={gameMode}
          darkMode={darkMode}
          player1Settings={player1Settings}
          player2Settings={player2Settings}
          gridSize={gridSize}
        />
      )}
    </div>
  );
}

export default DotsGame;