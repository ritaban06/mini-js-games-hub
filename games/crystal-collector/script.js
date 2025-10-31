const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

canvas.width = 800;
canvas.height = 600;

const TILE_SIZE = 40;
const GRID_WIDTH = canvas.width / TILE_SIZE;
const GRID_HEIGHT = canvas.height / TILE_SIZE;

let gameRunning = false;
let score = 0;
let lives = 3;
let player;
let crystals = [];
let boulders = [];
let guardians = [];
let maze = [];

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = TILE_SIZE - 4;
    }

    move(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            if (maze[newY][newX] === 0) { // 0 = path
                this.x = newX;
                this.y = newY;
            }
        }
    }

    draw() {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x * TILE_SIZE + 2, this.y * TILE_SIZE + 2, this.size, this.size);
    }
}

// Crystal class
class Crystal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.collected = false;
    }

    draw() {
        if (!this.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.x * TILE_SIZE + TILE_SIZE/2, this.y * TILE_SIZE + TILE_SIZE/2, 8, 0, Math.PI * 2);
            ctx.fill();
            // Glow effect
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// Boulder class
class Boulder {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction; // 0: right, 1: down, 2: left, 3: up
        this.speed = 1;
        this.moveCounter = 0;
    }

    update() {
        this.moveCounter++;
        if (this.moveCounter >= 10) { // Move every 10 frames
            this.moveCounter = 0;
            let newX = this.x;
            let newY = this.y;
            
            switch (this.direction) {
                case 0: newX++; break;
                case 1: newY++; break;
                case 2: newX--; break;
                case 3: newY--; break;
            }
            
            if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
                if (maze[newY][newX] === 0) {
                    this.x = newX;
                    this.y = newY;
                } else {
                    // Hit wall, change direction
                    this.direction = (this.direction + 1) % 4;
                }
            } else {
                // Hit edge, change direction
                this.direction = (this.direction + 1) % 4;
            }
        }
    }

    draw() {
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x * TILE_SIZE + 2, this.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }
}

// Guardian class
class Guardian {
    constructor(x, y, path) {
        this.x = x;
        this.y = y;
        this.path = path;
        this.pathIndex = 0;
        this.moveCounter = 0;
    }

    update() {
        this.moveCounter++;
        if (this.moveCounter >= 15) { // Move slower than boulders
            this.moveCounter = 0;
            this.pathIndex = (this.pathIndex + 1) % this.path.length;
            this.x = this.path[this.pathIndex].x;
            this.y = this.path[this.pathIndex].y;
        }
    }

    draw() {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x * TILE_SIZE + 4, this.y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    }
}

// Generate maze
function generateMaze() {
    maze = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        maze[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            // Create walls around edges and some internal walls
            if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1 ||
                (x % 3 === 0 && y % 2 === 0) || (x % 5 === 0 && y % 3 === 0)) {
                maze[y][x] = 1; // Wall
            } else {
                maze[y][x] = 0; // Path
            }
        }
    }
}

// Initialize game
function initGame() {
    generateMaze();
    
    player = new Player(1, 1);
    
    crystals = [];
    boulders = [];
    guardians = [];
    
    // Place crystals
    for (let i = 0; i < 10; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * GRID_WIDTH);
            y = Math.floor(Math.random() * GRID_HEIGHT);
        } while (maze[y][x] === 1 || (x === player.x && y === player.y));
        crystals.push(new Crystal(x, y));
    }
    
    // Place boulders
    for (let i = 0; i < 3; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * GRID_WIDTH);
            y = Math.floor(Math.random() * GRID_HEIGHT);
        } while (maze[y][x] === 1);
        boulders.push(new Boulder(x, y, Math.floor(Math.random() * 4)));
    }
    
    // Place guardians with patrol paths
    for (let i = 0; i < 2; i++) {
        let path = [];
        let startX = Math.floor(Math.random() * GRID_WIDTH);
        let startY = Math.floor(Math.random() * GRID_HEIGHT);
        
        // Create simple patrol path
        for (let j = 0; j < 4; j++) {
            path.push({x: startX + j, y: startY});
        }
        
        guardians.push(new Guardian(startX, startY, path));
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
    boulders.forEach(b => b.update());
    guardians.forEach(g => g.update());
    
    checkCollisions();
    updateUI();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = '#2d1810';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    
    // Draw game objects
    crystals.forEach(c => c.draw());
    boulders.forEach(b => b.draw());
    guardians.forEach(g => g.draw());
    player.draw();
}

// Check collisions
function checkCollisions() {
    // Player with crystals
    crystals.forEach((crystal, index) => {
        if (!crystal.collected && crystal.x === player.x && crystal.y === player.y) {
            crystal.collected = true;
            score++;
        }
    });
    
    // Player with boulders
    boulders.forEach(boulder => {
        if (boulder.x === player.x && boulder.y === player.y) {
            lives--;
            if (lives <= 0) {
                gameOver();
            } else {
                player.x = 1;
                player.y = 1;
            }
        }
    });
    
    // Player with guardians
    guardians.forEach(guardian => {
        if (guardian.x === player.x && guardian.y === player.y) {
            lives--;
            if (lives <= 0) {
                gameOver();
            } else {
                player.x = 1;
                player.y = 1;
            }
        }
    });
    
    // Check win condition
    const collectedCrystals = crystals.filter(c => c.collected).length;
    if (collectedCrystals === crystals.length) {
        gameWin();
    }
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Crystals: ${crystals.filter(c => c.collected).length}/${crystals.length}`;
    livesElement.textContent = `Lives: ${lives}`;
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`Game Over! You collected ${crystals.filter(c => c.collected).length} crystals.`);
    resetGame();
}

// Game win
function gameWin() {
    gameRunning = false;
    alert(`Congratulations! You collected all crystals!`);
    resetGame();
}

// Reset game
function resetGame() {
    score = 0;
    lives = 3;
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
            e.preventDefault();
            player.move(0, -1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            player.move(0, 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            player.move(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            player.move(1, 0);
            break;
    }
});

// Initialize
initGame();
updateUI();