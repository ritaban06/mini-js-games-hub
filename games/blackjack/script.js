// --- DOM Elements (verified with new HTML) ---
const instructionsOverlay = document.getElementById('instructions-overlay');
const startGameBtn = document.getElementById('start-game-btn');
const gameBoard = document.getElementById('game-board');
const dealerHandEl = document.getElementById('dealer-hand');
const playerHandEl = document.getElementById('player-hand');
const dealerScoreEl = document.getElementById('dealer-score');
const playerScoreEl = document.getElementById('player-score');
const statusMessageEl = document.getElementById('status-message');
const playerMoneyEl = document.getElementById('player-money');
const currentBetDisplay = document.getElementById('current-bet-display');
const bettingArea = document.getElementById('betting-area');
const actionsArea = document.getElementById('actions-area');
const replayArea = document.getElementById('replay-area');
const chips = document.getElementById('chips');
const dealBtn = document.getElementById('deal-btn');
const clearBetBtn = document.getElementById('clear-bet-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const doubleDownBtn = document.getElementById('double-down-btn');

// --- Game State Enum ---
const GAME_STATE = { BETTING: 'betting', PLAYER_TURN: 'player_turn', DEALER_TURN: 'dealer_turn', ROUND_OVER: 'round_over' };
let currentState = GAME_STATE.BETTING;

// --- Game Variables ---
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerMoney = 500;
let currentBet = 0;

// --- Event Listeners ---
startGameBtn.addEventListener('click', () => { instructionsOverlay.classList.add('hidden'); gameBoard.classList.remove('hidden'); });
dealBtn.addEventListener('click', deal);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);
doubleDownBtn.addEventListener('click', doubleDown);
chips.addEventListener('click', handleChipClick);
clearBetBtn.addEventListener('click', clearBet);
replayBtn.addEventListener('click', resetGame);

// --- Initialization ---
loadGame();

// --- Game Flow & State Management ---
function deal() {
    if (currentBet === 0) return;
    currentState = GAME_STATE.PLAYER_TURN;
    clearTable();
    
    saveGame();

    deck = createAndShuffleDeck();
    playerHand = [];
    dealerHand = [];

    // Staggered card dealing animation
    setTimeout(() => addCardToHand(playerHand, playerHandEl), 250);
    setTimeout(() => addCardToHand(dealerHand, dealerHandEl, true), 500);
    setTimeout(() => addCardToHand(playerHand, playerHandEl), 750);
    setTimeout(() => addCardToHand(dealerHand, dealerHandEl), 1000);
    
    setTimeout(() => {
        updateScores(true);
        toggleControls(false);
        if (getHandValue(playerHand) === 21) {
            updateStatus("Blackjack!");
            setTimeout(stand, 1000);
        } else {
            updateStatus("Your turn: Hit or Stand?");
        }
    }, 1100);
}

function hit() {
    if (currentState !== GAME_STATE.PLAYER_TURN) return;
    addCardToHand(playerHand, playerHandEl);
    updateScores();
    if (getHandValue(playerHand) > 21) {
        updateStatus("Bust! You lose.");
        endRound();
    }
}

function stand() {
    if (currentState !== GAME_STATE.PLAYER_TURN) return;
    currentState = GAME_STATE.DEALER_TURN;
    dealerTurn();
}

function doubleDown() {
    if (currentState !== GAME_STATE.PLAYER_TURN || playerMoney < currentBet) {
        updateStatus("Not enough money to double down!");
        return;
    }
    playerMoney -= currentBet;
    currentBet *= 2;
    updateMoneyDisplay();
    updateBetDisplay();
    addCardToHand(playerHand, playerHandEl);
    updateScores();
    if (getHandValue(playerHand) <= 21) {
        setTimeout(stand, 500);
    } else {
        updateStatus("Bust! You lose.");
        endRound();
    }
}

function dealerTurn() {
    revealDealerCard();
    updateScores();
    const dealerInterval = setInterval(() => {
        if (getHandValue(dealerHand) < 17) {
            addCardToHand(dealerHand, dealerHandEl);
            updateScores();
        } else {
            clearInterval(dealerInterval);
            determineWinner();
        }
    }, 1000);
}

function determineWinner() {
    const playerScore = getHandValue(playerHand);
    const dealerScore = getHandValue(dealerHand);
    const playerHasBlackjack = playerScore === 21 && playerHand.length === 2;

    if (playerHasBlackjack) {
        updateStatus("Blackjack! You win!");
        playerMoney += currentBet * 2.5;
    } else if (playerScore > 21) {
        updateStatus("You busted! Dealer wins.");
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        updateStatus("You win!");
        playerMoney += currentBet * 2;
    } else if (dealerScore > playerScore) {
        updateStatus("Dealer wins.");
    } else {
        updateStatus("Push (It's a tie).");
        playerMoney += currentBet;
    }
    endRound();
}

