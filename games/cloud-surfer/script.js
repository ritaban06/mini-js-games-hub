const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const startGameButton = document.getElementById('start-game-button');
const pauseButton = document.getElementById('pause-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');
const mainMenuButton = document.getElementById('main-menu-button');
const nextLevelButton = document.getElementById('next-level-button');
const resumeButton = document.getElementById('resume-button');
const restartPauseButton = document.getElementById('restart-pause-button');
const quitButton = document.getElementById('quit-button');
const instructionsOverlay = document.getElementById('instructions-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const levelCompleteOverlay = document.getElementById('level-complete-overlay');
const pauseOverlay = document.getElementById('pause-overlay');
const balanceIndicator = document.getElementById('balance-indicator');

canvas.width = 800;
canvas.height = 500;

let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let levelComplete = false;
let score = 0;
let lives = 3;
let level = 1;
let balance = 0; // -100 to 100, 0 is balanced
let balanceVelocity = 0;
let windStrength = 0;
let cloudSpeed = 2;
let surfer;
let clouds = [];
let collectibles = [];
let obstacles = [];
let particles = [];
let keys = {};
let lastTime = 0;
let weatherType = 'clear';

// Cloud Surfer class
class CloudSurfer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.speed = 3;
        this.currentCloud = null;
        this.jumpCooldown = 0;
        this.glow = 0;
        this.trail = [];
    }

    update() {
        // Handle input
        if (keys.ArrowLeft) {
            this.x = Math.max(0, this.x - this.speed);
            balance -= 0.5; // Leaning left affects balance
        }
        if (keys.ArrowRight) {
            this.x = Math.min(canvas.width - this.width, this.x + this.speed);
            balance += 0.5; // Leaning right affects balance
        }
        if (keys.ArrowUp) {
            balance = balance * 0.9; // Center balance
        }
        if (keys.ArrowDown) {
            balance = balance * 0.9; // Center balance
        }
        if (keys[' '] && this.jumpCooldown <= 0) {
            this.jumpToNewCloud();
            this.jumpCooldown = 60; // 1 second cooldown
        }

        // Update jump cooldown
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        }

        // Update trail
        this.trail.push({ x: this.x + this.width/2, y: this.y + this.height/2 });
        if (this.trail.length > 20) {
            this.trail.shift();
        }

        // Update glow effect
        this.glow += 0.1;

        // Check if still on cloud
        if (this.currentCloud) {
            if (!this.isOnCloud(this.currentCloud)) {
                this.fallOffCloud();
            }
        } else {
            // Find a cloud to land on
            this.findCloudToLand();
        }
    }

    jumpToNewCloud() {
        // Find nearest cloud above
        let nearestCloud = null;
        let minDistance = Infinity;

        clouds.forEach(cloud => {
            if (cloud.y < this.y - 50) { // Cloud must be above
                const distance = Math.abs(cloud.x + cloud.width/2 - (this.x + this.width/2));
                if (distance < minDistance && distance < 100) {
                    minDistance = distance;
                    nearestCloud = cloud;
                }
            }
        });

        if (nearestCloud) {
            this.x = nearestCloud.x + nearestCloud.width/2 - this.width/2;
            this.y = nearestCloud.y - this.height;
            this.currentCloud = nearestCloud;
            balance = 0; // Reset balance on landing
            score += 25; // Bonus for successful jump
            createParticles(this.x + this.width/2, this.y + this.height, 'jump', 5);
        }
    }

    isOnCloud(cloud) {
        return this.x + this.width > cloud.x &&
               this.x < cloud.x + cloud.width &&
               this.y + this.height >= cloud.y &&
               this.y + this.height <= cloud.y + cloud.height + 10;
    }

    findCloudToLand() {
        clouds.forEach(cloud => {
            if (this.isOnCloud(cloud)) {
                this.currentCloud = cloud;
                balance = 0; // Reset balance on landing
            }
        });
    }

    fallOffCloud() {
        this.currentCloud = null;
        lives--;
        balance = 0;
        createParticles(this.x + this.width/2, this.y + this.height, 'fall', 10);

        if (lives <= 0) {
            gameOver = true;
            showGameOver();
        } else {
            // Reset to safe position
            this.x = canvas.width / 2 - this.width / 2;
            this.y = canvas.height - 100;
            this.findCloudToLand();
        }
    }

    draw() {
        ctx.save();

        // Draw trail
        ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 1; i < this.trail.length; i++) {
            ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();

        // Draw surfer
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Surfer details
        ctx.fillStyle = '#ffd93d';
        // Head
        ctx.fillRect(this.x + 8, this.y - 8, 14, 12);
        // Arms
        ctx.fillRect(this.x + 2, this.y + 8, 6, 16);
        ctx.fillRect(this.x + 22, this.y + 8, 6, 16);
        // Legs
        ctx.fillRect(this.x + 6, this.y + 32, 6, 12);
        ctx.fillRect(this.x + 18, this.y + 32, 6, 12);

        // Surfboard effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(this.x - 5, this.y + this.height - 5, this.width + 10, 8);

        // Glow effect when jumping
        if (this.jumpCooldown > 40) {
            ctx.shadowColor = '#87CEEB';
            ctx.shadowBlur = 20 + Math.sin(this.glow) * 10;
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }

        ctx.restore();
    }
}

