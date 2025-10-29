// 4. Game Logic (script.js)

// --- Setup & DOM Elements ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const scoreDisplay = document.getElementById('score-display');

const startModal = document.getElementById('start-modal');
const gameOverModal = document.getElementById('game-over-modal');

const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreEl = document.getElementById('final-score');

const gameWrapper = document.getElementById('game-wrapper');

let gameRunning = false;
let score = 0;
let projectiles = [];
let bubbles = [];
let player = {};
let bubbleSpawnInterval;
let animationFrameId;

// --- Game Classes ---
class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 10;
    }

    draw() {
        ctx.fillStyle = this.color;
        // Simple triangle shape
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }

    update(direction) {
        if (direction === 'left') {
            this.x -= this.speed;
        }
        if (direction === 'right') {
            this.x += this.speed;
        }

        // Keep player within canvas bounds
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
        }
        if (this.x + this.width / 2 > canvas.width) {
            this.x = canvas.width - this.width / 2;
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.y += this.velocity.y;
    }
}

class Bubble {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    update() {
        this.draw();
        this.y += this.velocity.y;
    }
}

// --- Game Functions ---

function init() {
    // Set canvas size based on wrapper
    const wrapperWidth = gameWrapper.clientWidth;
    // Set a 4:3 aspect ratio, common for arcade games
    canvas.width = wrapperWidth;
    canvas.height = (wrapperWidth / 3) * 4;

    score = 0;
    projectiles = [];
    bubbles = [];
    gameRunning = true;

    const playerX = canvas.width / 2;
    const playerY = canvas.height - 50;
    player = new Player(playerX, playerY, 30, 30, 'white');

    scoreEl.innerText = score;
    scoreDisplay.classList.remove('hidden');
    startModal.classList.add('hidden');
    gameOverModal.classList.add('hidden');

    // Start spawning bubbles
    spawnBubbles();
    
    // Start game loop
    animate();
}

function spawnBubbles() {
    if (bubbleSpawnInterval) clearInterval(bubbleSpawnInterval);
    
    bubbleSpawnInterval = setInterval(() => {
        if (!gameRunning) return;

        const radius = Math.random() * (30 - 15) + 15; // 15 to 30
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = -radius;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const velocity = { y: Math.random() * 1 + 0.5 }; // Speed

        bubbles.push(new Bubble(x, y, radius, color, velocity));
    }, 1000); // Spawn a new bubble every second
}

function shoot() {
    projectiles.push(new Projectile(
        player.x,
        player.y,
        5,
        '#81E6D9', // Teal color
        { y: -10 }
    ));
}

function gameOver() {
    gameRunning = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (bubbleSpawnInterval) clearInterval(bubbleSpawnInterval);
    
    finalScoreEl.innerText = score;
    gameOverModal.classList.remove('hidden');
    scoreDisplay.classList.add('hidden');
}

// --- Game Loop ---
function animate() {
    if (!gameRunning) return;

    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    player.draw();

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.update();

        // Remove projectiles that go off-screen
        if (p.y + p.radius < 0) {
            projectiles.splice(i, 1);
        }
    }

    // Update bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.update();
        
        // Check for game over (bubble reaches bottom)
        if (b.y - b.radius > canvas.height) {
            gameOver();
        }

        // Check for collision: projectile hits bubble
        for (let j = projectiles.length - 1; j >= 0; j--) {
            const p = projectiles[j];
            const dist = Math.hypot(p.x - b.x, p.y - b.y);

            if (dist - b.radius - p.radius < 1) {
                // Collision!
                score += 10;
                scoreEl.innerText = score;

                // Remove bubble and projectile
                bubbles.splice(i, 1);
                projectiles.splice(j, 1);
                break; // Exit inner loop
            }
        }
    }
}

// --- Event Listeners ---

// Keyboard controls
const keys = {
    left: false,
    right: false
};

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === ' ') shoot();
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

// Player movement based on key state
function handlePlayerMovement() {
    if (keys.left) player.update('left');
    if (keys.right) player.update('right');
    requestAnimationFrame(handlePlayerMovement);
}
handlePlayerMovement(); // Start checking for key presses

// Touch controls
let touchX = null;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchX = e.touches[0].clientX;
    shoot(); // Shoot on tap
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (touchX) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        player.x = touch.clientX - rect.left;
        
        // Keep player within bounds
        if (player.x - player.width / 2 < 0) player.x = player.width / 2;
        if (player.x + player.width / 2 > canvas.width) player.x = canvas.width - player.width / 2;
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchX = null;
}, { passive: false });

// UI Buttons
startButton.addEventListener('click', init);
restartButton.addEventListener('click', init);

// Handle window resize
window.addEventListener('resize', () => {
    if (!gameRunning) {
        // Adjust canvas size if game is not running
        const wrapperWidth = gameWrapper.clientWidth;
        canvas.width = wrapperWidth;
        canvas.height = (wrapperWidth / 3) * 4;
    }
    // In a real game, you might want to pause and rescale all elements
});

// Initial render of canvas size
const wrapperWidth = gameWrapper.clientWidth;
canvas.width = wrapperWidth;
canvas.height = (wrapperWidth / 3) * 4;