// REFACTORED: endRound now has a delay to show the win/loss message
function endRound() {
    currentState = GAME_STATE.ROUND_OVER;
    saveGame();

    // The win/loss message is already on screen from determineWinner()
    // Wait 2 seconds before resetting for the next round.
    setTimeout(() => {
        currentBet = 0;
        updateMoneyDisplay();
        updateBetDisplay();
        toggleControls(true); // Show betting controls
        dealBtn.textContent = "New Round"; // Change button text

        if (playerMoney <= 0) {
            updateStatus("Game Over! You're out of money.");
            bettingArea.classList.add('hidden');
            actionsArea.classList.add('hidden');
            replayArea.classList.remove('hidden');
        } else {
            // This message now appears AFTER the delay
            updateStatus("Place your bet for the next round.");
        }
    }, 2000); // 2-second delay
}

// --- Rendering (No Flicker) ---
function clearTable() {
    dealerHandEl.innerHTML = '';
    playerHandEl.innerHTML = '';
    dealerScoreEl.textContent = '0';
    playerScoreEl.textContent = '0';
}
function addCardToHand(hand, element, isHidden = false) {
    const card = deck.pop();
    hand.push(card);
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (isHidden) {
        cardEl.classList.add('hidden');
        cardEl.dataset.hidden = 'true';
    }
    const isRed = ['♥', '♦'].includes(card.suit);
    cardEl.classList.toggle('red', isRed);
    cardEl.innerHTML = `<span class="rank">${card.rank}</span><span class="suit">${card.suit}</span>`;
    element.appendChild(cardEl);
}
function revealDealerCard() {
    const hiddenCardEl = dealerHandEl.querySelector('[data-hidden="true"]');
    if (hiddenCardEl) {
        hiddenCardEl.classList.remove('hidden');
        hiddenCardEl.removeAttribute('data-hidden');
    }
}

// --- UI & Helper Functions ---
function updateScores(hideDealerScore = true) {
    playerScoreEl.textContent = getHandValue(playerHand);
    dealerScoreEl.textContent = hideDealerScore ? '?' : getHandValue(dealerHand);
}
function handleChipClick(event) {
    if (currentState !== GAME_STATE.BETTING && currentState !== GAME_STATE.ROUND_OVER) return;
    const chip = event.target.closest('.chip');
    if (chip) {
        const value = parseInt(chip.dataset.value);
        if (playerMoney >= value) {
            currentBet += value;
            playerMoney -= value;
            updateMoneyDisplay();
            updateBetDisplay();
        } else {
            updateStatus("Not enough money for that chip!");
        }
    }
}
function clearBet() {
    if (currentState !== GAME_STATE.BETTING && currentState !== GAME_STATE.ROUND_OVER) return;
    playerMoney += currentBet;
    currentBet = 0;
    updateMoneyDisplay();
    updateBetDisplay();
}
function updateBetDisplay() {
    currentBetDisplay.textContent = currentBet;
    dealBtn.disabled = currentBet === 0;
}
function updateMoneyDisplay() {
    playerMoneyEl.textContent = playerMoney;
}
function updateStatus(message) {
    statusMessageEl.textContent = message;
}
// REFACTORED: toggleControls no longer changes the status message
function toggleControls(showBetting) {
    bettingArea.classList.toggle('hidden', !showBetting);
    actionsArea.classList.toggle('hidden', showBetting);
    if (!showBetting) {
        doubleDownBtn.disabled = playerMoney < currentBet || playerHand.length !== 2;
    }
}

// --- Card & Deck Logic (Unchanged) ---
function createAndShuffleDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let newDeck = [];
    for (const suit of suits) { for (const rank of ranks) { newDeck.push({ suit, rank }); } }
    for (let i = newDeck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]; }
    return newDeck;
}
function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.rank)) return 10;
    if (card.rank === 'A') return 11;
    return parseInt(card.rank);
}
function getHandValue(hand) {
    let value = 0; let aceCount = 0;
    for (const card of hand) { value += getCardValue(card); if (card.rank === 'A') aceCount++; }
    while (value > 21 && aceCount > 0) { value -= 10; aceCount--; }
    return value;
}

// --- Save/Load & Reset ---
function saveGame() { localStorage.setItem('blackjack_money', playerMoney); }
function loadGame() {
    const savedMoney = localStorage.getItem('blackjack_money');
    playerMoney = savedMoney ? parseInt(savedMoney) : 500;
    updateMoneyDisplay();
    updateBetDisplay();
}
function resetGame() {
    playerMoney = 500;
    saveGame();
    clearBet();
    clearTable();
    replayArea.classList.add('hidden');
    toggleControls(true);
    dealBtn.textContent = "Deal";
    updateStatus("Place your bet to start a new game!");
    updateMoneyDisplay();
}