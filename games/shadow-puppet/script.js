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
const lightLevelElement = document.getElementById('light-level');
const stealthElement = document.getElementById('stealth');
const actionButtonsContainer = document.getElementById('action-buttons');

canvas.width = 750;
canvas.height = 600;

let gameRunning = false;
let levelComplete = false;
let gameOver = false;
let shadowPuppet;
let lightBeams = [];
let spotlights = [];
let lightSources = [];
let shadowBarriers = [];
let goal;
let platforms = [];
let currentLevel = 1;
let moves = 0;
let lightExposure = 0;
let maxLightExposure = 100;
let actions = [];
let dragging = false;
let dragOffset = { x: 0, y: 0 };

// Shadow Puppet class
class ShadowPuppet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 36;
        this.targetX = x;
        this.targetY = y;
        this.speed = 3;
        this.intangible = false;
        this.intangibleTimer = 0;
        this.merged = false;
        this.glow = 0;
    }

    update() {
        // Move towards target position
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        // Intangible effect
        if (this.intangible) {
            this.intangibleTimer--;
            if (this.intangibleTimer <= 0) {
                this.intangible = false;
            }
        }

        // Glow effect
        this.glow += 0.1;

        // Check light exposure
        this.checkLightExposure();

        // Check goal collision
        if (goal && this.containsPoint(goal.x, goal.y)) {
            levelComplete = true;
            showLevelComplete();
        }
    }

    checkLightExposure() {
        let exposure = 0;

        // Check light beams
        lightBeams.forEach(beam => {
            if (beam.active && this.intersectsBeam(beam)) {
                exposure += beam.intensity;
            }
        });

        // Check spotlights
        spotlights.forEach(spotlight => {
            if (spotlight.active && this.inSpotlight(spotlight)) {
                exposure += spotlight.intensity;
            }
        });

        // Check light sources
        lightSources.forEach(source => {
            if (source.active) {
                const dx = this.x + this.width/2 - source.x;
                const dy = this.y + this.height/2 - source.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < source.radius) {
                    exposure += source.intensity * (1 - distance / source.radius);
                }
            }
        });

        lightExposure = Math.min(maxLightExposure, lightExposure + exposure);

        if (lightExposure >= maxLightExposure && !this.intangible) {
            gameOver = true;
            showGameOver();
        }
    }

    intersectsBeam(beam) {
        // Simple beam intersection check
        const puppetCenterX = this.x + this.width / 2;
        const puppetCenterY = this.y + this.height / 2;

        // Check if puppet center is within beam bounds
        if (puppetCenterX >= beam.x && puppetCenterX <= beam.x + beam.width &&
            puppetCenterY >= beam.y && puppetCenterY <= beam.y + beam.height) {
            return true;
        }

        return false;
    }

    inSpotlight(spotlight) {
        const dx = this.x + this.width/2 - spotlight.x;
        const dy = this.y + this.height/2 - spotlight.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= spotlight.radius;
    }

    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }

    setTarget(x, y) {
        // Check if target is in shadow barrier
        let validTarget = true;
        shadowBarriers.forEach(barrier => {
            if (x >= barrier.x && x <= barrier.x + barrier.width &&
                y >= barrier.y && y <= barrier.y + barrier.height) {
                validTarget = false;
            }
        });

        if (validTarget) {
            this.targetX = x - this.width / 2;
            this.targetY = y - this.height / 2;
            moves++;
            updateUI();
        }
    }

    draw() {
        ctx.save();

        // Shadow effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.shadowBlur = 10;

        // Puppet body
        ctx.fillStyle = this.intangible ? 'rgba(255, 255, 255, 0.5)' : '#ffffff';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Puppet details
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        // Head
        ctx.fillRect(this.x + 6, this.y, 12, 12);
        // Body
        ctx.fillRect(this.x + 8, this.y + 12, 8, 16);
        // Arms
        ctx.fillRect(this.x + 2, this.y + 14, 4, 12);
        ctx.fillRect(this.x + 18, this.y + 14, 4, 12);
        // Legs
        ctx.fillRect(this.x + 6, this.y + 28, 4, 8);
        ctx.fillRect(this.x + 14, this.y + 28, 4, 8);

        // Glow effect when intangible
        if (this.intangible) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }

        // Target indicator
        if (dragging) {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.targetX, this.targetY, this.width, this.height);
            ctx.setLineDash([]);
        }

        ctx.restore();
    }

    useAction(actionType) {
        switch (actionType) {
            case 'extinguish':
                this.extinguishNearbyLights();
                break;
            case 'block':
                this.createShadowBarrier();
                break;
            case 'phase':
                this.phaseThrough();
                break;
            case 'merge':
                this.mergeWithShadows();
                break;
        }
        moves++;
        updateUI();
    }

    extinguishNearbyLights() {
        lightSources.forEach(source => {
            const dx = this.x + this.width/2 - source.x;
            const dy = this.y + this.height/2 - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                source.active = false;
                setTimeout(() => source.active = true, 10000); // Reactivate after 10 seconds
            }
        });
    }

    createShadowBarrier() {
        const barrier = {
            x: this.x + this.width + 10,
            y: this.y,
            width: 40,
            height: 60,
            duration: 300 // frames
        };
        shadowBarriers.push(barrier);
    }

    phaseThrough() {
        this.intangible = true;
        this.intangibleTimer = 180; // 3 seconds at 60fps
    }

    mergeWithShadows() {
        // Find nearby shadow barriers to merge with
        shadowBarriers.forEach(barrier => {
            const dx = this.x + this.width/2 - (barrier.x + barrier.width/2);
            const dy = this.y + this.height/2 - (barrier.y + barrier.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 80) {
                this.merged = true;
                this.speed = 6; // Faster movement when merged
                setTimeout(() => {
                    this.merged = false;
                    this.speed = 3;
                }, 5000);
            }
        });
    }
}

