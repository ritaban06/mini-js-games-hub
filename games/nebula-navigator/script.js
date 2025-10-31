const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const energyElement = document.getElementById('energy');

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let score = 0;
let lives = 3;
let energy = 100;
let ship;
let particles = [];
let energyOrbs = [];
let debris = [];
let blackHoles = [];
const SHIP_SIZE = 20;
const PARTICLE_COUNT = 100;
const ORB_SIZE = 10;
const DEBRIS_SIZE = 15;
const BLACK_HOLE_SIZE = 30;

// Ship class
class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
    }

    update() {
        // Friction
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Keep in bounds
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Black hole attraction
        blackHoles.forEach(bh => {
            const dx = bh.x - this.x;
            const dy = bh.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const force = (100 - dist) / 1000;
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }
        });
    }

    moveUp() {
        this.vy -= 0.5;
    }

    moveDown() {
        this.vy += 0.5;
    }

    moveLeft() {
        this.vx -= 0.5;
    }

    moveRight() {
        this.vx += 0.5;
    }

    boost() {
        if (energy > 0) {
            this.vx += Math.cos(this.angle) * 2;
            this.vy += Math.sin(this.angle) * 2;
            energy -= 1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(SHIP_SIZE, 0);
        ctx.lineTo(-SHIP_SIZE/2, -SHIP_SIZE/2);
        ctx.lineTo(-SHIP_SIZE/2, SHIP_SIZE/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Particle class for nebulae
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Energy Orb class
class EnergyOrb {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, ORB_SIZE, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Debris class
class Debris {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -DEBRIS_SIZE) this.x = canvas.width + DEBRIS_SIZE;
        if (this.x > canvas.width + DEBRIS_SIZE) this.x = -DEBRIS_SIZE;
        if (this.y < -DEBRIS_SIZE) this.y = canvas.height + DEBRIS_SIZE;
        if (this.y > canvas.height + DEBRIS_SIZE) this.y = -DEBRIS_SIZE;
    }

    draw() {
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x - DEBRIS_SIZE/2, this.y - DEBRIS_SIZE/2, DEBRIS_SIZE, DEBRIS_SIZE);
    }
}

// Black Hole class
class BlackHole {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -BLACK_HOLE_SIZE) this.x = canvas.width + BLACK_HOLE_SIZE;
        if (this.x > canvas.width + BLACK_HOLE_SIZE) this.x = -BLACK_HOLE_SIZE;
        if (this.y < -BLACK_HOLE_SIZE) this.y = canvas.height + BLACK_HOLE_SIZE;
        if (this.y > canvas.height + BLACK_HOLE_SIZE) this.y = -BLACK_HOLE_SIZE;
    }

    draw() {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, BLACK_HOLE_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Initialize game objects
function initGame() {
    ship = new Ship(canvas.width / 2, canvas.height / 2);
    particles = [];
    energyOrbs = [];
    debris = [];
    blackHoles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    for (let i = 0; i < 5; i++) {
        energyOrbs.push(new EnergyOrb());
        debris.push(new Debris());
    }

    for (let i = 0; i < 2; i++) {
        blackHoles.push(new BlackHole());
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    ship.update();

    particles.forEach(p => p.update());
    energyOrbs.forEach(o => o.update());
    debris.forEach(d => d.update());
    blackHoles.forEach(b => b.update());

    // Check collisions
    checkCollisions();

    // Regenerate energy slowly
    energy = Math.min(energy + 0.1, 100);

    updateUI();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.forEach(p => p.draw());

    // Draw game objects
    energyOrbs.forEach(o => o.draw());
    debris.forEach(d => d.draw());
    blackHoles.forEach(b => b.draw());
    ship.draw();
}

// Check collisions
function checkCollisions() {
    // Ship with energy orbs
    energyOrbs.forEach((orb, index) => {
        const dx = ship.x - orb.x;
        const dy = ship.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SHIP_SIZE + ORB_SIZE) {
            energyOrbs.splice(index, 1);
            score += 10;
            energy = Math.min(energy + 20, 100);
            energyOrbs.push(new EnergyOrb()); // Spawn new orb
        }
    });

    // Ship with debris
    debris.forEach(deb => {
        const dx = ship.x - deb.x;
        const dy = ship.y - deb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SHIP_SIZE + DEBRIS_SIZE) {
            lives--;
            if (lives <= 0) {
                gameOver();
            } else {
                ship.x = canvas.width / 2;
                ship.y = canvas.height / 2;
                ship.vx = 0;
                ship.vy = 0;
            }
        }
    });

    // Ship with black holes
    blackHoles.forEach(bh => {
        const dx = ship.x - bh.x;
        const dy = ship.y - bh.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < BLACK_HOLE_SIZE) {
            lives = 0;
            gameOver();
        }
    });
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    energyElement.textContent = `Energy: ${Math.floor(energy)}`;
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`Game Over! Final Score: ${score}`);
    resetGame();
}

// Reset game
function resetGame() {
    score = 0;
    lives = 3;
    energy = 100;
    initGame();
    updateUI();
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
        case 'ArrowUp':
            ship.moveUp();
            break;
        case 'ArrowDown':
            ship.moveDown();
            break;
        case 'ArrowLeft':
            ship.moveLeft();
            break;
        case 'ArrowRight':
            ship.moveRight();
            break;
        case 'Space':
            e.preventDefault();
            ship.boost();
            break;
    }
});

// Initialize
initGame();
updateUI();