// Cloud class
class Cloud {
    constructor(x, y, width = 120, height = 60, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.speed = cloudSpeed;
        this.stability = type === 'storm' ? 0.7 : 1.0; // Storm clouds are less stable
        this.lightningTimer = 0;
    }

    update() {
        this.x -= this.speed;

        // Remove off-screen clouds
        if (this.x + this.width < 0) {
            clouds.splice(clouds.indexOf(this), 1);
        }

        // Lightning effect for storm clouds
        if (this.type === 'storm') {
            this.lightningTimer++;
            if (this.lightningTimer > 180) { // Every 3 seconds
                this.createLightning();
                this.lightningTimer = 0;
            }
        }
    }

    createLightning() {
        // Create lightning bolt
        createParticles(this.x + this.width/2, this.y, 'lightning', 1);
    }

    draw() {
        ctx.save();

        if (this.type === 'storm') {
            ctx.fillStyle = 'rgba(47, 79, 79, 0.8)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        }

        // Main cloud body
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 30, 25, 0, Math.PI * 2);
        ctx.arc(this.x + 60, this.y + 25, 30, 0, Math.PI * 2);
        ctx.arc(this.x + 90, this.y + 35, 25, 0, Math.PI * 2);
        ctx.fill();

        // Cloud puffs
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 35, 20, 0, Math.PI * 2);
        ctx.arc(this.x + 45, this.y + 40, 18, 0, Math.PI * 2);
        ctx.arc(this.x + 75, this.y + 38, 22, 0, Math.PI * 2);
        ctx.arc(this.x + 105, this.y + 32, 20, 0, Math.PI * 2);
        ctx.fill();

        // Storm cloud effects
        if (this.type === 'storm') {
            // Dark edges
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Rain effect
            for (let i = 0; i < 5; i++) {
                ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
                ctx.fillRect(this.x + 20 + i * 15, this.y + this.height, 2, 10 + Math.random() * 10);
            }
        }

        ctx.restore();
    }
}

// Collectible class
class Collectible {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        this.bounce = 0;
        this.rotation = 0;
    }

    update() {
        this.bounce += 0.2;
        this.rotation += 0.1;

        // Check collision with surfer
        if (surfer && !this.collected) {
            if (this.x < surfer.x + surfer.width &&
                this.x + this.width > surfer.x &&
                this.y < surfer.y + surfer.height &&
                this.y + this.height > surfer.y) {
                this.collect();
            }
        }

        // Remove off-screen collectibles
        if (this.x < -50) {
            collectibles.splice(collectibles.indexOf(this), 1);
        }
    }

    collect() {
        this.collected = true;
        createParticles(this.x + this.width/2, this.y + this.height/2, this.type, 8);

        switch (this.type) {
            case 'raindrop':
                score += 10;
                balance = Math.max(-50, balance - 5); // Stabilizes balance slightly
                break;
            case 'star':
                score += 50;
                balance = 0; // Perfect balance reset
                break;
            case 'rainbow':
                score += 100;
                lives = Math.min(5, lives + 1); // Extra life
                break;
        }

        updateUI();
        collectibles.splice(collectibles.indexOf(this), 1);
    }

    draw() {
        if (this.collected) return;

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width/2, -this.height/2 - Math.sin(this.bounce) * 5);

        switch (this.type) {
            case 'raindrop':
                ctx.fillStyle = '#4682B4';
                ctx.beginPath();
                ctx.arc(10, 10, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#5DADE2';
                ctx.beginPath();
                ctx.ellipse(10, 18, 3, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'star':
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 10;
                drawStar(10, 10, 5, 10, 5);
                break;
            case 'rainbow':
                const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'];
                colors.forEach((color, i) => {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(10, 10, 8 - i, 0, Math.PI, true);
                    ctx.stroke();
                });
                break;
        }

        ctx.restore();
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 40;
        this.height = 40;
        this.speed = cloudSpeed * 1.2;
        this.dangerous = true;
    }

    update() {
        this.x -= this.speed;

        // Check collision with surfer
        if (surfer && this.dangerous) {
            if (this.x < surfer.x + surfer.width &&
                this.x + this.width > surfer.x &&
                this.y < surfer.y + surfer.height &&
                this.y + this.height > surfer.y) {
                this.hitSurfer();
            }
        }

        // Remove off-screen obstacles
        if (this.x < -50) {
            obstacles.splice(obstacles.indexOf(this), 1);
        }
    }

    hitSurfer() {
        this.dangerous = false;
        lives--;
        balance += 20; // Knock off balance
        createParticles(this.x + this.width/2, this.y + this.height/2, 'explosion', 15);

        if (lives <= 0) {
            gameOver = true;
            showGameOver();
        }
    }

    draw() {
        ctx.save();

        switch (this.type) {
            case 'thunderstorm':
                // Dark cloud with lightning
                ctx.fillStyle = 'rgba(47, 79, 79, 0.9)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y + 10);
                ctx.lineTo(this.x + 15, this.y + 25);
                ctx.lineTo(this.x + 12, this.y + 25);
                ctx.lineTo(this.x + 20, this.y + 40);
                ctx.stroke();
                break;
            case 'tornado':
                // Swirling tornado
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const radius = 8 + i * 3;
                    ctx.arc(this.x + this.width/2, this.y + this.height/2, radius, 0, Math.PI * 2);
                }
                ctx.stroke();
                break;
            case 'hail':
                // Hail stones
                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.arc(this.x + 8 + (i % 3) * 12, this.y + 8 + Math.floor(i / 3) * 12, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }

        ctx.restore();
    }
}

