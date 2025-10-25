// --- Tone.js Setup (Synthesizer and Notes) ---
const synth = new Tone.Synth().toDestination();
// Map quadrant IDs to their corresponding flash classes and notes (pitches)
const QUADRANTS = {
    'green': { note: 'E4', flashClass: 'flash-green' },
    'red': { note: 'G#4', flashClass: 'flash-red' },
    'yellow': { note: 'C#5', flashClass: 'flash-yellow' },
    'blue': { note: 'E5', flashClass: 'flash-blue' }
};
const colors = ['green', 'red', 'yellow', 'blue'];

// --- Game State ---
let sequence = []; // The sequence the player must follow
let playerInput = []; // The sequence the player is currently entering
let score = 0;
let isGameRunning = false;
let isPlayerTurn = false;
const SEQUENCE_DELAY = 600; // Time in ms between flashes
const FLASH_DURATION = 300; // Time in ms a light stays lit

// --- DOM Elements ---
const scoreValue = document.getElementById('score-value');
const startButton = document.getElementById('start-button');
const messageDisplay = document.getElementById('message');
const quadrantElements = document.querySelectorAll('.quadrant');


// --- Game Flow Functions ---

/**
 * Initializes the game state and starts the first round.
 */
function startGame() {
    // Tone.js requires a user interaction to start the audio context
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    
    isGameRunning = true;
    isPlayerTurn = false;
    score = 0;
    sequence = [];
    playerInput = [];
    scoreValue.textContent = score;
    startButton.disabled = true;
    messageDisplay.textContent = 'Watch the sequence...';
    
    // Attach click handlers only when game starts
    quadrantElements.forEach(q => q.addEventListener('click', handlePlayerClick));
    
    nextRound();
}

/**
 * Adds a new random step to the sequence and starts showing it.
 */
function nextRound() {
    score++;
    scoreValue.textContent = score;
    
    // Add one random color to the sequence
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    
    playerInput = [];
    isPlayerTurn = false;
    messageDisplay.textContent = `Level ${score}: Watch!`;
    
    // Delay before showing sequence begins
    setTimeout(showSequence, SEQUENCE_DELAY);
}

/**
 * Iterates through the sequence, flashing lights and playing sounds.
 */
function showSequence() {
    let i = 0;
    const intervalId = setInterval(() => {
        if (i < sequence.length) {
            const color = sequence[i];
            flashQuadrant(color);
            i++;
        } else {
            clearInterval(intervalId);
            startPlayerTurn();
        }
    }, SEQUENCE_DELAY);
}

/**
 * Sets the game state to receive player input.
 */
function startPlayerTurn() {
    isPlayerTurn = true;
    messageDisplay.textContent = 'Your turn! Repeat the sequence.';
}


// --- Interaction Functions ---

/**
 * Visually flashes a quadrant and plays its corresponding tone.
 * @param {string} color - The ID of the quadrant (e.g., 'green').
 */
function flashQuadrant(color) {
    const element = document.getElementById(color);
    const { note, flashClass } = QUADRANTS[color];

    // 1. Play Sound
    synth.triggerAttackRelease(note, "8n");

    // 2. Flash Visual
    element.classList.add(flashClass);
    setTimeout(() => {
        element.classList.remove(flashClass);
    }, FLASH_DURATION);
}

/**
 * Handles a click event from the player on one of the quadrants.
 * @param {Event} event 
 */
function handlePlayerClick(event) {
    if (!isGameRunning || !isPlayerTurn) {
        return;
    }

    const clickedColor = event.currentTarget.id;
    playerInput.push(clickedColor);

    // Provide immediate feedback
    flashQuadrant(clickedColor);

    // Check if the input is correct so far
    const inputIndex = playerInput.length - 1;
    if (playerInput[inputIndex] === sequence[inputIndex]) {
        // Correct input
        
        // Check if the sequence is complete
        if (playerInput.length === sequence.length) {
            isPlayerTurn = false;
            messageDisplay.textContent = 'Success! Moving to the next round...';
            
            // Advance to the next round
            setTimeout(nextRound, SEQUENCE_DELAY * 1.5);
        }
    } else {
        // Incorrect input
        gameOver();
    }
}

/**
 * Ends the game and displays the final score.
 */
function gameOver() {
    isGameRunning = false;
    isPlayerTurn = false;
    
    // Play a failure tone (low frequency, short duration)
    synth.triggerAttackRelease("F2", "2n");
    
    messageDisplay.textContent = `Game Over! Final Score: ${score - 1}`;
    startButton.textContent = "PLAY AGAIN";
    startButton.disabled = false;
    
    // Remove click handlers
    quadrantElements.forEach(q => q.removeEventListener('click', handlePlayerClick));
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Set initial message
    messageDisplay.textContent = 'Click START to begin!';
    
    // Add start button handler
    startButton.addEventListener('click', startGame);
});
