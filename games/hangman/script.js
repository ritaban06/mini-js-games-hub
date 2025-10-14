const startButton = document.getElementById('start-button');
const wordDisplay = document.getElementById('word-display');
const keyboardEl = document.getElementById('keyboard');
const messageEl = document.getElementById('message');
const livesDisplay = document.querySelector('#lives-display span');
const scoreEl = document.getElementById('score');

//ADD WORDS IF YOU WANT
const ALL_WORDS = [
    "JAVASCRIPT", "PYTHON", "HTML", "CSS", "VANILLA", 
    "CODING", "PROGRAMMER", "GITHUB", "DEVELOPER", "WEBSITE",
    "COMPUTER", "LAPTOP", "KEYBOARD", "MONITOR", "MOUSE", 
    "INTERNET", "NETWORK", "ALGORITHM", "FRAMEWORK", "DATABASE",
    "APPLICATION", "SOFTWARE", "HARDWARE", "FUNCTION", "VARIABLE", 
    "CONSTANT", "PROJECT", "MODULE", "LIBRARY", "COMPONENT",
    "OPEN SOURCE", "COMMUNITY", "CONTRIBUTION", "PULL REQUEST", "VERSION CONTROL",
    "REACT", "ANGULAR", "VUE", "NEXTJS", "NUXT", "SVELTE", "TYPESCRIPT"
];


let currentWord = '';
let guessedLetters = [];
let lives = 0;
let score = 0;
let gameActive = false;

let usedWords = [];

const MAX_LIVES = 6;
const STARTING_REVEAL_COUNT_BASE = 2;


startButton.addEventListener('click', startGame);

function chooseWord() {
    const availableWords = ALL_WORDS.filter(word => !usedWords.includes(word));
    
    if (availableWords.length === 0) {
        usedWords = [];
        return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
    }

    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    usedWords.push(newWord);

    return newWord;
}

function isWordGuessed() {
    return currentWord.split('').every(char => char === ' ' || guessedLetters.includes(char));
}

function renderWord() {
    const display = currentWord.split('')
        .map(char => {
            if (char === ' ') return ' ';
            return guessedLetters.includes(char) ? char : '_';
        })
        .join(' ');
    wordDisplay.textContent = display;
    
    if (isWordGuessed()) {
        endGame(true);
    }
}

function renderKeyboard() {
    keyboardEl.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.dataset.letter = letter;
        button.addEventListener('click', handleGuess);

        if (guessedLetters.includes(letter)) {
             button.disabled = true;
             button.classList.add('correct'); 
        }

        keyboardEl.appendChild(button);
    }
}

function revealStartingLetters(word) {
    const wordLength = word.replace(/\s/g, '').length;

    const dynamicRevealCount = Math.floor(STARTING_REVEAL_COUNT_BASE + Math.random() * (wordLength / 2));
    
    const letters = word.split('').filter(char => char !== ' ');
    const uniqueLetters = Array.from(new Set(letters));
    
    uniqueLetters.sort(() => 0.5 - Math.random());
    
    const finalRevealCount = Math.min(dynamicRevealCount, uniqueLetters.length); 

    const lettersToReveal = uniqueLetters.slice(0, finalRevealCount);
    
    lettersToReveal.forEach(letter => {
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
        }
    });
    
    messageEl.textContent = `Start guessing! ${finalRevealCount} letters were revealed.`;
}

function updateLives() {
    livesDisplay.textContent = lives;
    if (lives <= 0) {
        endGame(false);
    }
}

function handleGuess(event) {
    if (!gameActive) return;

    const button = event.target;
    const letter = button.dataset.letter;
    
    if (guessedLetters.includes(letter)) return;

    button.disabled = true;
    
    if (currentWord.includes(letter)) {
        guessedLetters.push(letter);
        button.classList.add('correct');
        messageEl.textContent = `Yes, the word contains '${letter}'!`;
        renderWord(); 
    } else {
        lives--;
        button.classList.add('incorrect');
        messageEl.textContent = `No, the word does not contain '${letter}'.`;
        updateLives();
    }
}

function startGame() {
    gameActive = true;
    startButton.disabled = true;
    
    currentWord = chooseWord(); 
    
    if (usedWords.length === 1 && ALL_WORDS.length > 1) {
        messageEl.textContent = `Starting new cycle!`;
    }

    guessedLetters = [];
    lives = MAX_LIVES;

    revealStartingLetters(currentWord); 
    
    updateLives();
    renderWord();
    renderKeyboard();
}

function endGame(win) {
    gameActive = false;
    startButton.disabled = true; 
    
    Array.from(keyboardEl.querySelectorAll('button')).forEach(btn => btn.disabled = true);

    if (win) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
        messageEl.textContent = `🎉 You Win! The word was "${currentWord}". Next word in 2 seconds...`;
        
        setTimeout(startGame, 2000); 

    } else {
        score = 0; 
        scoreEl.textContent = `Score: ${score}`;
        
        messageEl.textContent = `😭 Game Over! The word was "${currentWord}". Click "New Word" to try again.`;
        startButton.disabled = false; 
    }
}

renderKeyboard();