// Utility functions
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function createParticles(x, y, type, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 60,
            type: type,
            size: Math.random() * 5 + 2
        });
    }
}

function updateParticles() {
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // Gravity
        particle.life--;

        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life / 60;

        switch (particle.type) {
            case 'raindrop':
                ctx.fillStyle = '#4682B4';
                break;
            case 'star':
                ctx.fillStyle = '#ffd700';
                break;
            case 'rainbow':
                ctx.fillStyle = '#ff6b6b';
                break;
            case 'jump':
                ctx.fillStyle = '#87CEEB';
                break;
            case 'fall':
                ctx.fillStyle = '#ff6b6b';
                break;
            case 'lightning':
                ctx.fillStyle = '#ffff00';
                break;
            case 'explosion':
                ctx.fillStyle = '#e74c3c';
                break;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    });
}

// Game initialization
function initGame() {
    surfer = new CloudSurfer(canvas.width / 2 - 15, canvas.height - 100);
    clouds = [];
    collectibles = [];
    obstacles = [];
    particles = [];
    score = 0;
    lives = 3;
    balance = 0;
    balanceVelocity = 0;

    // Create initial clouds
    for (let i = 0; i < 5; i++) {
        clouds.push(new Cloud(100 + i * 150, canvas.height - 150 - Math.random() * 100));
    }

    // Create initial collectibles
    for (let i = 0; i < 3; i++) {
        const types = ['raindrop', 'star', 'rainbow'];
        collectibles.push(new Collectible(200 + i * 200, canvas.height - 200, types[Math.floor(Math.random() * types.length)]));
    }

    updateUI();
}

// Update balance system
function updateBalance() {
    // Wind effect
    balance += windStrength * 0.1;

    // Balance physics
    balanceVelocity += balance * 0.01;
    balanceVelocity *= 0.95; // Damping
    balance += balanceVelocity;

    // Clamp balance
    balance = Math.max(-100, Math.min(100, balance));

    // Update balance indicator
    const indicatorPosition = 50 + (balance / 100) * 50; // 0% to 100%
    balanceIndicator.style.left = `${indicatorPosition}%`;

    // Visual feedback for unbalanced state
    if (Math.abs(balance) > 60) {
        balanceIndicator.classList.add('unbalanced');
        canvas.classList.add('shake');
    } else {
        balanceIndicator.classList.remove('unbalanced');
        canvas.classList.remove('shake');
    }

    // Fall off if too unbalanced
    if (Math.abs(balance) > 80 && surfer.currentCloud) {
        surfer.fallOffCloud();
    }
}

// Generate new game elements
function generateElements() {
    // Generate clouds
    if (Math.random() < 0.02) {
        const y = canvas.height - 150 - Math.random() * 100;
        const type = Math.random() < 0.3 ? 'storm' : 'normal';
        clouds.push(new Cloud(canvas.width, y, 120, 60, type));
    }

    // Generate collectibles
    if (Math.random() < 0.01) {
        const types = ['raindrop', 'star', 'rainbow'];
        const weights = [0.7, 0.2, 0.1]; // Raindrops more common
        let random = Math.random();
        let selectedType = types[0];
        for (let i = 0; i < types.length; i++) {
            if (random < weights[i]) {
                selectedType = types[i];
                break;
            }
            random -= weights[i];
        }
        collectibles.push(new Collectible(canvas.width, canvas.height - 200 - Math.random() * 100, selectedType));
    }

    // Generate obstacles
    if (Math.random() < 0.005 && level > 1) {
        const types = ['thunderstorm', 'tornado', 'hail'];
        obstacles.push(new Obstacle(canvas.width, canvas.height - 200, types[Math.floor(Math.random() * types.length)]));
    }
}

