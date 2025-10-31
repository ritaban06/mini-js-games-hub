const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const gravityElement = document.getElementById('gravity');
const powerBar = document.getElementById('power-bar');

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let ball;
let hole;
let obstacles = [];
let planets = [
    { name: 'Earth', gravity: 0.5, color: '#4CAF50', bg: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)' },
    { name: 'Moon', gravity: 0.17, color: '#9E9E9E', bg: 'linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 100%)' },
    { name: 'Mars', gravity: 0.38, color: '#CD853F', bg: 'linear-gradient(135deg, #D2691E 0%, #F4A460 100%)' },
    { name: 'Jupiter', gravity: 1.2, color: '#DAA520', bg: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' },
    { name: 'Neptune', gravity: 0.8, color: '#4169E1', bg: 'linear-gradient(135deg, #191970 0%, #000080 100%)' }
];

let currentPlanet = 0;
let strokes = 0;
let ballInMotion = false;
let aiming = false;
let aimStart = { x: 0, y: 0 };
let aimEnd = { x: 0, y: 0 };
let power = 0;

// Ball class
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.trail = [];
    }

    update() {
        if (!ballInMotion) return;

        const planet = planets[currentPlanet];

        // Apply gravity
        this.vy += planet.gravity;

        // Apply air resistance
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Add to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 20) {
            this.trail.shift();
        }

        // Check ground collision (simple bounce)
        if (this.y + this.radius >= canvas.height - 50) {
            this.y = canvas.height - 50 - this.radius;
            this.vy *= -0.6; // Bounce with energy loss
            this.vx *= 0.8;

            if (Math.abs(this.vy) < 1) {
                this.vy = 0;
                ballInMotion = false;
                this.onGround = true;
            }
        }

        // Check obstacle collisions
        obstacles.forEach(obstacle => {
            if (this.x + this.radius > obstacle.x &&
                this.x - this.radius < obstacle.x + obstacle.width &&
                this.y + this.radius > obstacle.y &&
                this.y - this.radius < obstacle.y + obstacle.height) {

                // Simple collision response
                if (this.vx > 0 && this.x < obstacle.x) {
                    this.vx *= -0.8;
                    this.x = obstacle.x - this.radius;
                } else if (this.vx < 0 && this.x > obstacle.x + obstacle.width) {
                    this.vx *= -0.8;
                    this.x = obstacle.x + obstacle.width + this.radius;
                }

                if (this.vy > 0 && this.y < obstacle.y) {
                    this.vy *= -0.8;
                    this.y = obstacle.y - this.radius;
                } else if (this.vy < 0 && this.y > obstacle.y + obstacle.height) {
                    this.vy *= -0.8;
                    this.y = obstacle.y + obstacle.height + this.radius;
                }
            }
        });

        // Check hole collision
        const dx = this.x - hole.x;
        const dy = this.y - hole.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hole.radius + this.radius) {
            ballInMotion = false;
            levelComplete();
        }

        // Stop if ball goes off screen
        if (this.x < -50 || this.x > canvas.width + 50 || this.y > canvas.height + 50) {
            resetBall();
        }
    }

    draw() {
        // Draw trail
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 1; i < this.trail.length; i++) {
            ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();

        // Draw ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    shoot(angle, power) {
        const radian = angle * Math.PI / 180;
        this.vx = Math.cos(radian) * power * 0.3;
        this.vy = Math.sin(radian) * power * 0.3;
        ballInMotion = true;
        this.onGround = false;
        this.trail = [];
        strokes++;
        updateUI();
    }
}

// Initialize level
function initLevel() {
    const planet = planets[currentPlanet];

    // Set background
    canvas.style.background = planet.bg;

    // Create ball
    ball = new Ball(100, canvas.height - 100);

    // Create hole
    hole = {
        x: canvas.width - 100,
        y: canvas.height - 100,
        radius: 15
    };

    // Create obstacles
    obstacles = [];
    const numObstacles = 3 + currentPlanet;
    for (let i = 0; i < numObstacles; i++) {
        obstacles.push({
            x: 200 + i * 150 + Math.random() * 100,
            y: canvas.height - 80 - Math.random() * 200,
            width: 20 + Math.random() * 30,
            height: 40 + Math.random() * 60
        });
    }
}

// Level complete
function levelComplete() {
    setTimeout(() => {
        currentPlanet = (currentPlanet + 1) % planets.length;
        initLevel();
        updateUI();
    }, 2000);
}

// Reset ball
function resetBall() {
    ball.x = 100;
    ball.y = canvas.height - 100;
    ball.vx = 0;
    ball.vy = 0;
    ballInMotion = false;
    ball.onGround = true;
    ball.trail = [];
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Strokes: ${strokes}`;
    levelElement.textContent = `Planet: ${planets[currentPlanet].name}`;
    gravityElement.textContent = `Gravity: ${planets[currentPlanet].gravity}`;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles
    ctx.fillStyle = '#8B4513';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw ball
    ball.draw();

    // Draw aim line
    if (aiming && !ballInMotion) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(aimStart.x, aimStart.y);
        ctx.lineTo(aimEnd.x, aimEnd.y);
        ctx.stroke();

        // Draw power arc
        const angle = Math.atan2(aimEnd.y - aimStart.y, aimEnd.x - aimStart.x);
        const distance = Math.sqrt((aimEnd.x - aimStart.x) ** 2 + (aimEnd.y - aimStart.y) ** 2);
        const maxPower = 100;
        const powerPercent = Math.min(distance / maxPower, 1);

        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(aimStart.x, aimStart.y, powerPercent * 50, angle - 0.5, angle + 0.5);
        ctx.stroke();
    }

    // Draw UI text
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'left';
    ctx.fillText(`Planet: ${planets[currentPlanet].name}`, 20, 40);
    ctx.fillText(`Gravity: ${planets[currentPlanet].gravity}`, 20, 60);
    ctx.fillText(`Strokes: ${strokes}`, 20, 80);
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
    updateUI();
    gameLoop();
});

canvas.addEventListener('mousedown', (e) => {
    if (!gameRunning || ballInMotion) return;

    const rect = canvas.getBoundingClientRect();
    aimStart.x = ball.x;
    aimStart.y = ball.y;
    aimEnd.x = e.clientX - rect.left;
    aimEnd.y = e.clientY - rect.top;
    aiming = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (!aiming) return;

    const rect = canvas.getBoundingClientRect();
    aimEnd.x = e.clientX - rect.left;
    aimEnd.y = e.clientY - rect.top;

    // Update power bar
    const distance = Math.sqrt((aimEnd.x - aimStart.x) ** 2 + (aimEnd.y - aimStart.y) ** 2);
    power = Math.min(distance / 2, 100);
    powerBar.style.width = `${power}%`;
});

canvas.addEventListener('mouseup', (e) => {
    if (!aiming) return;

    const dx = aimEnd.x - aimStart.x;
    const dy = aimEnd.y - aimStart.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    ball.shoot(angle, power);

    aiming = false;
    powerBar.style.width = '0%';
});

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.code) {
        case 'KeyR':
            resetBall();
            break;
        case 'KeyN':
            levelComplete();
            break;
    }
});

// Initialize
updateUI();