// Precision Archer Game
class PrecisionArcherGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.gameRunning = false;
        this.arrowsLeft = 10;
        this.score = 0;
        this.shots = 0;
        this.bestShot = 0;

        // Physics constants
        this.gravity = 0.3;
        this.groundY = this.canvas.height - 50;

        // Arrow properties
        this.arrow = null;
        this.power = 50;
        this.angle = 45;

        // Wind system
        this.windStrength = 0;
        this.windDirection = 1; // 1 = right, -1 = left

        // Targets
        this.targets = [];

        // UI elements
        this.powerSlider = document.getElementById('power-slider');
        this.angleSlider = document.getElementById('angle-slider');
        this.shootBtn = document.getElementById('shoot-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');

        this.init();
        this.bindEvents();
        this.startNewRound();
    }

    init() {
        this.resizeCanvas();
        this.updateUI();
        this.generateWind();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = Math.min(800, rect.width - 40);
        this.canvas.height = 400;
        this.groundY = this.canvas.height - 50;
    }

    bindEvents() {
        this.powerSlider.addEventListener('input', (e) => {
            this.power = parseInt(e.target.value);
            document.getElementById('power-value').textContent = this.power;
        });

        this.angleSlider.addEventListener('input', (e) => {
            this.angle = parseInt(e.target.value);
            document.getElementById('angle-value').textContent = this.angle + '°';
        });

        this.shootBtn.addEventListener('click', () => {
            if (!this.gameRunning && this.arrowsLeft > 0) {
                this.shootArrow();
            }
        });

        this.resetBtn.addEventListener('click', () => {
            this.startNewRound();
        });

        this.playAgainBtn.addEventListener('click', () => {
            document.getElementById('game-over-modal').style.display = 'none';
            this.startNewRound();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.draw();
        });
    }

    startNewRound() {
        this.arrowsLeft = 10;
        this.score = 0;
        this.shots = 0;
        this.bestShot = 0;
        this.targets = [];
        this.arrow = null;
        this.gameRunning = false;

        this.generateTargets();
        this.generateWind();
        this.updateUI();
        this.draw();
    }

    generateTargets() {
        this.targets = [];
        const targetCount = 3 + Math.floor(Math.random() * 3); // 3-5 targets

        for (let i = 0; i < targetCount; i++) {
            const target = {
                x: 200 + Math.random() * (this.canvas.width - 300),
                y: this.groundY - 50 - Math.random() * 100,
                radius: 20 + Math.random() * 20,
                type: Math.floor(Math.random() * 3), // 0: normal, 1: moving, 2: bonus
                points: 0,
                hit: false
            };

            // Calculate points based on size and position
            if (target.radius <= 25) {
                target.points = 100; // Bullseye
            } else if (target.radius <= 35) {
                target.points = 50; // Good hit
            } else {
                target.points = 25; // Outer ring
            }

            // Bonus points for smaller/harder targets
            if (target.type === 2) {
                target.points *= 2;
                target.radius *= 0.8; // Smaller bonus targets
            }

            this.targets.push(target);
        }
    }

    generateWind() {
        this.windStrength = Math.random() * 0.2 - 0.1; // -0.1 to 0.1
        this.windDirection = Math.random() > 0.5 ? 1 : -1;

        const windElement = document.getElementById('wind-direction');
        const strengthElement = document.getElementById('wind-strength');

        if (this.windDirection > 0) {
            windElement.textContent = '→';
        } else {
            windElement.textContent = '←';
        }

        strengthElement.textContent = Math.abs(this.windStrength * 10).toFixed(1);
    }

    shootArrow() {
        if (this.arrowsLeft <= 0) return;

        this.gameRunning = true;
        this.arrowsLeft--;
        this.shots++;

        // Calculate initial velocity
        const angleRad = (this.angle * Math.PI) / 180;
        const velocityX = Math.cos(angleRad) * (this.power / 10);
        const velocityY = -Math.sin(angleRad) * (this.power / 10);

        this.arrow = {
            x: 50, // Starting position (archer position)
            y: this.groundY - 30,
            vx: velocityX,
            vy: velocityY,
            trail: [],
            rotation: angleRad
        };

        this.animate();
    }

    animate() {
        if (!this.arrow) return;

        // Update arrow physics
        this.arrow.vy += this.gravity; // Gravity
        this.arrow.vx += this.windStrength * this.windDirection; // Wind effect

        this.arrow.x += this.arrow.vx;
        this.arrow.y += this.arrow.vy;

        // Update rotation based on velocity
        this.arrow.rotation = Math.atan2(this.arrow.vy, this.arrow.vx);

        // Add trail point
        this.arrow.trail.push({ x: this.arrow.x, y: this.arrow.y });

        // Keep only recent trail points
        if (this.arrow.trail.length > 20) {
            this.arrow.trail.shift();
        }

        // Check collisions
        this.checkCollisions();

        // Check if arrow is out of bounds or hit ground
        if (this.arrow.y >= this.groundY || this.arrow.x < 0 || this.arrow.x > this.canvas.width) {
            this.endShot();
            return;
        }

        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    checkCollisions() {
        for (let target of this.targets) {
            if (target.hit) continue;

            const dx = this.arrow.x - target.x;
            const dy = this.arrow.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < target.radius) {
                // Hit!
                target.hit = true;
                this.score += target.points;
                this.bestShot = Math.max(this.bestShot, target.points);

                // Create hit effect
                this.createHitEffect(target.x, target.y);

                this.endShot();
                return;
            }
        }
    }

    createHitEffect(x, y) {
        // Create visual hit effect
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'arrow-trail';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = '#FFD700';
            particle.style.width = '4px';
            particle.style.height = '4px';

            // Random direction for particles
            const angle = (i / 8) * Math.PI * 2;
            const distance = 20 + Math.random() * 20;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;

            this.canvas.parentElement.appendChild(particle);

            setTimeout(() => {
                if (particle.parentElement) {
                    particle.parentElement.removeChild(particle);
                }
            }, 500);
        }
    }

    endShot() {
        this.gameRunning = false;
        this.arrow = null;

        this.updateUI();

        // Check if round is over
        if (this.arrowsLeft <= 0) {
            this.showGameOver();
        }
    }

    showGameOver() {
        const accuracy = this.shots > 0 ? Math.round((this.score / (this.shots * 50)) * 100) : 0;

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-accuracy').textContent = accuracy + '%';
        document.getElementById('final-best').textContent = this.bestShot;

        document.getElementById('game-over-modal').style.display = 'flex';
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#FFF8DC');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);

        // Draw grass texture
        this.ctx.fillStyle = '#228B22';
        for (let i = 0; i < this.canvas.width; i += 4) {
            const height = 5 + Math.sin(i * 0.1) * 3;
            this.ctx.fillRect(i, this.groundY - height, 2, height);
        }

        // Draw archer (simple representation)
        this.drawArcher();

        // Draw targets
        this.targets.forEach(target => {
            this.drawTarget(target);
        });

        // Draw arrow trail
        if (this.arrow && this.arrow.trail.length > 1) {
            this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            for (let i = 0; i < this.arrow.trail.length - 1; i++) {
                const point = this.arrow.trail[i];
                const nextPoint = this.arrow.trail[i + 1];

                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
            this.ctx.stroke();
        }

        // Draw arrow
        if (this.arrow) {
            this.drawArrow(this.arrow);
        }

        // Draw wind indicator
        this.drawWindIndicator();
    }

    drawArcher() {
        // Simple archer representation
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(30, this.groundY - 40, 8, 40); // Body

        this.ctx.fillStyle = '#FFDBAC';
        this.ctx.beginPath();
        this.ctx.arc(34, this.groundY - 50, 8, 0, Math.PI * 2); // Head
        this.ctx.fill();

        // Bow
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(45, this.groundY - 30, 15, -Math.PI/2, Math.PI/2);
        this.ctx.stroke();
    }

    drawTarget(target) {
        if (target.hit) {
            this.ctx.globalAlpha = 0.3;
        }

        // Target rings
        const colors = ['#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF', '#FF0000'];
        const ringWidth = target.radius / colors.length;

        for (let i = 0; i < colors.length; i++) {
            this.ctx.fillStyle = colors[i];
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius - (i * ringWidth), 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Center dot
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(target.x, target.y, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Target type indicator
        if (target.type === 1) {
            // Moving target indicator
            this.ctx.fillStyle = '#FF6B35';
            this.ctx.fillRect(target.x - 15, target.y - target.radius - 10, 30, 5);
        } else if (target.type === 2) {
            // Bonus target indicator
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y - target.radius - 8, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.globalAlpha = 1;
    }

    drawArrow(arrow) {
        this.ctx.save();
        this.ctx.translate(arrow.x, arrow.y);
        this.ctx.rotate(arrow.rotation);

        // Arrow shaft
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-20, 0);
        this.ctx.lineTo(10, 0);
        this.ctx.stroke();

        // Arrow head
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.beginPath();
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(5, -3);
        this.ctx.lineTo(5, 3);
        this.ctx.closePath();
        this.ctx.fill();

        // Fletching
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(-15, -2, 6, 4);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(-8, -2, 6, 4);

        this.ctx.restore();
    }

    drawWindIndicator() {
        const centerX = this.canvas.width - 50;
        const centerY = 30;

        // Wind arrow
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 20 * this.windDirection, centerY);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.stroke();

        // Arrow head
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX - 5 * this.windDirection, centerY - 5);
        this.ctx.lineTo(centerX - 5 * this.windDirection, centerY + 5);
        this.ctx.closePath();
        this.ctx.fillStyle = '#333';
        this.ctx.fill();

        // Wind strength indicator
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(Math.abs(this.windStrength * 10).toFixed(1), centerX, centerY + 20);
    }

    updateUI() {
        const accuracy = this.shots > 0 ? Math.round((this.score / (this.shots * 50)) * 100) : 0;

        document.getElementById('score').textContent = this.score;
        document.getElementById('arrows-left').textContent = this.arrowsLeft;
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('best-score').textContent = this.bestShot;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PrecisionArcherGame('game-canvas');
});