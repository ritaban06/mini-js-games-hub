// --- Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- NEW: Get UI Elements ---
const instructionsOverlay = document.getElementById('instructions-overlay');
const startButton = document.getElementById('startButton');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// --- Game Constants ---
const SHIP_SIZE = 30; // Height of the triangle
const SHIP_THRUST = 0.1; // Acceleration
const FRICTION = 0.99; // 1 = no friction, 0 = lots
const TURN_SPEED = 0.1; // Radians per frame
const LASER_SPEED = 7;
const LASER_MAX_DIST = 0.6; // Max distance as fraction of canvas width
const ASTEROID_NUM = 3; // Starting number of asteroids
const ASTEROID_SIZE = 100; // Starting size in pixels
const ASTEROID_SPEED = 1; // Max starting speed
const ASTEROID_VERT = 10; // Number of vertices
const ASTEROID_JAG = 0.4; // Jaggedness (0 = none, 1 = lots)
const SHIP_INVULN_DUR = 3; // Invulnerability duration in seconds
const SHIP_BLINK_DUR = 0.1; // Blink duration in seconds
const MAX_LIVES = 3;
const POINTS_LG = 20;
const POINTS_MD = 50;
const POINTS_SM = 100;

// --- Game State ---
let ship;
let lasers = [];
let asteroids = [];
let lives;
let score;
let isGameOver;
let invulnerabilityTime;

// --- Input Handling ---
const keys = {
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    " ": false // <-- FIX: Use the actual space character
};

document.addEventListener('keydown', (e) => {
    // <-- FIX: Removed the incorrect e.key re-assignment
    if (keys[e.key] !== undefined) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    // <-- FIX: Removed the incorrect e.key re-assignment
    if (keys[e.key] !== undefined) {
        keys[e.key] = false;
    }
});

// --- Utility Functions ---

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isColliding(obj1, obj2) {
    return distBetweenPoints(obj1.x, obj1.y, obj2.x, obj2.y) < obj1.radius + obj2.radius;
}

// --- Ship Functions ---

function newShip() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: SHIP_SIZE / 2,
        angle: 0, // Angle in radians (0 = facing right)
        vel: { x: 0, y: 0 }, // Velocity
        isThrusting: false,
        rotation: 0, // 0 = not turning, -1 = left, 1 = right
        blinkTime: Math.ceil(SHIP_BLINK_DUR * 60), // Blink time in frames
        blinkOn: true
    };
}

function drawShip() {
    // Handle blinking during invulnerability
    if (invulnerabilityTime > 0) {
        ship.blinkTime--;
        if (ship.blinkTime === 0) {
            ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * 60);
            ship.blinkOn = !ship.blinkOn;
        }
    } else {
        ship.blinkOn = true;
    }

    if (!ship.blinkOn) {
        return; // Don't draw ship if blinking off
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    // Draw the triangular ship
    ctx.beginPath();
    ctx.moveTo(SHIP_SIZE / 2, 0); // Nose
    ctx.lineTo(-SHIP_SIZE / 2, -SHIP_SIZE / 3); // Rear left
    ctx.lineTo(-SHIP_SIZE / 2, SHIP_SIZE / 3); // Rear right
    ctx.closePath();
    ctx.stroke();

    // Draw thruster flame
    if (ship.isThrusting) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(-SHIP_SIZE / 2 - 2, 0); // Start behind ship
        ctx.lineTo(-SHIP_SIZE / 2 - 12, -SHIP_SIZE / 6);
        ctx.lineTo(-SHIP_SIZE / 2 - 12, SHIP_SIZE / 6);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
}

function updateShip() {
    // 1. Handle Turning
    if (keys.ArrowLeft) ship.angle -= TURN_SPEED;
    if (keys.ArrowRight) ship.angle += TURN_SPEED;

    // 2. Handle Thrust
    ship.isThrusting = keys.ArrowUp;
    if (ship.isThrusting) {
        ship.vel.x += SHIP_THRUST * Math.cos(ship.angle);
        ship.vel.y += SHIP_THRUST * Math.sin(ship.angle);
    }

    // 3. Apply Friction
    ship.vel.x *= FRICTION;
    ship.vel.y *= FRICTION;

    // 4. Update Position
    ship.x += ship.vel.x;
    ship.y += ship.vel.y;

    // 5. Handle Screen Wrapping
    if (ship.x < 0 - ship.radius) ship.x = canvas.width + ship.radius;
    else if (ship.x > canvas.width + ship.radius) ship.x = 0 - ship.radius;
    if (ship.y < 0 - ship.radius) ship.y = canvas.height + ship.radius;
    else if (ship.y > canvas.height + ship.radius) ship.y = 0 - ship.radius;

    // 6. Handle Shooting
    if (keys[" "]) { // <-- FIX: Check for the space character
        shootLaser();
        keys[" "] = false; // <-- FIX: Prevent holding spacebar
    }

    // 7. Update invulnerability timer
    if (invulnerabilityTime > 0) {
        invulnerabilityTime -= 1 / 60; // Assuming 60 FPS
    }
}

function destroyShip() {
    lives--;
    if (lives === 0) {
        isGameOver = true;
    } else {
        ship = newShip();
        invulnerabilityTime = SHIP_INVULN_DUR;
    }
}

// --- Laser Functions ---

function shootLaser() {
    // Create laser object
    const laser = {
        x: ship.x + (SHIP_SIZE / 2) * Math.cos(ship.angle),
        y: ship.y + (SHIP_SIZE / 2) * Math.sin(ship.angle),
        vel: {
            x: LASER_SPEED * Math.cos(ship.angle),
            y: LASER_SPEED * Math.sin(ship.angle)
        },
        distTraveled: 0,
        radius: 2
    };
    lasers.push(laser);
}

