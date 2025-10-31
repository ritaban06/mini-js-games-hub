const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const mixButton = document.getElementById('mix-button');
const resetButton = document.getElementById('reset-button');
const hintButton = document.getElementById('hint-button');
const nextLevelButton = document.getElementById('next-level-button');
const nextLevelButtonOverlay = document.getElementById('next-level-button-overlay');
const closeHintButton = document.getElementById('close-hint-button');
const instructionsOverlay = document.getElementById('instructions-overlay');
const levelCompleteOverlay = document.getElementById('level-complete-overlay');
const hintOverlay = document.getElementById('hint-overlay');
const explosionOverlay = document.getElementById('explosion-overlay');
const ingredientsContainer = document.getElementById('ingredients-container');
const effectsDisplay = document.getElementById('effects-display');
const recipeList = document.getElementById('recipe-list');
const cauldronLiquid = document.getElementById('cauldron-liquid');
const bubbles = document.getElementById('bubbles');

canvas.width = 600;
canvas.height = 400;

let gameRunning = false;
let currentLevel = 1;
let score = 0;
let potionsCreated = 0;
let draggedIngredient = null;
let ingredients = [];
let cauldronContents = [];
let discoveredRecipes = new Set();
let currentEffects = [];
let dragOffset = { x: 0, y: 0 };

// Ingredient definitions
const ingredientTypes = {
    herb: { emoji: '🌿', color: '#32cd32', name: 'Herb' },
    crystal: { emoji: '💎', color: '#9370db', name: 'Crystal' },
    essence: { emoji: '✨', color: '#ffd700', name: 'Essence' },
    powder: { emoji: '🧂', color: '#cd853f', name: 'Powder' }
};

const allIngredients = [
    { id: 'mandrake', name: 'Mandrake Root', type: 'herb', rarity: 'common' },
    { id: 'wolfsbane', name: 'Wolfsbane', type: 'herb', rarity: 'uncommon' },
    { id: 'nightshade', name: 'Nightshade', type: 'herb', rarity: 'rare' },
    { id: 'dragonscale', name: 'Dragon Scale', type: 'herb', rarity: 'legendary' },

    { id: 'amethyst', name: 'Amethyst', type: 'crystal', rarity: 'common' },
    { id: 'sapphire', name: 'Sapphire', type: 'crystal', rarity: 'uncommon' },
    { id: 'ruby', name: 'Ruby', type: 'crystal', rarity: 'rare' },
    { id: 'diamond', name: 'Diamond', type: 'crystal', rarity: 'legendary' },

    { id: 'fire', name: 'Fire Essence', type: 'essence', rarity: 'common' },
    { id: 'water', name: 'Water Essence', type: 'essence', rarity: 'uncommon' },
    { id: 'air', name: 'Air Essence', type: 'essence', rarity: 'rare' },
    { id: 'earth', name: 'Earth Essence', type: 'essence', rarity: 'legendary' },

    { id: 'salt', name: 'Sea Salt', type: 'powder', rarity: 'common' },
    { id: 'sulfur', name: 'Sulfur', type: 'powder', rarity: 'uncommon' },
    { id: 'mercury', name: 'Quicksilver', type: 'powder', rarity: 'rare' },
    { id: 'phoenix', name: 'Phoenix Ash', type: 'powder', rarity: 'legendary' }
];

// Recipe definitions
const recipes = {
    // Basic potions
    'healing': {
        ingredients: ['mandrake', 'amethyst', 'fire'],
        effects: ['Healing', 'Restoration'],
        color: '#ff6b6b',
        description: 'Restores health and vitality'
    },
    'strength': {
        ingredients: ['dragonscale', 'ruby', 'earth'],
        effects: ['Strength', 'Power'],
        color: '#4ecdc4',
        description: 'Grants immense physical strength'
    },
    'invisibility': {
        ingredients: ['nightshade', 'sapphire', 'air'],
        effects: ['Invisibility', 'Stealth'],
        color: '#45b7d1',
        description: 'Makes the drinker invisible'
    },
    'wisdom': {
        ingredients: ['wolfsbane', 'diamond', 'water'],
        effects: ['Wisdom', 'Knowledge'],
        color: '#f9ca24',
        description: 'Enhances intelligence and wisdom'
    },

    // Advanced potions
    'fire_breath': {
        ingredients: ['dragonscale', 'fire', 'sulfur'],
        effects: ['Fire Breath', 'Immunity'],
        color: '#e17055',
        description: 'Allows breathing fire and heat resistance'
    },
    'teleportation': {
        ingredients: ['phoenix', 'air', 'diamond'],
        effects: ['Teleportation', 'Speed'],
        color: '#a29bfe',
        description: 'Enables short-range teleportation'
    },
    'transformation': {
        ingredients: ['wolfsbane', 'mercury', 'earth'],
        effects: ['Transformation', 'Shape-shifting'],
        color: '#fd79a8',
        description: 'Allows changing physical form'
    },

    // Dangerous combinations
    'explosion': {
        ingredients: ['sulfur', 'fire', 'salt'],
        effects: ['Explosion', 'Destruction'],
        color: '#ff0000',
        description: 'Creates a massive explosion',
        dangerous: true
    },
    'poison': {
        ingredients: ['nightshade', 'mercury', 'wolfsbane'],
        effects: ['Poison', 'Death'],
        color: '#6c5ce7',
        description: 'Highly toxic poison',
        dangerous: true
    }
};

