// game.js

// --- 1. Setup Canvas and Context ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// --- 2. Game State & Component Variables ---
let score = 0;
let lives = 3;
let gameOver = false;
let gameWin = false;

// Ball properties
const ballRadius = 5;
let x = CANVAS_WIDTH / 2; // Ball x-position
let y = CANVAS_HEIGHT - 30; // Ball y-position
let dx = 2; // Ball x-velocity (delta x)
let dy = -2; // Ball y-velocity (delta y)

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 70;
let paddleX = (CANVAS_WIDTH - paddleWidth) / 2; // Paddle x-position

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 50;
const brickHeight = 15;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;

// Bricks array (using a 2D array for the grid)
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        // Status 1 means the brick is visible/active
        bricks[c][r] = { x: 0, y: 0, status: 1 }; 
    }
}

// User Input (Key presses)
let rightPressed = false;
let leftPressed = false;

// --- 3. Drawing Functions ---

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#a9b7c6"; // Light blue/grey
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, CANVAS_HEIGHT - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#c679dd"; // Purple
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) { // Only draw active bricks
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                
                // Update brick position in the array
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#50fa7b"; // Green
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// --- 4. Game Logic: Collision Detection ---

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                // Simple AABB (Axis-Aligned Bounding Box) collision for ball (circle) and brick (rect)
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; // Reverse vertical direction
                    b.status = 0; // Destroy the brick
                    score++;
                    
                    // Win condition check
                    if (score === brickRowCount * brickColumnCount) {
                        gameWin = true;
                    }
                }
            }
        }
    }
}

function ballMovement() {
    // Wall Collision (Left/Right)
    if (x + dx > CANVAS_WIDTH - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    // Wall Collision (Top)
    if (y + dy < ballRadius) {
        dy = -dy;
    } 
    // Bottom edge (Paddle or Game Over)
    else if (y + dy > CANVAS_HEIGHT - ballRadius - paddleHeight) {
        // Paddle hit
        if (x > paddleX && x < paddleX + paddleWidth) {
            // **Advanced:** Adjust dx based on where it hit the paddle for realistic bounce
            // For now, a simple reversal:
            dy = -dy; 
        } 
        // Missed the paddle - Game Over/Lose Life
        else if (y + dy > CANVAS_HEIGHT - ballRadius) {
            lives--;
            if (lives <= 0) {
                gameOver = true;
            } else {
                // Reset ball and paddle position for new life
                x = CANVAS_WIDTH / 2;
                y = CANVAS_HEIGHT - 30;
                dx = 2;
                dy = -2;
                paddleX = (CANVAS_WIDTH - paddleWidth) / 2;
            }
        }
    }
    
    // Update ball position
    x += dx;
    y += dy;
}

function paddleMovement() {
    if (rightPressed && paddleX < CANVAS_WIDTH - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

// --- 5. User Input Handlers (Keyboard) ---

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// --- 6. The Game Loop ---

function draw() {
    // 1. **Clear the canvas** on every frame
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. **Draw** game components
    drawBricks();
    drawBall();
    drawPaddle();
    // (Add score, lives, and other info drawing here)

    if (gameOver) {
        // Draw Game Over screen/text
        console.log("GAME OVER");
        // We'll stop the loop outside this function using return
    } else if (gameWin) {
        // Draw Win screen/text
        console.log("YOU WIN!");
    } else {
        // 3. **Update Game Logic** (Movement and Collisions)
        ballMovement();
        paddleMovement();
        collisionDetection();

        // 4. **Continue the loop**
        requestAnimationFrame(draw);
    }
}

// Start the game!
requestAnimationFrame(draw);