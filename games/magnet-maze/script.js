const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const hintButton = document.getElementById('hintButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const tryAgainButton = document.getElementById('tryAgainButton');
const closeHintButton = document.getElementById('closeHintButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const levelCompleteOverlay = document.getElementById('level-complete-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const hintOverlay = document.getElementById('hint-overlay');
const levelElement = document.getElementById('level');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const bestTimeElement = document.getElementById('best-time');
const magnetButtonsContainer = document.getElementById('magnet-buttons');

canvas.width = 750;
canvas.height = 600;

let gameRunning = false;
let levelComplete = false;
let gameOver = false;
let ball;
let magnets = [];
let traps = [];
let goal;
let platforms = [];
let currentLevel = 1;
let moves = 0;
let startTime = 0;
let bestTimes = {};
let gameTimer;

// Ball class
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.damping = 0.98;
        this.trail = [];
        this.maxTrailLength = 15;
    }

    update() {
        // Reset acceleration
        this.ax = 0;
        this.ay = 0.3; // gravity

        // Apply magnetic forces
        magnets.forEach(magnet => {
            if (magnet.active) {
                const dx = magnet.x - this.x;
                const dy = magnet.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    const force = magnet.getForce(distance);
                    const forceX = (dx / distance) * force;
                    const forceY = (dy / distance) * force;

                    this.ax += forceX;
                    this.ay += forceY;
                }
            }
        });

        // Update velocity
        this.vx += this.ax;
        this.vy += this.ay;

        // Apply damping
        this.vx *= this.damping;
        this.vy *= this.damping;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Add to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Platform collisions
        platforms.forEach(platform => {
            if (this.x + this.radius > platform.x &&
                this.x - this.radius < platform.x + platform.width &&
                this.y + this.radius > platform.y &&
                this.y - this.radius < platform.y + platform.height) {

                // Landing on top
                if (this.vy > 0 && this.y - this.radius < platform.y) {
                    this.y = platform.y - this.radius;
                    this.vy = 0;
                }
                // Hitting from below
                else if (this.vy < 0 && this.y + this.radius > platform.y + platform.height) {
                    this.y = platform.y + platform.height + this.radius;
                    this.vy = 0;
                }
                // Side collisions
                else if (this.vx > 0 && this.x - this.radius < platform.x) {
                    this.x = platform.x - this.radius;
                    this.vx = 0;
                } else if (this.vx < 0 && this.x + this.radius > platform.x + platform.width) {
                    this.x = platform.x + platform.width + this.radius;
                    this.vx = 0;
                }
            }
        });

        // Boundary checks
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -0.8;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -0.8;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -0.8;
        }
        if (this.y + this.radius > canvas.height) {
            gameOver = true;
            showGameOver();
        }

        // Check trap collisions
        traps.forEach(trap => {
            if (trap.containsPoint(this.x, this.y)) {
                gameOver = true;
                showGameOver();
            }
        });

        // Check goal collision
        if (goal && goal.containsPoint(this.x, this.y)) {
            levelComplete = true;
            showLevelComplete();
        }
    }

    draw() {
        // Draw trail
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 1; i < this.trail.length; i++) {
            ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();

        // Draw ball
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Magnetic field indicator
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.trail = [];
    }
}

// Magnet classes
class Magnet {
    constructor(x, y, type, strength = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.strength = strength;
        this.active = false;
        this.radius = 40;
        this.pulsePhase = 0;
    }

    getForce(distance) {
        let force = 0;

        switch (this.type) {
            case 'attract':
                force = this.strength * 200 / (distance * distance + 50);
                break;
            case 'repel':
                force = -this.strength * 200 / (distance * distance + 50);
                break;
            case 'rotate':
                // Circular force
                force = this.strength * 50 / (distance + 10);
                break;
            case 'pulse':
                this.pulsePhase += 0.1;
                const pulse = Math.sin(this.pulsePhase) > 0 ? 1 : -1;
                force = pulse * this.strength * 150 / (distance * distance + 50);
                break;
        }

        return force;
    }

