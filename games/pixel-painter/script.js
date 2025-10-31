const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const instructionsOverlay = document.getElementById('instructions-overlay');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const colorElement = document.getElementById('color');

canvas.width = 800;
canvas.height = 600;

const PIXEL_SIZE = 20;
const GRID_WIDTH = canvas.width / PIXEL_SIZE;
const GRID_HEIGHT = canvas.height / PIXEL_SIZE;

let gameRunning = false;
let pixels = [];
let cursor = { x: 0, y: 0 };
let score = 0;
let timeLeft = 60;
let currentColor = '#ff0000';
let gameTimer;
let mouseDown = false;

// Colors available
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'];
let colorIndex = 0;

// Initialize pixels grid
function initPixels() {
    pixels = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        pixels[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            pixels[y][x] = '#cccccc'; // Unpainted gray
        }
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    }

    // Draw cursor
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(cursor.x * PIXEL_SIZE, cursor.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

    // Draw cursor crosshair
    ctx.beginPath();
    ctx.moveTo(cursor.x * PIXEL_SIZE + PIXEL_SIZE/2, cursor.y * PIXEL_SIZE);
    ctx.lineTo(cursor.x * PIXEL_SIZE + PIXEL_SIZE/2, cursor.y * PIXEL_SIZE + PIXEL_SIZE);
    ctx.moveTo(cursor.x * PIXEL_SIZE, cursor.y * PIXEL_SIZE + PIXEL_SIZE/2);
    ctx.lineTo(cursor.x * PIXEL_SIZE + PIXEL_SIZE, cursor.y * PIXEL_SIZE + PIXEL_SIZE/2);
    ctx.stroke();
}

// Paint pixel
function paintPixel(x, y) {
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
        if (pixels[y][x] === '#cccccc') { // Only paint unpainted pixels
            pixels[y][x] = currentColor;
            score++;
            updateUI();
        }
    }
}

// Change color
function changeColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    currentColor = colors[colorIndex];
    updateUI();
}

// Update UI
function updateUI() {
    scoreElement.textContent = `Pixels Painted: ${score}`;
    timerElement.textContent = `Time: ${timeLeft}`;
    const colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan', 'White', 'Black'];
    colorElement.textContent = `Current Color: ${colorNames[colorIndex]}`;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    gameRunning = true;
    timeLeft = 60;
    score = 0;
    colorIndex = 0;
    currentColor = colors[0];
    initPixels();
    updateUI();

    gameTimer = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    gameLoop();
}

// End game
function endGame() {
    gameRunning = false;
    clearInterval(gameTimer);
    alert(`Time's up! You painted ${score} pixels.`);
}

// Reset canvas
function resetCanvas() {
    initPixels();
    score = 0;
    updateUI();
}

// Event listeners
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    startGame();
});

canvas.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    cursor.x = Math.max(0, Math.min(GRID_WIDTH - 1, x));
    cursor.y = Math.max(0, Math.min(GRID_HEIGHT - 1, y));
});

canvas.addEventListener('mousedown', (e) => {
    if (!gameRunning) return;
    mouseDown = true;
    paintPixel(cursor.x, cursor.y);
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (!gameRunning || !mouseDown) return;
    paintPixel(cursor.x, cursor.y);
});

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            paintPixel(cursor.x, cursor.y);
            break;
        case 'KeyR':
            resetCanvas();
            break;
        case 'KeyC':
            changeColor();
            break;
        case 'ArrowUp':
            cursor.y = Math.max(0, cursor.y - 1);
            break;
        case 'ArrowDown':
            cursor.y = Math.min(GRID_HEIGHT - 1, cursor.y + 1);
            break;
        case 'ArrowLeft':
            cursor.x = Math.max(0, cursor.x - 1);
            break;
        case 'ArrowRight':
            cursor.x = Math.min(GRID_WIDTH - 1, cursor.x + 1);
            break;
    }
});

// Initialize
initPixels();
updateUI();
