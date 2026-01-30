import React, { useState } from 'react';

function HomePage({ setGameState, setGameMode, darkMode }) {
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [showRules, setShowRules] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
            <div className="text-center mb-12">
                <h1 className={`text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Dots Game
                </h1>
                <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Play with your friends and try to get the highest score.
                </p>
            </div>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => {
                        setGameMode('singlePlayer');
                        setGameState('gridSelection');
                    }}
                    className={`px-12 py-4 rounded-lg text-lg font-semibold transition-colors border border-gray-600 ${darkMode ? "bg-white text-black" : 'bg-gray-800 text-white'}`}
                >
                    Single Player
                </button>
                <button
                    onClick={() => {
                        setGameMode('multiplayer');
                        setGameState('gridSelection');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                    Multiplayer
                </button>
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <button
                    onClick={() => setMusicPlaying(!musicPlaying)}
                    className={` flex items-center gap-2 hover:text-red-500 bg-transparent ${darkMode ? 'text-white' : 'text-black'} transition-colors`}
                >
                    <span className="text-2xl">{musicPlaying ? '🔇' : '🔊'}</span>
                    <span>Click to listen a nice music</span>
                </button>
            </div>

            <div className="absolute bottom-8 right-8">
                <button
                    onClick={() => setShowRules(true)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${darkMode ? 'bg-white' : 'bg-gray-800'}`}
                >
                    <span className="text-xl">❓</span>
                    <span className={`font-semibold ${darkMode ? 'text-black' : 'text-white'}`}>How to Play</span>
                </button>
            </div>

            {/* Rules Modal */}
            {showRules && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div
                        className={`rounded-lg p-8 relative shadow-2xl transform transition-all scale-100 border-2 ${darkMode ? 'bg-white border-gray-200 text-black' : 'bg-gray-800 border-gray-200 text-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* <button
                            onClick={() => setShowRules(false)}
                            className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold transition-all ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
                        >
                            ✕
                        </button> */}

                        <div className="text-center mb-5">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent inline-block">
                                How to Play
                            </h2>
                            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Master the art of connecting dots!</p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className={`p-4 rounded-xl flex items-start gap-4 transition-colors ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-blue-50'}`}>
                                <div className="text-3xl p-2 bg-blue-500/10 rounded-lg">🎯</div>
                                <div className={`${darkMode ? 'text-gray-800' : 'text-gray-600'}`}>
                                    <h3 className="font-bold text-lg mb-1">Objective</h3>
                                    <p>Connect adjacent dots to form squares. Complete more squares than your opponent to win.</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl flex items-start gap-4 transition-colors ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-blue-50'}`}>
                                <div className="text-3xl p-2 bg-green-500/10 rounded-lg">✏️</div>
                                <div className={`${darkMode ? 'text-gray-800' : 'text-gray-600'}`}>
                                    <h3 className="font-bold text-lg mb-1">Take Turns</h3>
                                    <p>Click between any two adjacent dots to draw a line. Think ahead to trap your opponent!</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl flex items-start gap-4 transition-colors ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-blue-50'}`}>
                                <div className="text-3xl p-2 bg-purple-500/10 rounded-lg">🎁</div>
                                <div className={`${darkMode ? 'text-gray-800' : 'text-gray-600'}`}>
                                    <h3 className="font-bold text-lg mb-1">Score & Bonus</h3>
                                    <p>
                                        Completing a box scores <strong>1 point</strong> and grants an <span className="text-red-500 font-bold underline decoration-wavy">extra turn</span>. Chain them for big combos!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowRules(false)}
                                className={`p-5 px-12 rounded-full font-bold ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                            >
                                <h2 className="py-2">Let's Play!</h2>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default HomePage;