    draw() {
        if (!this.active) {
            ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
            ctx.lineWidth = 2;
        } else {
            switch (this.type) {
                case 'attract':
                    ctx.strokeStyle = '#ff4444';
                    ctx.shadowColor = '#ff4444';
                    break;
                case 'repel':
                    ctx.strokeStyle = '#44ff44';
                    ctx.shadowColor = '#44ff44';
                    break;
                case 'rotate':
                    ctx.strokeStyle = '#ffff44';
                    ctx.shadowColor = '#ffff44';
                    break;
                case 'pulse':
                    ctx.strokeStyle = '#ff44ff';
                    ctx.shadowColor = '#ff44ff';
                    break;
            }
            ctx.shadowBlur = 15;
            ctx.lineWidth = 3;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw field lines
        if (this.active) {
            ctx.strokeStyle = ctx.strokeStyle;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 5;

            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const startRadius = this.radius - 5;
                const endRadius = this.radius + 15;

                ctx.beginPath();
                ctx.moveTo(
                    this.x + Math.cos(angle) * startRadius,
                    this.y + Math.sin(angle) * startRadius
                );
                ctx.lineTo(
                    this.x + Math.cos(angle) * endRadius,
                    this.y + Math.sin(angle) * endRadius
                );
                ctx.stroke();
            }
        }

        ctx.shadowBlur = 0;
    }
}

// Trap class
class Trap {
    constructor(x, y, width, height, type = 'spike') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }

    draw() {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add hazard pattern
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < this.width; i += 10) {
            for (let j = 0; j < this.height; j += 10) {
                if ((i + j) % 20 === 0) {
                    ctx.fillRect(this.x + i, this.y + j, 5, 5);
                }
            }
        }
    }
}

