const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const nextEraButton = document.getElementById('nextEraButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const levelCompleteOverlay = document.getElementById('level-complete-overlay');
const eraDisplay = document.getElementById('era-display');
const artifactsDisplay = document.getElementById('artifacts-collected');
const timeEnergyDisplay = document.getElementById('time-energy');
const scoreDisplay = document.getElementById('score');
const powerBar = document.getElementById('power-bar');

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let gameOver = false;
let levelComplete = false;
let player;
let platforms = [];
let artifacts = [];
let paradoxes = [];
let timePortal;
let keys = {};
let mouseDown = false;
let timeJumpCharge = 0;
let maxTimeJumpCharge = 100;
let currentEra = 0;
let score = 0;
let timeEnergy = 100;

const eras = [
    {
        name: 'Prehistoric',
        bgClass: 'prehistoric',
        artifacts: 5,
        description: 'Dinosaurs and ancient artifacts'
    },
    {
        name: 'Ancient Egypt',
        bgClass: 'ancient-egypt',
        artifacts: 6,
        description: 'Pyramids and hieroglyphs'
    },
    {
        name: 'Medieval',
        bgClass: 'medieval',
        artifacts: 7,
        description: 'Castles and knights'
    },
    {
        name: 'Industrial Revolution',
        bgClass: 'industrial',
        artifacts: 8,
        description: 'Factories and steam engines'
    },
    {
        name: 'Future',
        bgClass: 'future',
        artifacts: 10,
        description: 'High-tech cities and robots'
    }
];

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 30;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpPower = -12;
        this.onGround = false;
        this.color = '#00ffff';
        this.glowColor = '#00ffff';
        this.timeTraveling = false;
        this.timeTravelTimer = 0;
    }

    update() {
        // Horizontal movement
        if (keys.ArrowLeft || keys.KeyA) {
            this.vx = -this.speed;
        } else if (keys.ArrowRight || keys.KeyD) {
            this.vx = this.speed;
        } else {
            this.vx *= 0.8; // Friction
        }

        // Jumping
        if ((keys.Space || keys.ArrowUp || keys.KeyW) && this.onGround) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }

        // Time travel effect
        if (this.timeTraveling) {
            this.timeTravelTimer++;
            if (this.timeTravelTimer > 30) {
                this.timeTraveling = false;
                this.timeTravelTimer = 0;
            }
        }

        // Apply gravity
        this.vy += 0.5;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision
        if (this.y + this.height >= canvas.height - 50) {
            this.y = canvas.height - 50 - this.height;
            this.vy = 0;
            this.onGround = true;
        }

        // Platform collisions
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height > platform.y) {

                // Landing on top of platform
                if (this.vy > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                }
                // Hitting platform from below
                else if (this.vy < 0 && this.y > platform.y) {
                    this.y = platform.y + platform.height;
                    this.vy = 0;
                }
                // Side collisions
                else if (this.vx > 0 && this.x < platform.x) {
                    this.x = platform.x - this.width;
                    this.vx = 0;
                } else if (this.vx < 0 && this.x > platform.x) {
                    this.x = platform.x + platform.width;
                    this.vx = 0;
                }
            }
        });

        // Keep player in bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        // Check artifact collection
        artifacts.forEach((artifact, index) => {
            if (!artifact.collected &&
                this.x < artifact.x + artifact.width &&
                this.x + this.width > artifact.x &&
                this.y < artifact.y + artifact.height &&
                this.y + this.height > artifact.y) {
                artifact.collected = true;
                score += 100;
                updateUI();
            }
        });

        // Check paradox collision
        paradoxes.forEach(paradox => {
            const dx = this.x + this.width/2 - paradox.x;
            const dy = this.y + this.height/2 - paradox.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < paradox.radius + 15) {
                gameOver = true;
                showGameOver();
            }
        });

        // Check time portal collision
        if (timePortal) {
            const dx = this.x + this.width/2 - timePortal.x;
            const dy = this.y + this.height/2 - timePortal.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < timePortal.radius + 15) {
                levelComplete = true;
                showLevelComplete();
            }
        }
    }

    draw() {
        ctx.save();

        // Time travel effect
        if (this.timeTraveling) {
            ctx.globalAlpha = 0.7 + Math.sin(this.timeTravelTimer * 0.3) * 0.3;
            ctx.shadowColor = this.glowColor;
            ctx.shadowBlur = 20;
        }

        // Draw player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw glow effect
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = this.glowColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.restore();
    }

    timeJump() {
        this.timeTraveling = true;
        this.timeTravelTimer = 0;
        timeEnergy = Math.max(0, timeEnergy - 10);
        updateUI();
    }
}