function updateLasers() {
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        
        // Update position
        laser.x += laser.vel.x;
        laser.y += laser.vel.y;
        
        // Update distance traveled
        laser.distTraveled += Math.sqrt(Math.pow(laser.vel.x, 2) + Math.pow(laser.vel.y, 2));

        // Remove if off-screen or max distance reached
        if (laser.distTraveled > canvas.width * LASER_MAX_DIST ||
            laser.x < 0 || laser.x > canvas.width ||
            laser.y < 0 || laser.y > canvas.height) {
            lasers.splice(i, 1);
        }
    }
}

function drawLasers() {
    ctx.fillStyle = 'salmon';
    for (const laser of lasers) {
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, laser.radius, 0, Math.PI * 2);
        ctx.closePath(); // <-- FIX: Ensures the circle path is closed before filling
        ctx.fill();
    }
}

// --- Asteroid Functions ---

function createAsteroid(x, y, size) {
    const asteroid = {
        x: x || Math.random() * canvas.width,
        y: y || Math.random() * canvas.height,
        vel: {
            x: (Math.random() * 2 - 1) * ASTEROID_SPEED,
            y: (Math.random() * 2 - 1) * ASTEROID_SPEED
        },
        radius: size / 2,
        size: size,
        angle: Math.random() * Math.PI * 2,
        vertices: []
    };

    // Create vertices
    for (let i = 0; i < ASTEROID_VERT; i++) {
        const angle = (i / ASTEROID_VERT) * Math.PI * 2;
        const radius = asteroid.radius * (1 + Math.random() * ASTEROID_JAG * 2 - ASTEROID_JAG);
        asteroid.vertices.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        });
    }
    return asteroid;
}

function createAsteroidBelt() {
    asteroids = [];
    for (let i = 0; i < ASTEROID_NUM; i++) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ASTEROID_SIZE * 2 + ship.radius); // Don't spawn on ship
        asteroids.push(createAsteroid(x, y, ASTEROID_SIZE));
    }
}

function breakAsteroid(asteroid) {
    // Add points
    if (asteroid.size === ASTEROID_SIZE) {
        score += POINTS_LG;
    } else if (asteroid.size === ASTEROID_SIZE / 2) {
        score += POINTS_MD;
    } else {
        score += POINTS_SM;
    }

    // Break into smaller pieces
    if (asteroid.size > ASTEROID_SIZE / 4) {
        const newSize = asteroid.size / 2;
        asteroids.push(createAsteroid(asteroid.x, asteroid.y, newSize));
        asteroids.push(createAsteroid(asteroid.x, asteroid.y, newSize));
    }
}

function updateAsteroids() {
    for (const asteroid of asteroids) {
        asteroid.x += asteroid.vel.x;
        asteroid.y += asteroid.vel.y;

        // Screen wrapping
        if (asteroid.x < 0 - asteroid.radius) asteroid.x = canvas.width + asteroid.radius;
        else if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = 0 - asteroid.radius;
        if (asteroid.y < 0 - asteroid.radius) asteroid.y = canvas.height + asteroid.radius;
        else if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = 0 - asteroid.radius;
    }
}

function drawAsteroids() {
    ctx.strokeStyle = 'slategrey';
    ctx.lineWidth = 2;
    for (const asteroid of asteroids) {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.angle);
        
        ctx.beginPath();
        ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
        for (let j = 1; j < asteroid.vertices.length; j++) {
            ctx.lineTo(asteroid.vertices[j].x, asteroid.vertices[j].y);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
}

// --- Collision Detection ---

function checkCollisions() {
    // 1. Ship vs Asteroids
    if (invulnerabilityTime <= 0) {
        for (const asteroid of asteroids) {
            if (isColliding(ship, asteroid)) {
                destroyShip();
                break;
            }
        }
    }

    // 2. Lasers vs Asteroids
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (isColliding(lasers[i], asteroids[j])) {
                // Break asteroid
                breakAsteroid(asteroids[j]);
                
                // Remove asteroid and laser
                asteroids.splice(j, 1);
                lasers.splice(i, 1);
                
                // Check for new level
                if (asteroids.length === 0) {
                    newLevel();
                }
                
                break; // Move to next laser
            }
        }
    }
}

// --- Game UI ---

function drawUI() {
    // Draw Score
    ctx.fillStyle = 'white';
    ctx.font = '24px Poppins'; // Use new font
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);

    // Draw Lives
    ctx.textAlign = 'left';
    ctx.fillText(`Lives: ${lives}`, 20, 30);

    // Draw Game Over
    if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '50px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '20px Poppins';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        
        ctx.font = '16px Poppins';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);
        
        // Listen for restart
        if (keys[" "]) {
            newGame();
        }
    }
}

// --- Game Loop ---

function newGame() {
    ship = newShip();
    lives = MAX_LIVES;
    score = 0;
    invulnerabilityTime = SHIP_INVULN_DUR;
    isGameOver = false;
    createAsteroidBelt();
}

function newLevel() {
    invulnerabilityTime = SHIP_INVULN_DUR;
    createAsteroidBelt();
}

function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isGameOver) {
        // Update
        updateShip();
        updateLasers();
        updateAsteroids();
        
        // Check for collisions
        checkCollisions();

        // Draw
        drawShip();
        drawLasers();
        drawAsteroids();
    }
    
    // Draw UI (score, lives, game over)
    drawUI();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// --- Start Game ---
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    
    // Call the functions that were at the bottom of the file
    newGame();
    gameLoop();
});