// Goal class
class Goal {
    constructor(x, y, radius = 25) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.pulse = 0;
    }

    containsPoint(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    draw() {
        this.pulse += 0.1;

        ctx.save();
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20 + Math.sin(this.pulse) * 10;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fill();

        // Inner circle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
}

// Level definitions
const levels = [
    // Level 1: Simple attract magnet
    {
        ballStart: { x: 100, y: 100 },
        magnets: [
            { x: 300, y: 200, type: 'attract' }
        ],
        traps: [
            { x: 200, y: 250, width: 100, height: 20 }
        ],
        goal: { x: 600, y: 500 },
        platforms: [
            { x: 0, y: 300, width: 200, height: 20 },
            { x: 400, y: 400, width: 200, height: 20 }
        ],
        hint: "Activate the red attract magnet to pull the ball toward the goal!"
    },
    // Level 2: Repel magnet
    {
        ballStart: { x: 100, y: 300 },
        magnets: [
            { x: 400, y: 300, type: 'repel' }
        ],
        traps: [
            { x: 200, y: 350, width: 150, height: 20 }
        ],
        goal: { x: 650, y: 200 },
        platforms: [
            { x: 0, y: 400, width: 300, height: 20 },
            { x: 500, y: 250, width: 200, height: 20 }
        ],
        hint: "Use the green repel magnet to push the ball around obstacles!"
    },
    // Level 3: Multiple magnets
    {
        ballStart: { x: 100, y: 200 },
        magnets: [
            { x: 250, y: 150, type: 'attract' },
            { x: 450, y: 350, type: 'repel' }
        ],
        traps: [
            { x: 300, y: 250, width: 100, height: 20 },
            { x: 500, y: 200, width: 100, height: 20 }
        ],
        goal: { x: 650, y: 450 },
        platforms: [
            { x: 0, y: 300, width: 200, height: 20 },
            { x: 400, y: 400, width: 200, height: 20 }
        ],
        hint: "Combine attract and repel magnets strategically!"
    }
];

// Initialize level
function initLevel() {
    const level = levels[currentLevel - 1];

    ball = new Ball(level.ballStart.x, level.ballStart.y);

    magnets = level.magnets.map(m => new Magnet(m.x, m.y, m.type));
    traps = level.traps.map(t => new Trap(t.x, t.y, t.width, t.height));
    goal = new Goal(level.goal.x, level.goal.y);
    platforms = level.platforms;

    moves = 0;
    startTime = Date.now();

    createMagnetButtons();
    updateUI();
}

// Create magnet control buttons
function createMagnetButtons() {
    magnetButtonsContainer.innerHTML = '';

    magnets.forEach((magnet, index) => {
        const button = document.createElement('div');
        button.className = `magnet-button ${magnet.type}`;
        button.textContent = `${magnet.type.charAt(0).toUpperCase() + magnet.type.slice(1)} ${index + 1}`;
        button.addEventListener('click', () => {
            magnet.active = !magnet.active;
            button.classList.toggle('active');
            moves++;
            updateUI();
        });
        magnetButtonsContainer.appendChild(button);
    });
}

// Update UI
function updateUI() {
    levelElement.textContent = `Level: ${currentLevel}`;
    movesElement.textContent = `Moves: ${moves}`;
    timeElement.textContent = `Time: ${(Date.now() - startTime) / 1000.0.toFixed(1)}s`;

    const bestTime = bestTimes[currentLevel] || '--';
    bestTimeElement.textContent = `Best: ${bestTime}`;
}

// Show level complete
function showLevelComplete() {
    gameRunning = false;
    clearInterval(gameTimer);

    const time = (Date.now() - startTime) / 1000;
    const score = Math.max(0, Math.floor(1000 - moves * 10 - time * 5));

    // Check for new best time
    if (!bestTimes[currentLevel] || time < bestTimes[currentLevel]) {
        bestTimes[currentLevel] = time;
        document.getElementById('new-record').style.display = 'block';
    } else {
        document.getElementById('new-record').style.display = 'none';
    }

    document.getElementById('level-stats').textContent = `Moves: ${moves} | Time: ${time.toFixed(1)}s`;
    document.getElementById('level-score').textContent = `Score: ${score}`;

    levelCompleteOverlay.style.display = 'flex';
}

// Show game over
function showGameOver() {
    gameRunning = false;
    clearInterval(gameTimer);
    gameOverOverlay.style.display = 'flex';
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = '#666666';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw traps
    traps.forEach(trap => {
        trap.draw();
    });

    // Draw magnets
    magnets.forEach(magnet => {
        magnet.draw();
    });

    // Draw goal
    if (goal) goal.draw();

    // Draw ball
    if (ball) ball.draw();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    ball.update();
    draw();

    requestAnimationFrame(gameLoop);
}

// Event listeners
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    gameRunning = true;
    initLevel();
    gameLoop();
});

resetButton.addEventListener('click', () => {
    if (ball) {
        ball.reset(levels[currentLevel - 1].ballStart.x, levels[currentLevel - 1].ballStart.y);
        moves++;
        updateUI();
    }
});

hintButton.addEventListener('click', () => {
    const level = levels[currentLevel - 1];
    document.getElementById('hint-text').textContent = level.hint;
    hintOverlay.style.display = 'flex';
});

closeHintButton.addEventListener('click', () => {
    hintOverlay.style.display = 'none';
});

nextLevelButton.addEventListener('click', () => {
    levelComplete = false;
    levelCompleteOverlay.style.display = 'none';
    currentLevel = Math.min(currentLevel + 1, levels.length);
    initLevel();
    gameRunning = true;
    gameLoop();
});

tryAgainButton.addEventListener('click', () => {
    gameOver = false;
    gameOverOverlay.style.display = 'none';
    initLevel();
    gameRunning = true;
    gameLoop();
});

// Initialize
updateUI();