import React from 'react';

function GridSelection({ setGameState, gameMode, gridSize, setGridSize, darkMode }) {
    const gridSizes = [4, 6, 8, 10];

    const handleContinue = (size, isOnline) => {
        setGridSize(size);
        if (isOnline) {
            alert('Online game feature coming soon!');
            return;
        }
        if (gameMode === 'multiplayer') {
            setGameState('multiplayerSetup');
        } else {
            setGameState('setupPlayer');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="grid grid-cols-2 gap-4 mb-8">
                {gridSizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => setGridSize(size)}
                        className={`w-40 h-40 rounded-lg text-4xl font-bold transition-all ${gridSize === size
                            ? 'bg-red-600 text-white scale-105'
                            : darkMode ? 'bg-white text-black hover:scale-105' : 'bg-gray-800 text-white hover:scale-105'
                            }`}
                    >
                        {size}x{size}
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                {gameMode === 'multiplayer' ? (
                    <>
                        <button
                            onClick={() => handleContinue(gridSize, true)}
                            className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-colors border border-gray-600"
                        >
                            <span>📡</span> Online Game
                        </button>
                        <button
                            onClick={() => handleContinue(gridSize, false)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-colors"
                        >
                            <span>🎮</span> Offline Game
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => handleContinue(gridSize, false)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-colors"
                    >
                        <span>▶️</span> Start Game
                    </button>
                )}
            </div>
        </div>
    );
}

export default GridSelection;