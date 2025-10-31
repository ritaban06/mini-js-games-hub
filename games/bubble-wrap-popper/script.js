const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const levelCompleteOverlay = document.getElementById('level-complete-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const levelTitleElement = document.getElementById('level-title');
const levelDescriptionElement = document.getElementById('level-description');

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let levelComplete = false;
let gameOver = false;
let bubbles = [];
let currentLevel = 1;
let score = 0;
let levelScore = 0;
let timeLeft = 30.0;
let levelStartTime = 0;
let totalClicks = 0;
let successfulClicks = 0;
let gameTimer;

const levelTypes = [
    { name: 'Grid', description: 'Simple grid of bubbles', generator: generateGrid },
    { name: 'Spiral', description: 'Bubbles in a spiral pattern', generator: generateSpiral },
    { name: 'Heart', description: 'Heart-shaped arrangement', generator: generateHeart },
    { name: 'Random', description: 'Chaotic bubble placement', generator: generateRandom },
    { name: 'Wave', description: 'Sine wave pattern', generator: generateWave },
    { name: 'Circle', description: 'Concentric circles', generator: generateCircle },
    { name: 'Lightning', description: 'Zigzag lightning bolt', generator: generateLightning },
    { name: 'Star', description: 'Star-shaped formation', generator: generateStar }
];

// Bubble class
class Bubble {
    constructor(x, y, radius = 20) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.popped = false;
        this.popTime = 0;
        this.glowPhase = Math.random() * Math.PI * 2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
            '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#e17055'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.glowPhase += 0.05;
    }

    draw() {
        if (this.popped) return;

        ctx.save();

        // Bubble shadow/glow
        const glowIntensity = 0.3 + Math.sin(this.glowPhase) * 0.2;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8 * glowIntensity;

        // Main bubble
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bubble highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Bubble border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    pop() {
        if (this.popped) return false;

        this.popped = true;
        this.popTime = Date.now();

        // Create pop effect
        createPopEffect(this.x, this.y, this.color);

        return true;
    }

    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

// Pop effect particles
class PopParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.life = 1.0;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life -= 0.02;
        this.size *= 0.98;
    }

    draw() {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let popParticles = [];

// Level generators
function generateGrid() {
    const cols = 8;
    const rows = 6;
    const spacing = 80;
    const startX = (canvas.width - (cols - 1) * spacing) / 2;
    const startY = (canvas.height - (rows - 1) * spacing) / 2;

    bubbles = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = startX + col * spacing;
            const y = startY + row * spacing;
            bubbles.push(new Bubble(x, y));
        }
    }
}

function generateSpiral() {
    bubbles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const turns = 3;
    const pointsPerTurn = 12;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 40;

    for (let i = 0; i < turns * pointsPerTurn; i++) {
        const angle = (i / pointsPerTurn) * Math.PI * 2;
        const radius = (i / (turns * pointsPerTurn)) * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        bubbles.push(new Bubble(x, y));
    }
}

function generateHeart() {
    bubbles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 80;

    for (let t = 0; t < Math.PI * 2; t += 0.1) {
        const x = centerX + scale * (16 * Math.sin(t) * Math.sin(t) * Math.sin(t));
        const y = centerY - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        bubbles.push(new Bubble(x, y, 15));
    }
}

function generateRandom() {
    bubbles = [];
    const count = 25 + currentLevel * 5;

    for (let i = 0; i < count; i++) {
        const x = 50 + Math.random() * (canvas.width - 100);
        const y = 50 + Math.random() * (canvas.height - 100);
        bubbles.push(new Bubble(x, y, 15 + Math.random() * 10));
    }
}

function generateWave() {
    bubbles = [];
    const amplitude = 60;
    const frequency = 0.02;
    const points = 20;

    for (let i = 0; i < points; i++) {
        const x = 50 + (i / (points - 1)) * (canvas.width - 100);
        const y = canvas.height / 2 + Math.sin(i * frequency) * amplitude;
        bubbles.push(new Bubble(x, y));
    }
}

function generateCircle() {
    bubbles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rings = 4;
    const pointsPerRing = 8;

    for (let ring = 1; ring <= rings; ring++) {
        const radius = ring * 60;
        for (let i = 0; i < pointsPerRing; i++) {
            const angle = (i / pointsPerRing) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            bubbles.push(new Bubble(x, y, 25 - ring * 3));
        }
    }
}

