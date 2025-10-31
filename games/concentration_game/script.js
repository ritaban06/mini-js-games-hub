// game.js

const gameBoard = document.querySelector('.memory-game');
const movesDisplay = document.querySelector('.score');
const resetButton = document.querySelector('.reset-button');

// --- Game State Variables ---
let hasFlippedCard = false;
let lockBoard = false; // Flag to prevent rapid clicks during animation/delay
let firstCard, secondCard;
let totalMoves = 0;
let matchesFound = 0;

// The card images and their duplicates
const cardImages = [
    'star', 'planet', 'rocket', 'comet', 'satellite', 'ufo',
    'star', 'planet', 'rocket', 'comet', 'satellite', 'ufo'
]; 
// Total cards: 12. Total pairs: 6.

// --- 1. Game Setup and Card Creation ---

function createBoard() {
    // Shuffle the cards before creating the DOM elements
    const shuffledCards = shuffleArray(cardImages);

    shuffledCards.forEach(imageName => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-framework', imageName); // Store the identity

        card.innerHTML = `
            <div class="front-face"><img src="images/${imageName}.png" alt="${imageName}"></div>
            <div class="back-face"></div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 2. Event Handling: The Flip Function ---

function flipCard() {
    if (lockBoard) return; // Ignore click if board is locked
    if (this === firstCard) return; // Ignore double-click on the same card

    this.classList.add('is-flipped');

    if (!hasFlippedCard) {
        // First card flipped
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second card flipped
    secondCard = this;
    totalMoves++;
    movesDisplay.textContent = `Moves: ${totalMoves}`;

    checkForMatch();
}

// --- 3. Match Logic ---

function checkForMatch() {
    const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // Cards match! Remove their click event listeners
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matchesFound++;
    resetBoard();
    
    if (matchesFound === cardImages.length / 2) {
        // Win Condition: All pairs found
        setTimeout(() => alert(`Congratulations! You won in ${totalMoves} moves!`), 500);
    }
}

function unflipCards() {
    lockBoard = true; // Lock the board during the delay

    // Use setTimeout to create the required delay before flipping back
    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetBoard();
    }, 1200); // 1.2 second delay
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// --- 4. Game Reset Functionality ---

function resetGame() {
    // Clear the board
    gameBoard.innerHTML = '';
    
    // Reset state variables
    totalMoves = 0;
    matchesFound = 0;
    movesDisplay.textContent = 'Moves: 0';
    resetBoard(); 
    
    // Recreate and shuffle the cards
    createBoard();
}

// Attach reset function to the button
resetButton.addEventListener('click', resetGame);

// Initial game start
createBoard();