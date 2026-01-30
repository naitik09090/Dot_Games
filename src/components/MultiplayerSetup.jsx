import React, { useState } from 'react';

function MultiplayerSetup({ setGameState, player1Settings, setPlayer1Settings, player2Settings, setPlayer2Settings, darkMode }) {
    const [player1Ready, setPlayer1Ready] = useState(false);
    const [player2Ready, setPlayer2Ready] = useState(false);

    const [player1Name, setPlayer1Name] = useState(player1Settings.name || '');
    const [player1Color, setPlayer1Color] = useState(player1Settings.color || '#ef4444');
    const avatars = ['👤', '🧑‍🚀', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🦍', '🐶', '🐱', '🦊', '🦁', '🐸', '🐙', '🤖', '👽'];
    const [player1Avatar, setPlayer1Avatar] = useState(player1Settings.avatar || avatars[0]);

    const [player2Name, setPlayer2Name] = useState(player2Settings.name || '');
    const [player2Color, setPlayer2Color] = useState(player2Settings.color || '#22c55e');
    const [player2Avatar, setPlayer2Avatar] = useState(player2Settings.avatar || avatars[0]);

    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Yellow', value: '#eab308' }
    ];

    const handlePlayer1Ready = () => {
        if (player1Name.trim()) {
            setPlayer1Settings({
                name: player1Name.trim(),
                color: player1Color,
                avatar: player1Avatar
            });
            setPlayer1Ready(true);
        }
    };

    const handlePlayer2Ready = () => {
        if (player2Name.trim()) {
            setPlayer2Settings({
                name: player2Name.trim(),
                color: player2Color,
                avatar: player2Avatar
            });
            setPlayer2Ready(true);
        }
    };

    const handlePlay = () => {
        if (player1Ready && player2Ready) {
            setGameState('playing');
        }
    };

    const handleEditPlayer = (player) => {
        if (player === 1) {
            setPlayer1Ready(false);
        } else {
            setPlayer2Ready(false);
        }
    };

    const regenerateP1Avatar = () => {
        const randomIndex = Math.floor(Math.random() * avatars.length);
        setPlayer1Avatar(avatars[randomIndex]);
    };

    const regenerateP2Avatar = () => {
        const randomIndex = Math.floor(Math.random() * avatars.length);
        setPlayer2Avatar(avatars[randomIndex]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="flex gap-6 items-start">
                {player1Ready && player2Ready ? (
                    <div className={`rounded-lg p-8 w-96 player-setup-card ${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}>
                        <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-black' : 'text-white'}`}>Ready to Play!</h2>

                        <div className="mb-2">
                            <h3 className={`font-bold mb-2 ${darkMode ? 'text-black' : 'text-white'}`}>First Player</h3>
                            <p className={`${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>NAME: {player1Settings.name}</p>
                            <p className={`flex items-center gap-2 ${darkMode ? 'text-gray-800' : 'text-white'}`}>
                                COLOR:
                                <span
                                    className="inline-block w-6 h-6 rounded"
                                    style={{ backgroundColor: player1Settings.color }}
                                ></span>
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className={`font-bold mb-2 ${darkMode ? 'text-gray-800' : 'text-white'}`}>Second Player</h3>
                            <p className={`${darkMode ? 'text-gray-800' : 'text-white'}`}>NAME: {player2Settings.name}</p>
                            <p className={`flex items-center gap-2 ${darkMode ? 'text-gray-800' : 'text-white'}`}>
                                COLOR:
                                <span
                                    className="inline-block w-6 h-6 rounded"
                                    style={{ backgroundColor: player2Settings.color }}
                                ></span>
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setPlayer1Ready(false);
                                    setPlayer2Ready(false);
                                }}
                                className="w-100 p-4 h-14 rounded text-white font-semibold text-lg transition-colors bg-gray-500 hover:bg-gray-600 flex items-center justify-center"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePlay}
                                className="h-14 p-4 rounded text-white font-semibold text-lg transition-colors ready-button flex items-center justify-center"
                                style={{
                                    backgroundColor: '#2d2d2d',
                                    cursor: 'pointer'
                                }}
                            >
                                PLAY GAME
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Player 1 Card */}
                        {!player1Ready ? (
                            <div className={`rounded-lg p-8 w-96 player-setup-card ${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}>
                                <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-gray-800' : 'text-white'}`}>First Player</h2>

                                <div className="flex justify-center mb-6 relative">
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: player1Color }}
                                    >
                                        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-4xl">{player1Avatar}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={regenerateP1Avatar}
                                        className={`absolute top-0 right-28 rounded p-2 transition-colors avatar-dice ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                                        title="Randomize avatar"
                                    >
                                        🎲
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-800' : 'text-white'}`}>NAME</label>
                                    <input
                                        type="text"
                                        value={player1Name}
                                        onChange={(e) => setPlayer1Name(e.target.value)}
                                        placeholder="NAME"
                                        className={`w-full px-4 py-3 rounded border-none outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className={`block mb-3 font-semibold ${darkMode ? 'text-gray-800' : 'text-white'}`}>COLOR</label>
                                    <div className="flex gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setPlayer1Color(color.value)}
                                                className="w-14 h-14 rounded transition-all color-button relative"
                                                style={{
                                                    backgroundColor: color.value,
                                                    border: player1Color === color.value ? '4px solid #2d2d2d' : '4px solid transparent',
                                                    transform: player1Color === color.value ? 'scale(1.1)' : 'scale(1)'
                                                }}
                                                title={color.name}
                                            >
                                                {player1Color === color.value && (
                                                    <span className="text-white text-2xl">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlayer1Ready}
                                    disabled={!player1Name.trim()}
                                    className={`w-full py-3 rounded font-semibold text-lg transition-colors ready-button ${darkMode ? "bg-gray-800 text-white" : 'bg-white text-gray-800'}`}
                                    style={{
                                        // backgroundColor: player1Name.trim() ? '#000000' : '#6b7280',
                                        cursor: player1Name.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    READY
                                </button>
                            </div>
                        ) : (
                            <div className={`rounded-lg p-8 w-96 player-setup-card text-center relative ${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}>
                                <button
                                    onClick={() => handleEditPlayer(1)}
                                    className="absolute z-10 p-2 bg-transparent border-none"
                                    style={{ top: '10px', right: '10px' }}
                                >
                                    ✏️
                                </button>
                                <div className="flex justify-center mb-6">
                                    <div className="w-32 h-32 rounded-full bg-green-400 flex items-center justify-center">
                                        <span className="text-6xl text-white">✓</span>
                                    </div>
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-800' : 'text-white'}`}>First Player is ready!</h3>
                            </div>
                        )}

                        {/* Player 2 Card */}
                        {!player2Ready ? (
                            <div className={`rounded-lg p-8 w-96 player-setup-card ${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}>
                                <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-gray-800' : 'text-white'}`}>Second Player</h2>

                                <div className="flex justify-center mb-6 relative">
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: player2Color }}
                                    >
                                        <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center">
                                            <span className="text-4xl">{player2Avatar}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={regenerateP2Avatar}
                                        className={`absolute top-0 right-28 rounded p-2 transition-colors avatar-dice ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                                        title="Randomize avatar"
                                    >
                                        🎲
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-800' : 'text-white'}`}>NAME</label>
                                    <input
                                        type="text"
                                        value={player2Name}
                                        onChange={(e) => setPlayer2Name(e.target.value)}
                                        placeholder="NAME"
                                        className={`w-full px-4 py-3 rounded border-none outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className={`block mb-3 font-semibold ${darkMode ? 'text-gray-800' : 'text-white'}`}>COLOR</label>
                                    <div className="flex gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setPlayer2Color(color.value)}
                                                className="w-14 h-14 rounded transition-all color-button relative"
                                                style={{
                                                    backgroundColor: color.value,
                                                    border: player2Color === color.value ? '4px solid #2d2d2d' : '4px solid transparent',
                                                    transform: player2Color === color.value ? 'scale(1.1)' : 'scale(1)'
                                                }}
                                                title={color.name}
                                            >
                                                {player2Color === color.value && (
                                                    <span className="text-white text-2xl">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlayer2Ready}
                                    disabled={!player2Name.trim()}
                                    className={`w-full py-3 rounded text-white font-semibold text-lg transition-colors ready-button ${darkMode ? "bg-gray-800 text-white" : 'bg-white text-gray-800'}`}
                                    style={{
                                        // backgroundColor: player2Name.trim() ? '#000000' : '#6b7280',
                                        cursor: player2Name.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    READY
                                </button>
                            </div>
                        ) : (
                            <div className={`rounded-lg p-8 w-96 player-setup-card text-center relative ${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}>
                                <button
                                    onClick={() => handleEditPlayer(2)}
                                    className="absolute z-10 p-2 bg-transparent border-none"
                                    style={{ top: '10px', right: '10px' }}
                                >
                                    ✏️
                                </button>
                                <div className="flex justify-center mb-6">
                                    <div className="w-32 h-32 rounded-full bg-green-400 flex items-center justify-center">
                                        <span className="text-6xl text-white">✓</span>
                                    </div>
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-800' : 'text-white'}`}>Second Player is ready!</h3>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default MultiplayerSetup;