// Level configurations
const levels = [
    {
        availableIngredients: ['mandrake', 'amethyst', 'fire', 'salt'],
        targetRecipes: ['healing'],
        hint: "Try mixing Mandrake Root, Amethyst, and Fire Essence for a basic healing potion!"
    },
    {
        availableIngredients: ['mandrake', 'amethyst', 'fire', 'wolfsbane', 'sapphire', 'air'],
        targetRecipes: ['healing', 'invisibility'],
        hint: "Nightshade and Sapphire with Air Essence might reveal hidden potential..."
    },
    {
        availableIngredients: ['mandrake', 'amethyst', 'fire', 'wolfsbane', 'sapphire', 'air', 'dragonscale', 'ruby', 'earth'],
        targetRecipes: ['healing', 'invisibility', 'strength'],
        hint: "Dragon Scale with Ruby and Earth Essence could grant incredible power!"
    },
    {
        availableIngredients: ['mandrake', 'amethyst', 'fire', 'wolfsbane', 'sapphire', 'air', 'dragonscale', 'ruby', 'earth', 'diamond', 'water'],
        targetRecipes: ['healing', 'invisibility', 'strength', 'wisdom'],
        hint: "Diamond and Water Essence with Wolfsbane might unlock ancient knowledge..."
    },
    {
        availableIngredients: ['mandrake', 'amethyst', 'fire', 'wolfsbane', 'sapphire', 'air', 'dragonscale', 'ruby', 'earth', 'diamond', 'water', 'sulfur', 'phoenix'],
        targetRecipes: ['healing', 'invisibility', 'strength', 'wisdom', 'fire_breath', 'teleportation'],
        hint: "Experiment with Phoenix Ash and Sulfur for some explosive results!"
    }
];

// Initialize game
function initGame() {
    ingredients = [];
    cauldronContents = [];
    currentEffects = [];
    updateUI();
    createIngredients();
    updateRecipeBook();
}

// Create ingredient elements
function createIngredients() {
    ingredientsContainer.innerHTML = '';
    const levelIngredients = levels[Math.min(currentLevel - 1, levels.length - 1)].availableIngredients;

    levelIngredients.forEach(ingredientId => {
        const ingredient = allIngredients.find(i => i.id === ingredientId);
        if (ingredient) {
            const element = document.createElement('div');
            element.className = `ingredient ${ingredient.type}`;
            element.textContent = `${ingredientTypes[ingredient.type].emoji} ${ingredient.name}`;
            element.dataset.id = ingredient.id;
            element.draggable = true;

            // Add drag event listeners
            element.addEventListener('dragstart', handleDragStart);
            element.addEventListener('dragend', handleDragEnd);

            ingredientsContainer.appendChild(element);
            ingredients.push({ element, data: ingredient });
        }
    });
}

// Drag and drop handlers
function handleDragStart(e) {
    draggedIngredient = e.target;
    draggedIngredient.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';

    // Calculate offset for smooth dragging
    const rect = draggedIngredient.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
}

function handleDragEnd(e) {
    if (draggedIngredient) {
        draggedIngredient.classList.remove('dragging');
        draggedIngredient = null;
    }
}

// Cauldron drop zone
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

document.addEventListener('drop', (e) => {
    e.preventDefault();

    if (draggedIngredient) {
        const ingredientId = draggedIngredient.dataset.id;
        addToCauldron(ingredientId);
        draggedIngredient.style.opacity = '0.5';
        setTimeout(() => {
            draggedIngredient.style.opacity = '1';
        }, 200);
    }
});

// Add ingredient to cauldron
function addToCauldron(ingredientId) {
    const ingredient = allIngredients.find(i => i.id === ingredientId);
    if (ingredient && cauldronContents.length < 5) {
        cauldronContents.push(ingredient);
        updateCauldronVisual();
        updateEffects();
    }
}

