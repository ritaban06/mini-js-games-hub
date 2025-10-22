document.addEventListener('DOMContentLoaded', function() {
    // Word categories with related words
    const wordCategories = {
        animals: ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'sheep', 'pig', 'chicken', 'duck', 'goose', 'rabbit', 'mouse', 'rat', 'elephant', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer', 'moose', 'squirrel', 'chipmunk', 'butterfly', 'bee', 'ant', 'spider', 'snake', 'frog', 'toad', 'turtle', 'lizard', 'crocodile', 'alligator'],
        food: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'cherry', 'peach', 'pear', 'plum', 'pineapple', 'mango', 'kiwi', 'lemon', 'lime', 'carrot', 'potato', 'tomato', 'onion', 'garlic', 'lettuce', 'spinach', 'broccoli', 'cauliflower', 'cucumber', 'pepper', 'eggplant', 'corn', 'peas', 'beans', 'rice', 'wheat', 'bread', 'pasta', 'pizza', 'burger', 'sandwich', 'soup', 'salad', 'cake', 'cookie', 'pie', 'ice cream', 'chocolate', 'candy'],
        technology: ['computer', 'phone', 'tablet', 'laptop', 'mouse', 'keyboard', 'screen', 'monitor', 'printer', 'scanner', 'camera', 'microphone', 'speaker', 'headphone', 'router', 'modem', 'server', 'database', 'software', 'program', 'code', 'algorithm', 'internet', 'web', 'browser', 'email', 'social media', 'app', 'game', 'robot', 'drone', 'smartphone', 'smartwatch', 'virtual reality', 'artificial intelligence', 'machine learning', 'blockchain', 'cryptocurrency', 'cloud', 'data'],
        colors: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'silver', 'gold', 'turquoise', 'violet', 'indigo', 'magenta', 'cyan', 'lime', 'maroon', 'navy', 'olive', 'teal', 'aqua', 'coral', 'crimson', 'fuchsia', 'khaki', 'lavender', 'plum', 'salmon', 'tan', 'beige', 'ivory', 'azure', 'chartreuse', 'emerald', 'ruby', 'sapphire', 'amber'],
        sports: ['football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf', 'hockey', 'volleyball', 'swimming', 'running', 'cycling', 'skiing', 'snowboarding', 'surfing', 'skateboarding', 'boxing', 'wrestling', 'karate', 'judo', 'fencing', 'archery', 'shooting', 'bowling', 'billiards', 'pool', 'darts', 'chess', 'checkers', 'poker', 'bridge', 'cricket', 'rugby', 'lacrosse', 'handball', 'badminton', 'squash', 'table tennis', 'track and field', 'marathon', 'triathlon'],
        countries: ['usa', 'canada', 'mexico', 'brazil', 'argentina', 'uk', 'france', 'germany', 'italy', 'spain', 'portugal', 'netherlands', 'belgium', 'switzerland', 'austria', 'poland', 'czech republic', 'hungary', 'romania', 'bulgaria', 'greece', 'turkey', 'russia', 'china', 'japan', 'south korea', 'india', 'australia', 'new zealand', 'egypt', 'south africa', 'nigeria', 'kenya', 'morocco', 'thailand', 'vietnam', 'philippines', 'indonesia', 'malaysia', 'singapore']
    };

    let currentCategory = '';
    let currentWords = [];
    let usedWords = [];
    let score = 0;
    let chainLength = 0;
    let timeLeft = 60;
    let timerInterval;
    let highScore = localStorage.getItem('wordChainHighScore') || 0;

    // DOM elements
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const wordInput = document.getElementById('word-input');
    const submitBtn = document.getElementById('submit-btn');
    const wordList = document.getElementById('word-list');
    const timeLeftEl = document.getElementById('time-left');
    const currentScoreEl = document.getElementById('current-score');
    const chainLengthEl = document.getElementById('chain-length');
    const finalScoreEl = document.getElementById('final-score');
    const finalChainEl = document.getElementById('final-chain');
    const highScoreEl = document.getElementById('high-score');

    // Category selection
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            startGame();
        });
    });

    // Submit word
    submitBtn.addEventListener('click', submitWord);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitWord();
        }
    });

    // Play again
    document.getElementById('play-again-btn').addEventListener('click', function() {
        startGame();
    });

    // Back to menu
    document.getElementById('back-to-menu-btn').addEventListener('click', function() {
        showSetup();
    });

    function startGame() {
        // Reset game state
        currentWords = [...wordCategories[currentCategory]];
        usedWords = [];
        score = 0;
        chainLength = 0;
        timeLeft = 60;

        // Pick random starting word
        const startIndex = Math.floor(Math.random() * currentWords.length);
        const startWord = currentWords.splice(startIndex, 1)[0];
        usedWords.push(startWord.toLowerCase());
        chainLength = 1;

        // Update UI
        wordList.innerHTML = `<span class="word">${startWord}</span>`;
        timeLeftEl.textContent = timeLeft;
        currentScoreEl.textContent = score;
        chainLengthEl.textContent = chainLength;
        wordInput.value = '';
        wordInput.focus();

        // Show game screen
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameOverScreen.style.display = 'none';

        // Start timer
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function submitWord() {
        const inputWord = wordInput.value.trim().toLowerCase();
        if (!inputWord) return;

        // Check if word is valid (in category and not used)
        if (currentWords.includes(inputWord) && !usedWords.includes(inputWord)) {
            // Valid word
            usedWords.push(inputWord);
            chainLength++;
            score += chainLength * 10; // Bonus for longer chains

            // Remove from available words
            const index = currentWords.indexOf(inputWord);
            currentWords.splice(index, 1);

            // Update UI
            wordList.innerHTML += ` → <span class="word">${inputWord}</span>`;
            currentScoreEl.textContent = score;
            chainLengthEl.textContent = chainLength;
            wordInput.value = '';

            // Check if no more words available
            if (currentWords.length === 0) {
                endGame();
            }
        } else {
            // Invalid word - show hint
            document.getElementById('hint-text').textContent = 'That word is not in this category or already used! Try another one.';
            setTimeout(() => {
                document.getElementById('hint-text').textContent = 'Think of words related to the category!';
            }, 2000);
        }
    }

    function updateTimer() {
        timeLeft--;
        timeLeftEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(timerInterval);

        // Calculate final score with time bonus
        const timeBonus = Math.max(0, timeLeft * 5);
        score += timeBonus;

        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('wordChainHighScore', highScore);
        }

        // Update UI
        finalScoreEl.textContent = score;
        finalChainEl.textContent = chainLength;
        highScoreEl.textContent = highScore;

        // Show game over screen
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'block';
    }

    function showSetup() {
        setupScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
    }

    // Initialize
    showSetup();
});