// Initialize level
function initLevel() {
    const era = eras[currentEra];

    // Set background
    canvas.className = era.bgClass;

    // Create player
    player = new Player(50, canvas.height - 100);

    // Create platforms
    platforms = [];
    const numPlatforms = 5 + currentEra;
    for (let i = 0; i < numPlatforms; i++) {
        platforms.push({
            x: Math.random() * (canvas.width - 100),
            y: 150 + i * 80 + Math.random() * 50,
            width: 80 + Math.random() * 50,
            height: 20
        });
    }

    // Create artifacts
    artifacts = [];
    for (let i = 0; i < era.artifacts; i++) {
        artifacts.push({
            x: 100 + i * 120 + Math.random() * 50,
            y: canvas.height - 120 - Math.random() * 300,
            width: 15,
            height: 15,
            collected: false,
            glow: Math.random() * Math.PI * 2
        });
    }

    // Create paradoxes
    paradoxes = [];
    const numParadoxes = 2 + currentEra;
    for (let i = 0; i < numParadoxes; i++) {
        paradoxes.push({
            x: 200 + i * 150 + Math.random() * 100,
            y: canvas.height - 100 - Math.random() * 400,
            radius: 20,
            rotation: 0
        });
    }

    // Create time portal
    timePortal = {
        x: canvas.width - 80,
        y: canvas.height - 120,
        radius: 25,
        rotation: 0
    };

    timeEnergy = 100;
    updateUI();
}

// Show game over
function showGameOver() {
    gameRunning = false;
    gameOverOverlay.style.display = 'flex';
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
}

// Show level complete
function showLevelComplete() {
    gameRunning = false;
    levelCompleteOverlay.style.display = 'flex';
    const bonus = 500 + currentEra * 100;
    score += bonus;
    document.getElementById('era-bonus').textContent = `Time Jump Bonus: +${bonus}`;
    updateUI();
}

// Next era
function nextEra() {
    currentEra = (currentEra + 1) % eras.length;
    levelComplete = false;
    levelCompleteOverlay.style.display = 'none';
    initLevel();
    gameRunning = true;
    gameLoop();
}

// Update UI
function updateUI() {
    const era = eras[currentEra];
    eraDisplay.textContent = `Era: ${era.name}`;
    artifactsDisplay.textContent = `Artifacts: ${artifacts.filter(a => a.collected).length}/${era.artifacts}`;
    timeEnergyDisplay.textContent = `Time Energy: ${timeEnergy}`;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Draw platforms
    ctx.fillStyle = '#666666';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw artifacts
    artifacts.forEach(artifact => {
        if (!artifact.collected) {
            ctx.save();
            artifact.glow += 0.1;
            const glowIntensity = 0.5 + Math.sin(artifact.glow) * 0.5;

            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 15 * glowIntensity;
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(artifact.x, artifact.y, artifact.width, artifact.height);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(artifact.x, artifact.y, artifact.width, artifact.height);
            ctx.restore();
        }
    });

    // Draw paradoxes
    paradoxes.forEach(paradox => {
        paradox.rotation += 0.1;
        ctx.save();
        ctx.translate(paradox.x, paradox.y);
        ctx.rotate(paradox.rotation);

        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(0, 0, paradox.radius, 0, Math.PI * 2);
        ctx.fill();

        // Swirling effect
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + paradox.rotation;
            const x1 = Math.cos(angle) * (paradox.radius - 5);
            const y1 = Math.sin(angle) * (paradox.radius - 5);
            const x2 = Math.cos(angle) * paradox.radius;
            const y2 = Math.sin(angle) * paradox.radius;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
        ctx.stroke();
        ctx.restore();
    });

    // Draw time portal
    if (timePortal) {
        timePortal.rotation += 0.05;
        ctx.save();
        ctx.translate(timePortal.x, timePortal.y);
        ctx.rotate(timePortal.rotation);

        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 0, timePortal.radius, 0, Math.PI * 2);
        ctx.fill();

        // Portal rings
        for (let i = 1; i <= 3; i++) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, timePortal.radius * (1 - i * 0.2), 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Draw player
    player.draw();

    // Draw time jump charge effect
    if (mouseDown && timeEnergy > 0) {
        timeJumpCharge = Math.min(timeJumpCharge + 2, maxTimeJumpCharge);
        powerBar.style.width = `${(timeJumpCharge / maxTimeJumpCharge) * 100}%`;

        // Draw charge effect around player
        ctx.save();
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2,
                30 + timeJumpCharge * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    } else {
        timeJumpCharge = 0;
        powerBar.style.width = '0%';
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    player.update();
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

restartButton.addEventListener('click', () => {
    gameOver = false;
    gameOverOverlay.style.display = 'none';
    currentEra = 0;
    score = 0;
    initLevel();
    gameRunning = true;
    gameLoop();
});

nextEraButton.addEventListener('click', nextEra);

// Keyboard events
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Mouse events for time jumping
canvas.addEventListener('mousedown', (e) => {
    if (!gameRunning || timeEnergy <= 0) return;
    mouseDown = true;
});

canvas.addEventListener('mouseup', (e) => {
    if (!gameRunning) return;

    if (mouseDown && timeJumpCharge > 50) {
        player.timeJump();
        // Time jump effect - teleport player slightly
        player.x += 50 + Math.random() * 100;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }

    mouseDown = false;
    timeJumpCharge = 0;
});

// Initialize
updateUI();