// Update cauldron visual
function updateCauldronVisual() {
    const fillPercent = (cauldronContents.length / 5) * 100;
    cauldronLiquid.style.height = `${fillPercent}%`;

    // Update liquid color based on ingredients
    if (cauldronContents.length > 0) {
        const colors = cauldronContents.map(ing => ingredientTypes[ing.type].color);
        const avgColor = blendColors(colors);
        cauldronLiquid.style.background = `linear-gradient(180deg, ${avgColor}, ${darkenColor(avgColor)})`;
    }

    // Show bubbles when mixing
    if (cauldronContents.length > 0) {
        bubbles.style.display = 'block';
        createBubbles();
    } else {
        bubbles.style.display = 'none';
    }
}

// Create bubble animation
function createBubbles() {
    bubbles.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}px`;
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        bubbles.appendChild(bubble);
    }
}

// Blend colors for potion liquid
function blendColors(colors) {
    if (colors.length === 1) return colors[0];

    let r = 0, g = 0, b = 0;
    colors.forEach(color => {
        const rgb = hexToRgb(color);
        r += rgb.r;
        g += rgb.g;
        b += rgb.b;
    });

    r = Math.round(r / colors.length);
    g = Math.round(g / colors.length);
    b = Math.round(b / colors.length);

    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function darkenColor(color) {
    const rgb = hexToRgb(color);
    return `rgb(${Math.max(0, rgb.r - 50)}, ${Math.max(0, rgb.g - 50)}, ${Math.max(0, rgb.b - 50)})`;
}

// Update effects display
function updateEffects() {
    effectsDisplay.innerHTML = '';

    if (cauldronContents.length === 0) {
        effectsDisplay.innerHTML = '<p style="text-align: center; color: #888;">Add ingredients to see effects...</p>';
        return;
    }

    // Show current ingredients
    const ingredientsList = document.createElement('div');
    ingredientsList.innerHTML = '<h4>Current Ingredients:</h4>';
    cauldronContents.forEach(ing => {
        const item = document.createElement('div');
        item.className = 'effect-item';
        item.textContent = `${ingredientTypes[ing.type].emoji} ${ing.name}`;
        ingredientsList.appendChild(item);
    });
    effectsDisplay.appendChild(ingredientsList);

    // Show potential effects
    if (cauldronContents.length >= 2) {
        const potentialEffects = document.createElement('div');
        potentialEffects.innerHTML = '<h4>Potential Effects:</h4>';

        // Check for partial matches
        Object.entries(recipes).forEach(([recipeId, recipe]) => {
            const matchCount = recipe.ingredients.filter(ing =>
                cauldronContents.some(cauldronIng => cauldronIng.id === ing)
            ).length;

            if (matchCount > 0 && matchCount < recipe.ingredients.length) {
                const item = document.createElement('div');
                item.className = 'effect-item';
                item.innerHTML = `${matchCount}/${recipe.ingredients.length} ingredients for: <strong>${recipe.effects.join(', ')}</strong>`;
                if (recipe.dangerous) {
                    item.style.borderLeftColor = '#ff0000';
                    item.innerHTML += ' ⚠️ DANGEROUS';
                }
                potentialEffects.appendChild(item);
            }
        });

        if (potentialEffects.children.length > 1) {
            effectsDisplay.appendChild(potentialEffects);
        }
    }
}

// Mix potion
function mixPotion() {
    if (cauldronContents.length === 0) return;

    // Check for exact recipe matches
    let matchedRecipe = null;
    let bestMatch = 0;

    Object.entries(recipes).forEach(([recipeId, recipe]) => {
        const matchCount = recipe.ingredients.filter(ing =>
            cauldronContents.some(cauldronIng => cauldronIng.id === ing)
        ).length;

        if (matchCount === recipe.ingredients.length && matchCount === cauldronContents.length) {
            matchedRecipe = { id: recipeId, ...recipe };
        } else if (matchCount > bestMatch) {
            bestMatch = matchCount;
        }
    });

    if (matchedRecipe) {
        // Perfect match!
        discoveredRecipes.add(matchedRecipe.id);
        score += matchedRecipe.dangerous ? 50 : 100;
        potionsCreated++;

        showPotionResult(matchedRecipe);
        updateRecipeBook();

        // Check level completion
        checkLevelComplete();
    } else if (cauldronContents.length >= 3) {
        // Partial or experimental result
        const experimentalEffects = generateExperimentalEffects();
        score += 25;
        showPotionResult({
            effects: experimentalEffects,
            color: '#888888',
            description: 'Experimental mixture - unpredictable results!',
            experimental: true
        });
    } else {
        // Failed mixture
        showPotionResult({
            effects: ['Failed Mixture'],
            color: '#666666',
            description: 'Nothing interesting happened...',
            failed: true
        });
    }

    // Clear cauldron
    cauldronContents = [];
    updateCauldronVisual();
    updateEffects();
    updateUI();
}

// Generate experimental effects
function generateExperimentalEffects() {
    const effects = [
        'Strange Glow', 'Unusual Odor', 'Mild Sparkles', 'Gentle Humming',
        'Color Change', 'Temperature Shift', 'Light Vibration', 'Subtle Mist'
    ];

    const numEffects = Math.min(cauldronContents.length, 3);
    const shuffled = effects.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numEffects);
}

// Show potion result
function showPotionResult(result) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay-content" style="border-color: ${result.color}; box-shadow: 0 0 50px ${result.color}40;">
            <h2 style="color: ${result.color};">${result.dangerous ? '⚠️ DANGEROUS' : '✨'} Potion Created!</h2>
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 3em; margin: 20px 0;">🧪</div>
                <h3 style="color: ${result.color};">${result.effects.join(', ')}</h3>
                <p>${result.description}</p>
                ${result.experimental ? '<p style="color: #ffd700;">+25 Experimental Points!</p>' : ''}
                ${result.failed ? '<p style="color: #888;">Try different combinations...</p>' : ''}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: ${result.color};">Continue</button>
        </div>
    `;

    if (result.dangerous) {
        // Show explosion effect
        explosionOverlay.style.display = 'flex';
        setTimeout(() => {
            explosionOverlay.style.display = 'none';
        }, 500);
    }

    document.body.appendChild(overlay);
}