// Light Beam class
class LightBeam {
    constructor(x, y, width, height, direction = 'horizontal', moving = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.moving = moving;
        this.active = true;
        this.intensity = 2;
        this.phase = 0;
        this.originalX = x;
        this.originalY = y;
    }

    update() {
        this.phase += 0.05;

        if (this.moving) {
            if (this.direction === 'horizontal') {
                this.x = this.originalX + Math.sin(this.phase) * 50;
            } else {
                this.y = this.originalY + Math.sin(this.phase) * 50;
            }
        }
    }

    draw() {
        if (!this.active) return;

        ctx.save();
        ctx.fillStyle = `rgba(255, 0, 0, ${0.3 + Math.sin(this.phase) * 0.2})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Beam lines
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.setLineDash([]);

        ctx.restore();
    }
}

// Spotlight class
class Spotlight {
    constructor(x, y, radius = 80) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.active = true;
        this.intensity = 1.5;
        this.angle = 0;
        this.sweepSpeed = 0.02;
        this.sweeping = false;
    }

    update() {
        if (this.sweeping) {
            this.angle += this.sweepSpeed;
        }
    }

    draw() {
        if (!this.active) return;

        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';

        // Spotlight cone
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.angle - 0.5, this.angle + 0.5);
        ctx.lineTo(this.x, this.y);
        ctx.fill();

        // Spotlight border
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}

// Light Source class
class LightSource {
    constructor(x, y, radius = 60) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.active = true;
        this.intensity = 1;
        this.flickering = false;
        this.flickerPhase = 0;
    }

    update() {
        if (this.flickering) {
            this.flickerPhase += 0.2;
        }
    }

    draw() {
        if (!this.active) return;

        ctx.save();

        let alpha = 0.3;
        if (this.flickering) {
            alpha *= (0.5 + Math.sin(this.flickerPhase) * 0.5);
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Light source core
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
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

        // Inner glow
        ctx.shadowBlur = 10;
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
    // Level 1: Simple light beam
    {
        puppetStart: { x: 100, y: 300 },
        lightBeams: [
            { x: 200, y: 250, width: 150, height: 20 }
        ],
        spotlights: [],
        lightSources: [
            { x: 400, y: 200, radius: 60 }
        ],
        goal: { x: 600, y: 400 },
        platforms: [
            { x: 0, y: 400, width: 300, height: 20 },
            { x: 500, y: 450, width: 250, height: 20 }
        ],
        actions: ['extinguish'],
        hint: "Use the extinguish action to turn off the light source and create a safe path!"
    },
    // Level 2: Moving spotlight
    {
        puppetStart: { x: 100, y: 200 },
        lightBeams: [],
        spotlights: [
            { x: 400, y: 300, radius: 100, sweeping: true }
        ],
        lightSources: [],
        goal: { x: 650, y: 500 },
        platforms: [
            { x: 0, y: 300, width: 200, height: 20 },
            { x: 300, y: 400, width: 200, height: 20 },
            { x: 550, y: 350, width: 200, height: 20 }
        ],
        actions: ['block', 'phase'],
        hint: "The spotlight sweeps back and forth. Time your movement or use phase to pass through!"
    },
    // Level 3: Complex setup
    {
        puppetStart: { x: 50, y: 250 },
        lightBeams: [
            { x: 150, y: 200, width: 20, height: 200, direction: 'vertical', moving: true },
            { x: 300, y: 350, width: 150, height: 20 }
        ],
        spotlights: [
            { x: 500, y: 200, radius: 80 }
        ],
        lightSources: [
            { x: 450, y: 450, radius: 50, flickering: true }
        ],
        goal: { x: 680, y: 520 },
        platforms: [
            { x: 0, y: 350, width: 150, height: 20 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 400, y: 300, width: 150, height: 20 },
            { x: 600, y: 400, width: 150, height: 20 }
        ],
        actions: ['extinguish', 'block', 'phase', 'merge'],
        hint: "Combine multiple actions: block light beams, extinguish sources, and merge with shadows for safety!"
    }
];

// Initialize level
function initLevel() {
    const level = levels[currentLevel - 1];

    shadowPuppet = new ShadowPuppet(level.puppetStart.x, level.puppetStart.y);

    lightBeams = level.lightBeams.map(b => new LightBeam(b.x, b.y, b.width, b.height, b.direction, b.moving));
    spotlights = level.spotlights.map(s => {
        const spotlight = new Spotlight(s.x, s.y, s.radius);
        spotlight.sweeping = s.sweeping || false;
        return spotlight;
    });
    lightSources = level.lightSources.map(l => {
        const source = new LightSource(l.x, l.y, l.radius);
        source.flickering = l.flickering || false;
        return source;
    });
    shadowBarriers = [];
    goal = new Goal(level.goal.x, level.goal.y);
    platforms = level.platforms;

    actions = level.actions;
    lightExposure = 0;
    moves = 0;

    createActionButtons();
    updateUI();
}

// Create action buttons
function createActionButtons() {
    actionButtonsContainer.innerHTML = '';

    actions.forEach(action => {
        const button = document.createElement('div');
        button.className = 'action-button';
        button.textContent = action.charAt(0).toUpperCase() + action.slice(1);
        button.addEventListener('click', () => {
            shadowPuppet.useAction(action);
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 200);
        });
        actionButtonsContainer.appendChild(button);
    });
}

// Update UI
function updateUI() {
    levelElement.textContent = `Level: ${currentLevel}`;
    movesElement.textContent = `Moves: ${moves}`;
    lightLevelElement.textContent = `Light: ${Math.round(lightExposure)}%`;

    let stealthRating = 'Perfect';
    if (lightExposure > 75) stealthRating = 'Poor';
    else if (lightExposure > 50) stealthRating = 'Fair';
    else if (lightExposure > 25) stealthRating = 'Good';
    else stealthRating = 'Perfect';

    stealthElement.textContent = `Stealth: ${stealthRating}`;
}

// Show level complete
function showLevelComplete() {
    gameRunning = false;

    const lightPercent = Math.round((lightExposure / maxLightExposure) * 100);
    document.getElementById('level-stats').textContent = `Moves: ${moves} | Light Exposure: ${lightPercent}%`;

    let rating = 'Shadow Master';
    if (lightPercent > 75) rating = 'Detected';
    else if (lightPercent > 50) rating = 'Exposed';
    else if (lightPercent > 25) rating = 'Caution';
    else rating = 'Shadow Master';

    document.getElementById('stealth-rating').textContent = `Stealth Rating: ${rating}`;

    levelCompleteOverlay.style.display = 'flex';
}

// Show game over
function showGameOver() {
    gameRunning = false;
    gameOverOverlay.style.display = 'flex';
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = '#333333';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw shadow barriers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    shadowBarriers.forEach(barrier => {
        ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
        barrier.duration--;
        if (barrier.duration <= 0) {
            shadowBarriers.splice(shadowBarriers.indexOf(barrier), 1);
        }
    });

    // Draw light sources
    lightSources.forEach(source => {
        source.update();
        source.draw();
    });

    // Draw light beams
    lightBeams.forEach(beam => {
        beam.update();
        beam.draw();
    });

    // Draw spotlights
    spotlights.forEach(spotlight => {
        spotlight.update();
        spotlight.draw();
    });

    // Draw goal
    if (goal) goal.draw();

    // Draw shadow puppet
    if (shadowPuppet) shadowPuppet.draw();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    shadowPuppet.update();
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
    initLevel();
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

// Mouse controls for puppet movement
canvas.addEventListener('mousedown', (e) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (shadowPuppet.containsPoint(x, y)) {
        dragging = true;
        dragOffset.x = x - shadowPuppet.x;
        dragOffset.y = y - shadowPuppet.y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!dragging || !gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    shadowPuppet.setTarget(x, y);
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

// Initialize
updateUI();