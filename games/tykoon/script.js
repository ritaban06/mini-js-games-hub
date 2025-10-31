// game.js (Add these constants and functions)

// --- DOM Element References ---
const gameContainer = document.getElementById('game-container');
const currentToolDisplay = document.getElementById('current-tool');
const buildButtons = document.querySelectorAll('.build-button');

// Resource Display Elements
const moneyDisplay = document.getElementById('money');
const oreDisplay = document.getElementById('ore');
const ingotsDisplay = document.getElementById('ingots');
const productDisplay = document.getElementById('product');

// Initial State (as defined in the previous response)
const GRID_SIZE = 10;
const TILE_WIDTH = 50;
const ENTITIES = { /* ... definitions ... */ }; // Need to include your ENTITIES object here
let resources = { money: 500, ore: 0, ingots: 0, product: 0 };
let gameMap = []; // ... initialization ...
let selectedBuilding = 'MINE'; // Default selected tool

// --- UI Update Function ---
function updateUI() {
    // 1. Update Resource Dashboard
    moneyDisplay.textContent = resources.money.toFixed(2);
    oreDisplay.textContent = resources.ore.toFixed(1);
    ingotsDisplay.textContent = resources.ingots.toFixed(1);
    productDisplay.textContent = resources.product;
    
    // 2. Update Tool Display
    currentToolDisplay.textContent = selectedBuilding;

    // 3. Update all tile visuals (necessary after production or placement)
    updateTileVisuals();
}

function updateTileVisuals() {
    // A slightly optimized way to update visuals without recreating the whole grid
    document.querySelectorAll('.grid-tile').forEach(tileEl => {
        const x = parseInt(tileEl.dataset.x);
        const y = parseInt(tileEl.dataset.y);
        const tile = gameMap[y][x];

        if (tile.type !== 'empty') {
            const entityDef = ENTITIES[tile.type];
            tileEl.style.backgroundColor = entityDef.color;
            tileEl.title = `${entityDef.name}\nOre: ${tile.state.storage.ore.toFixed(2)}`; 
        } else {
            tileEl.style.backgroundColor = '#333333';
            tileEl.title = 'Empty Tile';
        }
    });
}

// --- Building Selection Logic ---
buildButtons.forEach(button => {
    button.addEventListener('click', () => {
        const newTool = button.dataset.type;
        selectedBuilding = newTool;

        // Visual feedback for the active button
        buildButtons.forEach(btn => btn.classList.remove('active-tool'));
        button.classList.add('active-tool');
        
        updateUI();
    });
});

// --- Final Call ---
// Replace the previous renderGrid call with this setup:
function initializeGame() {
    // 1. Setup the 2D array gameMap (from previous blueprint)
    // [CODE HERE]
    
    // 2. Render the initial DOM grid
    // Ensure renderGrid function is in your game.js and working correctly
    renderGrid(); 
    
    // 3. Start the production loop
    // setInterval(runProductionCycle, 100); 
    
    // 4. Update UI with initial state
    updateUI(); 
}

// initializeGame();