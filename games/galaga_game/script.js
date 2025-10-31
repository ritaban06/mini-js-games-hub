const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// --- Entity Classes ---

// 1. Player Class (The Ship)
class Player {
    constructor() {
        this.width = 40;
        this.height = 15;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT - this.height - 20;
        this.speed = 5;
        this.color = '#00ff00'; // Green
    }
    
    draw() {
        ctx.fillStyle = this.color;
        // Simple triangular ship shape
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // Top center
        ctx.lineTo(this.x, this.y + this.height); // Bottom left
        ctx.lineTo(this.x + this.width, this.y + this.height); // Bottom right
        ctx.closePath();
        ctx.fill();
    }
    
    // Updates position based on input (handled externally)
    update(direction) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (direction === 'right' && this.x < CANVAS_WIDTH - this.width) {
            this.x += this.speed;
        }
    }
}

// 2. Projectile Class (The Bullet)
class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.speed = 8;
        this.color = '#ff0000'; // Red
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    
    update() {
        this.y -= this.speed; // Moves up
    }
}

// 3. Enemy Class (The Alien)
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 20;
        this.speedX = 1; // Horizontal movement
        this.speedY = 0.05; // Gradual vertical drop
        this.color = '#ffff00'; // Yellow
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Optional: Draw a unique shape or load an image later
    }

    // Simple AI: Move horizontally, and reverse at wall
    update() {
        this.x += this.speedX;
        this.y += this.speedY; // Gradually descends

        // Wall bounce logic
        if (this.x + this.width > CANVAS_WIDTH || this.x < 0) {
            this.speedX = -this.speedX;
            // Drop a bit more when hitting a wall
            this.y += 10; 
        }
    }
}