import React, { useState, useEffect, useCallback } from 'react';

function GameBoard({ mode, darkMode, player1Settings, player2Settings, gridSize: GRID_SIZE }) {
    const [horizontalLines, setHorizontalLines] = useState(
        Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(null))
    );
    const [verticalLines, setVerticalLines] = useState(
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(null))
    );
    const [boxes, setBoxes] = useState(
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
    );
    const [currentPlayer, setCurrentPlayer] = useState('player1');
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [playerNames] = useState({
        player1: player1Settings.name || 'Player 1',
        player2: mode === 'singlePlayer' ? 'AI' : (player2Settings?.name || 'Player 2')
    });
    // Default P1 to Green, P2/AI to Red
    const [player1Color] = useState(player1Settings.color || '#22c55e');
    const [player2Color] = useState(mode === 'singlePlayer' ? '#ef4444' : (player2Settings?.color || '#ef4444'));

    const checkBox = useCallback((row, col, newHLines, newVLines) => {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false;

        const top = newHLines[row][col];
        const bottom = newHLines[row + 1][col];
        const left = newVLines[row][col];
        const right = newVLines[row][col + 1];

        return top && bottom && left && right;
    }, []);

    const handleLineClick = useCallback((type, row, col, fromAI = false) => {
        if (gameOver) return;
        if (mode === 'singlePlayer' && currentPlayer === 'player2' && !fromAI) return;

        const lines = type === 'horizontal' ? horizontalLines : verticalLines;
        if (lines[row][col]) return;

        const newLines = lines.map(r => [...r]);
        newLines[row][col] = currentPlayer;

        if (type === 'horizontal') {
            setHorizontalLines(newLines);
        } else {
            setVerticalLines(newLines);
        }

        let boxCompleted = false;
        const newBoxes = boxes.map(r => [...r]);
        const newScores = { ...scores };

        const boxesToCheck = type === 'horizontal'
            ? [[row - 1, col], [row, col]]
            : [[row, col - 1], [row, col]];

        boxesToCheck.forEach(([r, c]) => {
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !newBoxes[r][c]) {
                const hLines = type === 'horizontal' ? newLines : horizontalLines;
                const vLines = type === 'vertical' ? newLines : verticalLines;

                if (checkBox(r, c, hLines, vLines)) {
                    newBoxes[r][c] = currentPlayer;
                    newScores[currentPlayer]++;
                    boxCompleted = true;
                }
            }
        });

        setBoxes(newBoxes);
        setScores(newScores);

        const totalBoxes = GRID_SIZE * GRID_SIZE;
        if (newScores.player1 + newScores.player2 === totalBoxes) {
            setGameOver(true);
        } else if (!boxCompleted) {
            setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
        }
    }, [gameOver, mode, currentPlayer, horizontalLines, verticalLines, boxes, scores, checkBox, GRID_SIZE]);

    useEffect(() => {
        if (mode === 'singlePlayer' && currentPlayer === 'player2' && !gameOver) {
            const timer = setTimeout(() => {
                makeAIMove();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, mode, gameOver, horizontalLines, verticalLines]);

    const makeAIMove = () => {
        let moveMade = false;

        // helper to get available moves
        const getAvailableMoves = () => {
            const moves = [];
            for (let row = 0; row < horizontalLines.length; row++) {
                for (let col = 0; col < horizontalLines[row].length; col++) {
                    if (!horizontalLines[row][col]) moves.push({ type: 'horizontal', row, col });
                }
            }
            for (let row = 0; row < verticalLines.length; row++) {
                for (let col = 0; col < verticalLines[row].length; col++) {
                    if (!verticalLines[row][col]) moves.push({ type: 'vertical', row, col });
                }
            }
            return moves;
        };

        const tryCompleteBox = () => {
            let completed = false;
            for (let row = 0; row < horizontalLines.length && !completed; row++) {
                for (let col = 0; col < horizontalLines[row].length && !completed; col++) {
                    if (!horizontalLines[row][col]) {
                        const testHLines = horizontalLines.map(r => [...r]);
                        testHLines[row][col] = 'player2';
                        const boxesToCheck = [[row - 1, col], [row, col]];
                        for (const [r, c] of boxesToCheck) {
                            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !boxes[r][c]) {
                                if (checkBox(r, c, testHLines, verticalLines)) {
                                    handleLineClick('horizontal', row, col, true);
                                    completed = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (!completed) {
                for (let row = 0; row < verticalLines.length && !completed; row++) {
                    for (let col = 0; col < verticalLines[row].length && !completed; col++) {
                        if (!verticalLines[row][col]) {
                            const testVLines = verticalLines.map(r => [...r]);
                            testVLines[row][col] = 'player2';
                            const boxesToCheck = [[row, col - 1], [row, col]];
                            for (const [r, c] of boxesToCheck) {
                                if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !boxes[r][c]) {
                                    if (checkBox(r, c, horizontalLines, testVLines)) {
                                        handleLineClick('vertical', row, col, true);
                                        completed = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return completed;
        };

        // Strategy 1: Try to complete a box
        moveMade = tryCompleteBox();

        // Strategy 2: Avoid giving away a box (Safe Move)
        if (!moveMade) {
            const availableMoves = getAvailableMoves();
            const safeMoves = availableMoves.filter(move => {
                const { type, row, col } = move;
                let isSafe = true;

                // Temporarily make the move
                let testHLines = horizontalLines;
                let testVLines = verticalLines;

                if (type === 'horizontal') {
                    testHLines = horizontalLines.map(r => [...r]);
                    testHLines[row][col] = 'player2';
                } else {
                    testVLines = verticalLines.map(r => [...r]);
                    testVLines[row][col] = 'player2';
                }

                const adjBoxes = type === 'horizontal' ? [[row - 1, col], [row, col]] : [[row, col - 1], [row, col]];

                for (const [r, c] of adjBoxes) {
                    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                        let count = 0;
                        if (testHLines[r][c]) count++;
                        if (testHLines[r + 1][c]) count++;
                        if (testVLines[r][c]) count++;
                        if (testVLines[r][c + 1]) count++;

                        if (count === 3) {
                            isSafe = false;
                        }
                    }
                }
                return isSafe;
            });

            if (safeMoves.length > 0) {
                const move = safeMoves[Math.floor(Math.random() * safeMoves.length)];
                handleLineClick(move.type, move.row, move.col, true);
                moveMade = true;
            }
        }

        // Strategy 3: Random Move (Fallback)
        if (!moveMade) {
            const availableMoves = getAvailableMoves();
            if (availableMoves.length > 0) {
                const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                handleLineClick(move.type, move.row, move.col, true);
            }
        }
    };

    const resetGame = () => {
        setHorizontalLines(Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(null)));
        setVerticalLines(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(null)));
        setBoxes(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
        setCurrentPlayer('player1');
        setScores({ player1: 0, player2: 0 });
        setGameOver(false);
    };

    // Convert hex color to rgba with opacity
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Dynamic sizing constants
    const BASE_BOARD_SIZE = 400; // Target width for the grid area
    const SPACING = Math.min(70, BASE_BOARD_SIZE / GRID_SIZE); // Cap spacing at 70 for small grids
    const PADDING = 50;
    const BOARD_PIXEL_SIZE = SPACING * GRID_SIZE;
    const SVG_DIMENSION = BOARD_PIXEL_SIZE + (PADDING * 2);

    // Visual scaling based on density
    const isDense = SPACING < 45;
    const DOT_RADIUS = isDense ? 5 : 8;
    const LINE_THICKNESS = isDense ? 4 : 6;
    const CLICK_AREA = Math.max(15, SPACING * 0.4);
    const BOX_PADDING = isDense ? 2 : 3;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="flex items-center gap-12">
                {/* Player 1 */}
                <div className="text-center">
                    <div
                        className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all`}
                        style={{
                            backgroundColor: player1Color,
                            boxShadow: currentPlayer === 'player1' ? `0 0 0 4px ${hexToRgba(player1Color, 0.5)}` : 'none'
                        }}
                    >
                        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-4xl">{player1Settings.avatar || '👤'}</span>
                        </div>
                    </div>
                    <div className={`${darkMode ? 'text-white' : 'text-gray-800'} font-bold text-xl mb-2`}>{playerNames.player1}</div>
                    <div className={`${darkMode ? 'text-white' : 'text-gray-800'} text-3xl font-bold`}>{scores.player1}</div>
                </div>

                {/* Game Board */}
                <div className="relative">
                    <svg
                        width={SVG_DIMENSION}
                        height={SVG_DIMENSION}
                        className="bg-transparent"
                        style={{
                            '--hover-color': currentPlayer === 'player1' ? player1Color : player2Color
                        }}
                    >
                        {/* Draw horizontal lines */}
                        {horizontalLines.map((row, rowIdx) =>
                            row.map((isActive, colIdx) => {
                                const x1 = PADDING + colIdx * SPACING;
                                const y1 = PADDING + rowIdx * SPACING;
                                const x2 = x1 + SPACING;
                                const y2 = y1;
                                const isInteractable = !isActive && !gameOver && (mode === 'multiplayer' || currentPlayer === 'player1');

                                return (
                                    <React.Fragment key={`h-${rowIdx}-${colIdx}`}>
                                        <line
                                            x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke="transparent"
                                            strokeWidth={CLICK_AREA}
                                            className={isInteractable ? 'cursor-pointer hit-line available' : ''}
                                            onClick={() => handleLineClick('horizontal', rowIdx, colIdx)}
                                        />
                                        <line
                                            x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke={isActive ? (isActive === 'player1' ? player1Color : player2Color) : 'transparent'}
                                            strokeWidth={LINE_THICKNESS}
                                            strokeLinecap="round"
                                            className="visual-line"
                                            style={{ pointerEvents: 'none', transition: 'all 0.3s' }}
                                        />
                                    </React.Fragment>
                                );
                            })
                        )}

                        {/* Draw vertical lines */}
                        {verticalLines.map((row, rowIdx) =>
                            row.map((isActive, colIdx) => {
                                const x1 = PADDING + colIdx * SPACING;
                                const y1 = PADDING + rowIdx * SPACING;
                                const x2 = x1;
                                const y2 = y1 + SPACING;
                                const isInteractable = !isActive && !gameOver && (mode === 'multiplayer' || currentPlayer === 'player1');

                                return (
                                    <React.Fragment key={`v-${rowIdx}-${colIdx}`}>
                                        <line
                                            x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke="transparent"
                                            strokeWidth={CLICK_AREA}
                                            className={isInteractable ? 'cursor-pointer hit-line available' : ''}
                                            onClick={() => handleLineClick('vertical', rowIdx, colIdx)}
                                        />
                                        <line
                                            x1={x1} y1={y1} x2={x2} y2={y2}
                                            stroke={isActive ? (isActive === 'player1' ? player1Color : player2Color) : 'transparent'}
                                            strokeWidth={LINE_THICKNESS}
                                            strokeLinecap="round"
                                            className="visual-line"
                                            style={{ pointerEvents: 'none', transition: 'all 0.3s' }}
                                        />
                                    </React.Fragment>
                                );
                            })
                        )}

                        {/* Draw dots */}
                        {Array(GRID_SIZE + 1).fill(null).map((_, rowIdx) =>
                            Array(GRID_SIZE + 1).fill(null).map((_, colIdx) => (
                                <circle
                                    key={`dot-${rowIdx}-${colIdx}`}
                                    cx={PADDING + colIdx * SPACING}
                                    cy={PADDING + rowIdx * SPACING}
                                    r={DOT_RADIUS}
                                    fill={darkMode ? 'white' : '#1f2937'}
                                />
                            ))
                        )}

                        {/* Draw completed boxes */}
                        {boxes.map((row, rowIdx) =>
                            row.map((owner, colIdx) => {
                                if (owner) {
                                    return (
                                        <rect
                                            key={`box-${rowIdx}-${colIdx}`}
                                            x={PADDING + colIdx * SPACING + BOX_PADDING}
                                            y={PADDING + rowIdx * SPACING + BOX_PADDING}
                                            width={SPACING - (BOX_PADDING * 2)}
                                            height={SPACING - (BOX_PADDING * 2)}
                                            fill={owner === 'player1' ? hexToRgba(player1Color, 0.3) : hexToRgba(player2Color, 0.3)}
                                            className="animate-pulse"
                                        />
                                    );
                                }
                                return null;
                            })
                        )}
                    </svg>
                </div>

                {/* Player 2 / AI */}
                <div className="text-center">
                    <div
                        className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all`}
                        style={{
                            backgroundColor: player2Color,
                            boxShadow: currentPlayer === 'player2' ? `0 0 0 4px ${hexToRgba(player2Color, 0.5)}` : 'none'
                        }}
                    >
                        <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center">
                            <span className="text-4xl">{mode === 'singlePlayer' ? '🤖' : (player2Settings.avatar || '👤')}</span>
                        </div>
                    </div>
                    <div className={`${darkMode ? 'text-white' : 'text-gray-800'} font-bold text-xl mb-2`}>{playerNames.player2}</div>
                    <div className={`${darkMode ? 'text-white' : 'text-gray-800'} text-3xl font-bold`}>{scores.player2}</div>
                </div>
            </div>

            {/* Game Over Modal */}
            <div>
                {
                    gameOver && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 game-over-modal">
                            {mode === 'singlePlayer' && scores.player2 > scores.player1 ? (
                                <div className="bg-red-900 rounded-lg p-8 text-center max-w-md border-4 border-red-600 shadow-2xl">
                                    <h2 className="text-5xl font-bold text-red-200 mb-6 font-mono">GAME OVER</h2>
                                    <div className="text-3xl text-red-100 mb-6">
                                        🤖 The AI Has Won!
                                    </div>
                                    <div className="text-xl text-red-200 mb-8 font-mono">
                                        Humanity: {scores.player1} - Machines: {scores.player2}
                                    </div>
                                    <button
                                        onClick={resetGame}
                                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors border-2 border-red-400"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-800 rounded-lg p-8 text-center max-w-md border-4 border-green-500 shadow-2xl">
                                    <div className="text-3xl text-white mb-6">
                                        {scores.player1 > scores.player2
                                            ? `🎉 ${playerNames.player1} Wins!`
                                            : scores.player2 > scores.player1
                                                ? `🎉 ${playerNames.player2} Wins!`
                                                : "It's a Tie!"}
                                    </div>
                                    <div className="text-xl text-gray-300 mb-8 font-mono">
                                        Final Score: {scores.player1} - {scores.player2}
                                    </div>
                                    <button
                                        onClick={resetGame}
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors border-2 border-green-500"
                                    >
                                        Play Again
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default GameBoard;