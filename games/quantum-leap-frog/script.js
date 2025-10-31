const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let score = 0;
let lives = 3;
let frog;
let lilyPads = [];
let cameraX = 0;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const PAD_WIDTH = 80;
const PAD_HEIGHT = 20;
const FROG_SIZE = 30;

// Frog class
class Frog {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.width = FROG_SIZE;
        this.height = FROG_SIZE;
    }

    update() {
        // Apply gravity
        if (!this.onGround) {
            this.vy += GRAVITY;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Check ground collision
        this.onGround = false;
        for (let pad of lilyPads) {
            if (this.x < pad.x + PAD_WIDTH &&
                this.x + this.width > pad.x &&
                this.y + this.height >= pad.y &&
                this.y + this.height <= pad.y + PAD_HEIGHT + 10 &&
                this.vy >= 0) {
                this.y = pad.y - this.height;
                this.vy = 0;
                this.onGround = true;
                // Quantum teleport chance
                if (Math.random() < 0.1) { // 10% chance
                    this.quantumTeleport();
                }
                break;
            }
        }

        // Check if fell in water
        if (this.y > canvas.height) {
            this.resetPosition();
            lives--;
            updateUI();
            if (lives <= 0) {
                gameOver();
            }
        }

        // Keep frog in bounds horizontally
        if (this.x < cameraX) this.x = cameraX;
    }

    jump() {
        if (this.onGround) {
            this.vy = JUMP_FORCE;
            this.onGround = false;
        }
    }

    moveLeft() {
        this.vx = -MOVE_SPEED;
    }

    moveRight() {
        this.vx = MOVE_SPEED;
    }

    stopMove() {
        this.vx = 0;
    }

    quantumTeleport() {
        if (lilyPads.length > 1) {
            let randomPad = lilyPads[Math.floor(Math.random() * lilyPads.length)];
            this.x = randomPad.x + PAD_WIDTH / 2 - this.width / 2;
            this.y = randomPad.y - this.height;
            this.vy = 0;
        }
    }

    resetPosition() {
        this.x = 100;
        this.y = canvas.height - 200;
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        // Simple frog face
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - cameraX + 8, this.y + 8, 4, 4);
        ctx.fillRect(this.x - cameraX + 18, this.y + 8, 4, 4);
    }
}

// Generate lily pads
function generateLilyPads() {
    lilyPads = [];
    for (let i = 0; i < 20; i++) {
        let x = 100 + i * 150 + Math.random() * 100;
        let y = canvas.height - 100 - Math.random() * 200;
        lilyPads.push({x, y});
    }
}

// Draw lily pads
function drawLilyPads() {
    ctx.fillStyle = '#228B22';
    for (let pad of lilyPads) {
        ctx.fillRect(pad.x - cameraX, pad.y, PAD_WIDTH, PAD_HEIGHT);
    }
}

// Draw water
function drawWater() {
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

// Update camera
function updateCamera() {
    cameraX = frog.x - canvas.width / 3;
    if (cameraX < 0) cameraX = 0;
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Score: ${Math.floor(score)}`;
    livesElement.textContent = `Lives: ${lives}`;
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`Game Over! Final Score: ${Math.floor(score)}`);
    resetGame();
}

// Reset game
function resetGame() {
    score = 0;
    lives = 3;
    frog.resetPosition();
    generateLilyPads();
    cameraX = 0;
    updateUI();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWater();
    drawLilyPads();
    frog.update();
    frog.draw();
    updateCamera();

    score += 0.1; // Score increases over time
    updateUI();

    requestAnimationFrame(gameLoop);
}

// Event listeners
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    resetGame();
    gameRunning = true;
    gameLoop();
});

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.code) {
        case 'Space':
        case 'ArrowUp':
            e.preventDefault();
            frog.jump();
            break;
        case 'ArrowLeft':
            frog.moveLeft();
            break;
        case 'ArrowRight':
            frog.moveRight();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (!gameRunning) return;
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        frog.stopMove();
    }
});

// Initialize
frog = new Frog(100, canvas.height - 200);
generateLilyPads();
updateUI();