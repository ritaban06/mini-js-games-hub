// --- Game Constants and State ---
const SIZE = 5;
const LIGHT_ON = 1;
const LIGHT_OFF = 0;
let boardState = [];
let moves = 0;
let isGameOver = false;

// DOM Elements
const gridElement = document.getElementById('game-grid');
const movesCounter = document.getElementById('moves-counter');
const resetButton = document.getElementById('reset-button');
const winModal = document.getElementById('win-modal');
const finalMovesText = document.getElementById('final-moves');
const playAgainButton = document.getElementById('play-again-button');

// --- Core Game Logic ---

/**
 * Generates a solvable Lights Out board.
 * This is done by starting with a solved board (all OFF) and performing 
 * a sequence of random, valid moves.
 * @returns {number[][]} The initial 5x5 board state (0s and 1s).
 */
function generateSolvableBoard() {
    // Start with a solved board (all lights off)
    let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(LIGHT_OFF));
    
    // Perform 15 to 30 random moves to guarantee solvability
    const numMoves = Math.floor(Math.random() * 16) + 15;
    
    for (let i = 0; i < numMoves; i++) {
        const r = Math.floor(Math.random() * SIZE);
        const c = Math.floor(Math.random() * SIZE);
        // Use the internal toggle function, without updating the UI
        toggleLight(board, r, c, false);
    }
    return board;
}

/**
 * Toggles the state of a single cell and its four orthogonal neighbors.
 * @param {number[][]} board - The 2D array representing the game state.
 * @param {number} r - Row index (0-4).
 * @param {number} c - Column index (0-4).
 * @param {boolean} [updateUI=true] - If true, updates the DOM and checks win condition.
 */
function toggleLight(board, r, c, updateUI = true) {
    // Offsets: Center, Right, Left, Down, Up
    const offsets = [
        [0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]
    ];

    offsets.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        // Check if the neighbor is within bounds (0 to SIZE-1)
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
            // Toggle the state (0 -> 1, 1 -> 0)
            board[nr][nc] = 1 - board[nr][nc];

            if (updateUI) {
                // Update the corresponding DOM element class
                const cellElement = document.getElementById(`c-${nr}-${nc}`);
                if (cellElement) {
                    const isOn = board[nr][nc] === LIGHT_ON;
                    cellElement.classList.toggle('on', isOn);
                    cellElement.classList.toggle('off', !isOn);
                }
            }
        }
    });

    if (updateUI) {
        moves++;
        movesCounter.textContent = moves;
        checkWinCondition();
    }
}

/**
 * Checks if the board is solved.
 */
function checkWinCondition() {
    // Use reduce/flat to sum all elements in the 2D array. If sum is 0, all are OFF.
    const totalLightsOn = boardState.flat().reduce((sum, val) => sum + val, 0);

    if (totalLightsOn === 0) {
        isGameOver = true;
        showModal();
    }
}

// --- UI and Game Flow ---

function showModal() {
    finalMovesText.textContent = moves;
    winModal.classList.remove('hidden');
    // Disable clicks on the grid
    gridElement.style.pointerEvents = 'none';
}

function hideModal() {
    winModal.classList.add('hidden');
    // Re-enable clicks on the grid
    gridElement.style.pointerEvents = 'auto';
}

function createGridElements() {
    gridElement.innerHTML = ''; // Clear existing grid
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement('div');
            cell.id = `c-${r}-${c}`;
            cell.classList.add('light-cell');
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            cell.addEventListener('click', handleCellClick);
            gridElement.appendChild(cell);
        }
    }
}

function updateGridUI() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.getElementById(`c-${r}-${c}`);
            const isOn = boardState[r][c] === LIGHT_ON;
            cell.classList.toggle('on', isOn);
            cell.classList.toggle('off', !isOn);
        }
    }
}

function handleCellClick(event) {
    if (isGameOver) return;

    const cell = event.currentTarget;
    const r = parseInt(cell.getAttribute('data-row'));
    const c = parseInt(cell.getAttribute('data-col'));
    
    // Perform the game logic
    toggleLight(boardState, r, c);
}

function startGame() {
    // Reset state
    isGameOver = false;
    moves = 0;
    movesCounter.textContent = 0;
    hideModal();
    
    // Initialize board
    boardState = generateSolvableBoard();
    
    // Setup UI
    createGridElements();
    updateGridUI();
}

// --- Event Listeners and Initialization ---

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);

// Buttons for starting/restarting the game
resetButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

// Allow clicking outside the modal to close it
winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
        hideModal();
    }
});