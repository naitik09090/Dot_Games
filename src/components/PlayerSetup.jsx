import React, { useState } from 'react';

function PlayerSetup({ setGameState, playerSettings, setPlayerSettings, darkMode }) {
    const [localName, setLocalName] = useState(playerSettings.name || '');
    const [selectedColor, setSelectedColor] = useState(playerSettings.color || '#ef4444');
    const avatars = ['👤', '🧑‍🚀', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🦍', '🐶', '🐱', '🦊', '🦁', '🐸', '🐙', '🤖', '👽'];
    const [currentAvatar, setCurrentAvatar] = useState(avatars[0]);

    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Yellow', value: '#eab308' }
    ];

    const handleReady = () => {
        if (localName.trim()) {
            setPlayerSettings({
                name: localName.trim(),
                color: selectedColor,
                avatar: currentAvatar
            });
            setGameState('playing');
        }
    };

    const regenerateAvatar = () => {
        const randomIndex = Math.floor(Math.random() * avatars.length);
        setCurrentAvatar(avatars[randomIndex]);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4`}>
            <div className={`rounded-lg p-8 max-w-md w-full player-setup-card ${darkMode ? 'bg-gray-100 text-black' : 'bg-gray-800 text-white'}`}>
                <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-black' : 'text-white'}`}>First Player</h2>

                {/* Avatar */}
                <div className="flex justify-center mb-6 relative">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-4xl">{currentAvatar}</span>
                        </div>
                    </div>
                    <button
                        onClick={regenerateAvatar}
                        className={`absolute top-0 right-32 rounded p-2 transition-colors avatar-dice ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        title="Randomize avatar"
                    >
                        🎲
                    </button>
                </div>

                {/* Name Input */}
                <div className="mb-6">
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-black' : 'text-white'}`}>NAME</label>
                    <input
                        type="text"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        placeholder="NAME"
                        className={`w-full px-4 py-3 rounded border-none outline-none ${darkMode ? "bg-gray-800 text-white" : 'bg-white text-gray-800'}`}
                    />
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                    <label className={`block mb-3 font-semibold ${darkMode ? 'text-black' : 'text-white'}`}>COLOR</label>
                    <div className="flex gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setSelectedColor(color.value)}
                                className="w-14 h-14 rounded transition-all color-button"
                                style={{
                                    backgroundColor: color.value,
                                    border: selectedColor === color.value ? '4px solid #2d2d2d' : '4px solid transparent',
                                    transform: selectedColor === color.value ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Ready Button */}
                <button
                    onClick={handleReady}
                    disabled={!localName.trim()}
                    className={`w-full py-3 rounded font-semibold text-lg transition-colors ready-button ${darkMode ? "bg-gray-800 text-white" : 'bg-white text-gray-800'}`}
                    style={{
                        // backgroundColor: localName.trim() ? '#2d2d2d' : '#6b7280',
                        cursor: localName.trim() ? 'pointer' : 'not-allowed'
                    }}
                >
                    READY
                </button>
            </div>
        </div>
    );
}

export default PlayerSetup;