function generateLightning() {
    bubbles = [];
    let x = 100;
    let y = 100;
    const segments = 15;

    for (let i = 0; i < segments; i++) {
        bubbles.push(new Bubble(x, y));
        x += 40 + Math.random() * 20;
        y += (Math.random() - 0.5) * 80;

        // Keep within bounds
        if (y < 50) y = 50;
        if (y > canvas.height - 50) y = canvas.height - 50;
    }
}

function generateStar() {
    bubbles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 100;
    const innerRadius = 40;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        bubbles.push(new Bubble(x, y));
    }
}

// Initialize level
function initLevel() {
    const levelType = levelTypes[(currentLevel - 1) % levelTypes.length];
    levelType.generator();

    levelStartTime = Date.now();
    timeLeft = 30.0;
    levelScore = 0;
    totalClicks = 0;
    successfulClicks = 0;
    popParticles = [];

    levelTitleElement.textContent = `Level ${currentLevel}: ${levelType.name}`;
    levelDescriptionElement.textContent = levelType.description;

    updateUI();
}

// Create pop effect
function createPopEffect(x, y, color) {
    for (let i = 0; i < 8; i++) {
        popParticles.push(new PopParticle(x, y, color));
    }
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${currentLevel}`;
    timerElement.textContent = `Time: ${timeLeft.toFixed(1)}s`;

    const accuracy = totalClicks > 0 ? Math.round((successfulClicks / totalClicks) * 100) : 100;
    accuracyElement.textContent = `Accuracy: ${accuracy}%`;
}

// Check level complete
function checkLevelComplete() {
    const allPopped = bubbles.every(bubble => bubble.popped);
    if (allPopped && !levelComplete) {
        levelComplete = true;
        clearInterval(gameTimer);

        const timeTaken = (Date.now() - levelStartTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((30 - timeTaken) * 10));
        const accuracy = totalClicks > 0 ? successfulClicks / totalClicks : 1;
        const accuracyBonus = Math.floor(accuracy * 500);
        levelScore = bubbles.length * 50 + timeBonus + accuracyBonus;

        score += levelScore;

        document.getElementById('level-score').textContent = `Level Score: ${levelScore}`;
        document.getElementById('time-bonus').textContent = `Time Bonus: +${timeBonus}`;
        document.getElementById('accuracy-bonus').textContent = `Accuracy Bonus: +${accuracyBonus}`;
        document.getElementById('total-score').textContent = `Total Score: ${score}`;

        levelCompleteOverlay.style.display = 'flex';
    }
}

// Game timer
function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(gameTimer);
            gameOver = true;
            showGameOver();
        }
        updateUI();
    }, 100);
}

// Show game over
function showGameOver() {
    gameRunning = false;
    gameOverOverlay.style.display = 'flex';
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
    document.getElementById('final-level').textContent = `Reached Level: ${currentLevel}`;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bubbles
    bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw();
    });

    // Draw pop particles
    popParticles = popParticles.filter(particle => {
        particle.update();
        particle.draw();
        return particle.life > 0;
    });

    // Draw level progress indicator
    const poppedCount = bubbles.filter(b => b.popped).length;
    const progress = poppedCount / bubbles.length;
    const progressBarWidth = 200;
    const progressBarHeight = 10;
    const progressBarX = canvas.width - progressBarWidth - 20;
    const progressBarY = 20;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    draw();
    checkLevelComplete();

    requestAnimationFrame(gameLoop);
}

// Event listeners
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    gameRunning = true;
    initLevel();
    startTimer();
    gameLoop();
});

restartButton.addEventListener('click', () => {
    gameOver = false;
    gameOverOverlay.style.display = 'none';
    currentLevel = 1;
    score = 0;
    initLevel();
    gameRunning = true;
    startTimer();
    gameLoop();
});

nextLevelButton.addEventListener('click', () => {
    levelComplete = false;
    levelCompleteOverlay.style.display = 'none';
    currentLevel++;
    initLevel();
    gameRunning = true;
    startTimer();
    gameLoop();
});

// Mouse click handling
canvas.addEventListener('click', (e) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    totalClicks++;

    let hitBubble = false;
    bubbles.forEach(bubble => {
        if (bubble.containsPoint(x, y) && !bubble.popped) {
            bubble.pop();
            successfulClicks++;
            hitBubble = true;
        }
    });

    if (!hitBubble) {
        // Missed click - small penalty
        score = Math.max(0, score - 5);
    }

    updateUI();
});

// Initialize
updateUI();