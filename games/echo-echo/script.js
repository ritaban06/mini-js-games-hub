const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const sequenceElement = document.getElementById('sequence');
const clickIndicator = document.getElementById('click-indicator');

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let gameState = 'waiting'; // waiting, showing, repeating, checking
let score = 0;
let level = 1;
let sequence = [];
let playerSequence = [];
let sequenceIndex = 0;
let playerIndex = 0;
let echoes = [];
let audioContext;

// Colors for different echo types
const echoColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'];

// Echo class
class Echo {
    constructor(x, y, color, startTime) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.startTime = startTime;
        this.radius = 0;
        this.maxRadius = 100;
        this.duration = 1000; // 1 second
        this.active = true;
    }

    update(currentTime) {
        const elapsed = currentTime - this.startTime;
        const progress = elapsed / this.duration;

        if (progress >= 1) {
            this.active = false;
            return;
        }

        this.radius = this.maxRadius * progress;
    }

    draw() {
        if (!this.active) return;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize audio context
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
}

// Play sound for echo
function playEchoSound(frequency, duration = 0.3) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Generate sequence
function generateSequence() {
    sequence = [];
    const length = Math.min(3 + level, 8); // Max 8 echoes

    for (let i = 0; i < length; i++) {
        const x = Math.random() * (canvas.width - 200) + 100;
        const y = Math.random() * (canvas.height - 200) + 100;
        const colorIndex = Math.floor(Math.random() * echoColors.length);
        sequence.push({ x, y, colorIndex, delay: i * 800 }); // 800ms between echoes
    }
}

// Show sequence
function showSequence() {
    gameState = 'showing';
    sequenceIndex = 0;
    echoes = [];
    playerSequence = [];

    const startTime = Date.now();

    function showNextEcho() {
        if (sequenceIndex >= sequence.length) {
            setTimeout(() => {
                gameState = 'repeating';
                showClickIndicator();
            }, 500);
            return;
        }

        const echoData = sequence[sequenceIndex];
        const echoTime = startTime + echoData.delay;

        if (Date.now() >= echoTime) {
            const echo = new Echo(echoData.x, echoData.y, echoColors[echoData.colorIndex], Date.now());
            echoes.push(echo);

            // Play sound
            const frequency = 220 + (echoData.colorIndex * 50); // Different frequencies for different colors
            playEchoSound(frequency);

            sequenceIndex++;
        }

        if (gameState === 'showing') {
            requestAnimationFrame(showNextEcho);
        }
    }

    showNextEcho();
}

// Show click indicator
function showClickIndicator() {
    clickIndicator.style.opacity = '1';
    setTimeout(() => {
        clickIndicator.style.opacity = '0';
    }, 1000);
}

// Handle player click
function handleClick(x, y) {
    if (gameState !== 'repeating') return;

    const clickTime = Date.now();
    playerSequence.push({ x, y, time: clickTime });

    // Create visual echo for player click
    const echo = new Echo(x, y, '#ffffff', clickTime);
    echoes.push(echo);

    // Play click sound
    playEchoSound(440, 0.1);

    playerIndex++;

    if (playerIndex >= sequence.length) {
        checkSequence();
    }
}

// Check player sequence
function checkSequence() {
    gameState = 'checking';
    let correctClicks = 0;

    for (let i = 0; i < Math.min(sequence.length, playerSequence.length); i++) {
        const seqEcho = sequence[i];
        const playerEcho = playerSequence[i];

        // Check if click was near the echo position (within 50px)
        const distance = Math.sqrt((seqEcho.x - playerEcho.x) ** 2 + (seqEcho.y - playerEcho.y) ** 2);
        if (distance < 50) {
            correctClicks++;
        }
    }

    const accuracy = correctClicks / sequence.length;

    if (accuracy >= 0.8) { // 80% accuracy required
        score += Math.floor(accuracy * 100) + level * 10;
        level++;
        updateUI();
        setTimeout(() => {
            startRound();
        }, 2000);
    } else {
        gameOver();
    }
}

// Start round
function startRound() {
    generateSequence();
    updateUI();
    setTimeout(() => {
        showSequence();
    }, 1000);
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`Game Over! Final Score: ${score}, Level: ${level}`);
    resetGame();
}

// Reset game
function resetGame() {
    score = 0;
    level = 1;
    sequence = [];
    playerSequence = [];
    echoes = [];
    updateUI();
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${level}`;
    sequenceElement.textContent = `Sequence: ${playerIndex}/${sequence.length}`;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw echoes
    const currentTime = Date.now();
    echoes = echoes.filter(echo => {
        echo.update(currentTime);
        echo.draw();
        return echo.active;
    });

    // Draw sequence indicators
    if (gameState === 'showing') {
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Watch the sequence...', canvas.width / 2, 50);
    } else if (gameState === 'repeating') {
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Repeat the sequence!', canvas.width / 2, 50);
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    initAudio();
    resetGame();
    gameRunning = true;
    gameLoop();
    startRound();
});

canvas.addEventListener('click', (e) => {
    if (!gameRunning || gameState !== 'repeating') return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleClick(x, y);
});

// Initialize
updateUI();