// Update recipe book
function updateRecipeBook() {
    recipeList.innerHTML = '';

    Object.entries(recipes).forEach(([recipeId, recipe]) => {
        const item = document.createElement('div');
        item.className = `recipe-item ${discoveredRecipes.has(recipeId) ? 'discovered' : ''}`;

        if (discoveredRecipes.has(recipeId)) {
            item.innerHTML = `<strong>${recipe.effects.join(', ')}</strong><br><small>${recipe.description}</small>`;
        } else {
            item.innerHTML = `<em>Unknown Recipe</em><br><small>??? (${recipe.ingredients.length} ingredients)</small>`;
        }

        recipeList.appendChild(item);
    });
}

// Check level completion
function checkLevelComplete() {
    const level = levels[Math.min(currentLevel - 1, levels.length - 1)];
    const discoveredTargets = level.targetRecipes.filter(recipe => discoveredRecipes.has(recipe));

    if (discoveredTargets.length === level.targetRecipes.length) {
        // Level complete!
        setTimeout(() => {
            showLevelComplete();
        }, 1000);
    }
}

// Show level complete
function showLevelComplete() {
    const level = levels[Math.min(currentLevel - 1, levels.length - 1)];
    const discoveredCount = level.targetRecipes.filter(recipe => discoveredRecipes.has(recipe)).length;

    document.getElementById('level-stats').innerHTML = `
        <p>Level ${currentLevel} Complete!</p>
        <p>Recipes Discovered: ${discoveredCount}/${level.targetRecipes.length}</p>
        <p>Total Score: ${score}</p>
        <p>Potions Created: ${potionsCreated}</p>
    `;

    const newRecipes = level.targetRecipes.filter(recipe => discoveredRecipes.has(recipe));
    if (newRecipes.length > 0) {
        document.getElementById('new-recipes').innerHTML = `
            <h3>New Recipes Unlocked:</h3>
            <ul>
                ${newRecipes.map(recipeId => `<li>${recipes[recipeId].effects.join(', ')}</li>`).join('')}
            </ul>
        `;
    }

    levelCompleteOverlay.style.display = 'flex';
}

// Update UI
function updateUI() {
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('potions').textContent = potionsCreated;
}

// Event listeners
startButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    gameRunning = true;
    initGame();
});

mixButton.addEventListener('click', mixPotion);

resetButton.addEventListener('click', () => {
    cauldronContents = [];
    updateCauldronVisual();
    updateEffects();
});

hintButton.addEventListener('click', () => {
    const level = levels[Math.min(currentLevel - 1, levels.length - 1)];
    document.getElementById('hint-text').textContent = level.hint;
    hintOverlay.style.display = 'flex';
});

closeHintButton.addEventListener('click', () => {
    hintOverlay.style.display = 'none';
});

nextLevelButton.addEventListener('click', () => {
    if (currentLevel < levels.length) {
        currentLevel++;
        initGame();
    }
});

nextLevelButtonOverlay.addEventListener('click', () => {
    levelCompleteOverlay.style.display = 'none';
    if (currentLevel < levels.length) {
        currentLevel++;
        initGame();
    }
});

// Initialize
updateRecipeBook();