// Update weather
function updateWeather() {
    // Change weather occasionally
    if (Math.random() < 0.001) {
        const weathers = ['clear', 'overcast', 'stormy'];
        weatherType = weathers[Math.floor(Math.random() * weathers.length)];

        switch (weatherType) {
            case 'clear':
                windStrength = 0;
                break;
            case 'overcast':
                windStrength = (Math.random() - 0.5) * 2;
                break;
            case 'stormy':
                windStrength = (Math.random() - 0.5) * 4;
                break;
        }
    }
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = level;
}

// Level progression
function checkLevelProgression() {
    const levelThresholds = [100, 300, 600, 1000, 1500];
    if (score >= levelThresholds[level - 1] && level < levelThresholds.length) {
        level++;
        levelComplete = true;
        showLevelComplete();
    }
}

// Show game over
function showGameOver() {
    gameRunning = false;
    document.getElementById('final-stats').innerHTML = `
        <p>Final Score: ${score}</p>
        <p>Level Reached: ${level}</p>
        <p>Weather: ${weatherType.charAt(0).toUpperCase() + weatherType.slice(1)}</p>
    `;
    gameOverOverlay.style.display = 'flex';
}

// Show level complete
function showLevelComplete() {
    gameRunning = false;
    document.getElementById('level-stats').innerHTML = `
        <p>Level ${level} Complete!</p>
        <p>Score: ${score}</p>
        <p>Bonus: ${level * 50} points</p>
    `;
    score += level * 50;
    updateUI();
    levelCompleteOverlay.style.display = 'flex';
}

// Game loop
function gameLoop(currentTime) {
    if (!gameRunning || gamePaused) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update game elements
    updateBalance();
    updateWeather();
    generateElements();

    if (surfer) surfer.update();
    clouds.forEach(cloud => cloud.update());
    collectibles.forEach(collectible => collectible.update());
    obstacles.forEach(obstacle => obstacle.update());
    updateParticles();

    checkLevelProgression();

    // Draw everything
    draw();

    requestAnimationFrame(gameLoop);
}

// Draw function
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    switch (weatherType) {
        case 'clear':
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#E0F6FF');
            break;
        case 'overcast':
            gradient.addColorStop(0, '#708090');
            gradient.addColorStop(1, '#F5F5F5');
            break;
        case 'stormy':
            gradient.addColorStop(0, '#2F4F4F');
            gradient.addColorStop(1, '#696969');
            break;
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    clouds.forEach(cloud => cloud.draw());

    // Draw collectibles
    collectibles.forEach(collectible => collectible.draw());

    // Draw obstacles
    obstacles.forEach(obstacle => obstacle.draw());

    // Draw surfer
    if (surfer) surfer.draw();

    // Draw particles
    drawParticles();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') e.preventDefault(); // Prevent page scroll
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'flex';
});

startGameButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    gameRunning = true;
    initGame();
    gameLoop(0);
});

pauseButton.addEventListener('click', () => {
    gamePaused = !gamePaused;
    pauseOverlay.style.display = gamePaused ? 'flex' : 'none';
    pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';
});

restartButton.addEventListener('click', () => {
    gameRunning = false;
    gameOver = false;
    levelComplete = false;
    initGame();
    gameRunning = true;
    gameLoop(0);
});

playAgainButton.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    gameOver = false;
    level = 1;
    initGame();
    gameRunning = true;
    gameLoop(0);
});

mainMenuButton.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    instructionsOverlay.style.display = 'flex';
});

nextLevelButton.addEventListener('click', () => {
    levelCompleteOverlay.style.display = 'none';
    levelComplete = false;
    gameRunning = true;
    gameLoop(0);
});

resumeButton.addEventListener('click', () => {
    pauseOverlay.style.display = 'none';
    gamePaused = false;
    gameLoop(0);
});

restartPauseButton.addEventListener('click', () => {
    pauseOverlay.style.display = 'none';
    gamePaused = false;
    initGame();
    gameRunning = true;
    gameLoop(0);
});

quitButton.addEventListener('click', () => {
    pauseOverlay.style.display = 'none';
    gamePaused = false;
    gameRunning = false;
    instructionsOverlay.style.display = 'flex';
});

// Initialize
updateUI();