const games = [
  {
    name: "Simon Says",
    path: "games/Simon-Says-Game/index.html",
    icon: "🧠",
    description:
      "Challenge your memory and reflexes in this fast-paced color sequence game! Each round adds a new twist—can you keep up as the pattern grows? Perfect for puzzle lovers and focus masters seeking a brain-boosting thrill.",
    category: "Memory",
    duration: "Progressive",
    tags: ["memory", "focus", "puzzle", "challenge", "reflex", "brain-training"],
  }
  ,
  {
    name: "Tic Tac Toe",
    path: "games/tictactoe/index.html",
    icon: "❎",
    description:
      "Classic 3x3 strategy — outsmart your opponent before the grid fills up.",
    category: "Strategy",
    duration: "2 min rounds",
    tags: ["2 players", "grid", "classic"],
  },
  {
  name: "Quiz Game (MCQ)",
  path: "games/quiz-game/index.html",
  icon: "🧠",
  description: "Test your knowledge with interactive multiple-choice questions!",
  category: "Educational",
  duration: "Variable",
  tags: ["quiz", "education", "puzzle", "trivia"],
},

  {
    name: "Snake Game",
    path: "games/snake/index.html",
    icon: "🐍",
    description:
      "Guide the snake, snack on pixels, and avoid hitting the walls or yourself.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "retro", "keyboard"],
  },
  {
    name: "Memory Game",
    path: "games/memory/index.html",
    icon: "🧠",
    description:
      "Flip cards, remember emoji pairs, and clear the board in record time.",
    category: "Brain Teaser",
    duration: "5 min",
    tags: ["memory", "solo", "matching"],
  },
  {
    name: "Whack-a-Mole",
    path: "games/whack-a-mole/index.html",
    icon: "🔨",
    description:
      "Moles pop fast — keep your reflexes sharp to stack up the score.",
    category: "Arcade",
    duration: "30 sec",
    tags: ["reflex", "timed", "mouse"],
  },
  {
    name: "Reaction Timer",
    path: "games/reaction-timer/index.html",
    icon: "⚡",
    description:
      "Wait for green, tap quickly, and chase a new personal best reaction time.",
    category: "Reflex",
    duration: "Quick burst",
    tags: ["speed", "focus", "solo"],
  },
  {
    name: "Space Shooter",
    path: "games/space-shooter/index.html",
    icon: "🚀",
    description:
      "Fast-paced top-down shooter — dodge, weave and blast incoming waves.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "shooting", "keyboard"],
  },
  {
    name: "2048",
    path: "games/2048/index.html",
    icon: "🔢",
    description:
      "Slide tiles to combine numbers and reach 2048. A relaxing puzzle of strategy and luck.",
    category: "Puzzle",
    duration: "10-20 min",
    tags: ["puzzle", "singleplayer", "numbers"],
  },
  {
    name: "15 Puzzle",
    path: "games/15-puzzle/index.html",
    icon: "🔳",
    description:
      "Arrange the numbered tiles in order by sliding them into the empty space. Classic spatial puzzle.",
    category: "Puzzle",
    duration: "5-15 min",
    tags: ["puzzle", "tiles", "spatial"],
  },
  {
  name: "Endless Runner",
  path: "games/endless-runner/index.html",
  icon: "🏃‍♂️",
  description: "Run endlessly, dodge obstacles, and survive as the game speeds up!",
  category: "Arcade",
  duration: "Endless",
  tags: ["arcade", "runner", "reflex", "jump", "dodge"],
},

  {
    name: "Pong",
    path: "games/pong/index.html",
    icon: "🏓",
    description:
      "A tiny Pong clone — play against the CPU or another player. Use W/S and ↑/↓ to move paddles.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "retro", "multiplayer", "cpu"],
  },
  {
    name: "Kong fights ",
    path: "games/The Godzilla Fights game(html,css,js)/index.html",
    icon: "&#129421",
    description:
      "A exciting fighting game where two cartoon gorillas stand on opposite rooftops in a cityscape at sunset. The player (on the left) aims and throws a bomb at the computer opponent by dragging to set the angle and velocity",
    category: "Fighting",
    duration: "Endless",
    tags: ["Fighting", "Special", "multiplayer", "computer"],
  },
  {
    name: "Simon Says",
    path: "games/SimonSays/index.html",
    icon: "🧠",
    description:
      "A fun memory game where players repeat an increasingly complex sequence of colors.",
    category: "Memory",
    duration: "Progressive",
    tags: ["memory", "focus", "puzzle", "challenge"],
  },
  {
    name: "Typing Test",
    path: "games/typing-test/index.html",
    icon: "⌨️",
    description:
      "Test your typing speed and accuracy in 1 minute. Challenge yourself and improve!",
    category: "Skill",
    duration: "1 min",
    tags: ["typing", "speed", "accuracy", "skill"],
  },
  {
    name: "Balloon Pop",
    path: "games/balloon-pop/index.html",
    icon: "🎈",
    description: "Click the balloons before they float away! Pop as many as you can.",
    category: "Arcade",
    duration: "30 seconds",
    tags: ["arcade", "reflex", "clicker"],
  },
  {
    name: "Catch the Dot",
    path: "games/Catch_The_Dot/index.html",
    icon: "⚫",
    description:
      "Test your reflexes! Click the moving dot as many times as you can before time runs out.",
    category: "Reflex / Skill",
    duration: "30 seconds per round",
    tags: ["single player", "reaction", "fast-paced", "matte UI"],
  },
  {
  name: "Rock Paper Scissors",
  path: "games/rock-paper-scissors/index.html",
  icon: "✊📄✂️",
  description: "Classic hand game — challenge the computer in a best-of-three Rock, Paper, Scissors match.",
  category: "Strategy / Fun",
  duration: "1–2 min",
  tags: ["fun", "strategy", "classic", "singleplayer"]
  },

  {
  name: "FUNHUB - Meme Generator",

    name: "FUNHUB - Meme Generator",

    path: "games/meme_generator/index.html",

    icon: "😂",

    description: "Get your daily dose of memes! Fetch random memes dynamically from the API.",

    category: "Fun / Entertainment",

    duration: "Unlimited",

    tags: ["single player", "dynamic content", "API-driven", "fun"],

  },
{
  name: "Find the Hidden Object",
  path: "games/find-hidden-object/index.html",
  icon: "🔍",
  description: "Spot and click hidden items in cluttered scenes before time runs out!",
  category: "Puzzle",
  duration: "60 seconds",
  tags: ["puzzle", "hidden", "seek", "timed", "casual"]
},

  {
    name: "Color Guessing Game",
    path: "games/color-guessing-game/index.html",
    icon: "🎨",
    description: "Guess the correct color based on the RGB value shown — test your eyes and reflexes!",
    category: "Puzzle",
    duration: "30 seconds",
    tags: ["puzzle", "color", "rgb", "reflex", "visual"],
},


  {

    name: "Number Guessing Game",

    path: "games/Number_Gussing_game/NGG.html",

    icon: "🤓",

    description: "Guess the number in lowest time",

    category: "Fun / Entertainment",

    duration: "Unlimited",

    tags: ["single player", "Solo", "Numbers", "fun"],

},
  {
    name: "Word Scramble",
    path: "games/word-scramble/index.html",
    icon: "🔤",
    description: "Unscramble letters to form words before time runs out!",
    category: "Puzzle",
    duration: "Variable",
    tags: ["puzzle", "word", "timer", "logic"],
},


{
  name: "Link Game",
  path: "games/link-game/index.html",
  icon: "🔗",
  description: "Connect matching tiles before you run out of moves! A fun logic puzzle for quick thinkers.",
  category: "Puzzle",
  duration: "3–5 minutes",
  tags: ["puzzle", "memory", "logic", "connect"],
},
  {
    name: "Boom",
    path: "games/boom/index.html",
    icon: "💣",
    description: "Click the bombs before they explode! Test your reflexes and precision as difficulty increases with levels.",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reflex", "clicker", "speed"],
},
  {
    name: "FUNHUB - Meme Generator",
    path: "games/meme_generator/index.html",
    icon: "😂",
    description:
      "Get your daily dose of memes! Fetch random memes dynamically from the API.",
    category: "Fun / Entertainment",
    duration: "Unlimited",
    tags: ["single player", "dynamic content", "API-driven", "fun"],
  },
  {
    name: "Number Guessing Game",
    path: "games/Number_Guessing_Game/index.html",
    icon: "🤓",
    description: "Guess the secret number in the lowest number of tries!",
    category: "Fun / Entertainment",
    duration: "Unlimited",
    tags: ["numbers", "solo", "fun"],
  },
  {
    name: "Sudoku Game",
    path: "games/sudoku/index.html",
    icon: "🤯",
    description: "Use logic to fill the grid and solve the puzzle!",
    category: "Classic / Skill",
    duration: "Unlimited",
    tags: ["singleplayer", "numbers", "logic", "brain"],
  },
{
  name: "Coin Toss Simulator",
  path: "games/coin_toss_simulator/index.html",
  icon: "🪙",
  description: "A simple coin toss simulator. Will it be heads or tails?",
  category: "Fun / Simulation",
  duration: "Unlimited",
  tags: ["single player", "fun", "simulation"],
},
{
  name: "Connect Four",
  path: "games/Connect-four/index.html",
  icon: "🟡",
  description: "Form a line of four of your own coloured discs - Outsmart your opponent",
  category: "Strategy",
  duration: "5-10 min",
  tags: ["two-player", "grid", "classic"],
},
  {
    name: "Hangman",
    path: "games/hangman/index.html",
    icon: "🏗️",
    description: "Guess the word before you run out of attempts! Can you save the stickman?",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "word", "logic", "guessing"],
  },
  {
    name: "Frogger",
    path: "games/frogger/index.html",
    icon: "🐸",
    description: "Classic arcade game where you guide a frog across roads and rivers, avoiding obstacles and reaching safe zones.",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reaction", "strategy", "reflex"],
  },
  {
  name: "8 Ball Pool Billiards Multiplayer",
  path: "games/8-ball-pool/index.html",
  icon: "🎱",
  description: "Realistic local 2-player 8-ball pool with cue aiming, power meter and physics using Canvas.",
  category: "Arcade",
  duration: "5-15 minutes",
  tags: ["arcade","multiplayer","physics","canvas"]
},
  {
    name: "Tiny Fishing",
    path: "games/tiny-fishing/index.html",
    icon: "🎣",
    description: "Cast your line, catch fish, and upgrade your gear! A relaxing fishing challenge built with Canvas.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "fishing", "canvas", "upgrade", "relaxing"],
},
{
    name: "Grass Defense",
    path: "games/grass-defense/index.html",
    icon: "🌿",
    description: "Strategic tower defense! Place plants to defend your garden from pests.",
    category: "Strategy",
    duration: "Wave-based",
    tags: ["strategy", "defense", "canvas", "logic"],
  },
  {
    name: "Quote Generator",
    path: "games/quote/index.html",
    icon: "🗃️",
    description: "Generate your random quote",
    category: "Simple",
    duration: "Unlimited",
    tags: ["single-player", "quote", "classic"],
  },
  {
        name: "Color Clicker",
        path: "games/color-clicker/index.html",
        icon: "🎨", 
        description:
            "Click the color box as fast as you can to score points! Every click changes the color, testing your speed and focus.",
        category: "Arcade / Reflex",
        duration: "Endless",
        tags: ["reflex", "clicker", "solo", "color"],
  },
{
  name: "Odd One Out",
  path: "games/odd-one-out/index.html",
  icon: "🔍",
  description: "Find the odd emoji/ odd-coloured tile out from a group of similar ones!",
  category: "Puzzle",
  duration: "1 min",
  tags: ["single player", "puzzle", "emoji", "fun"],
},
{
  name: "Tap the Bubble",
  path: "games/tap-the-bubble/index.html",
  icon: "🫧",
  description: "Tap the bubbles as they appear to score points! How many can you pop?",
  category: "Arcade / Reflex",
  duration: "Endless",
  tags: ["reflex", "clicker", "solo", "bubble"],
},
{
  name: "Pixel Art Creator",
  path: "games/pixel-art-creator/index.html",
  icon: "🎨",
  description: "Create your own pixel art masterpieces on a 16x16 grid! Choose colors, paint, save, and export your creations.",
  category: "Creative",
  duration: "Unlimited",
  tags: ["creative", "art", "pixel", "canvas", "design"],
},
{
  name: "Word Chain Puzzle",
  path: "games/word-chain-puzzle/index.html",
  icon: "🔗",
  description: "Build word chains in different categories! Think fast and create the longest chain before time runs out.",
  category: "Word Puzzle",
  duration: "1 min rounds",
  tags: ["words", "puzzle", "vocabulary", "timer", "categories"],
},
{
  name: "Starry Night Sky",
  path: "games/starry-night-sky/index.html",
  icon: "🌟",
  description: "A calming relaxation game where you connect stars to form constellations. Enjoy ambient visuals and discover beautiful patterns in the night sky.",
  category: "Relaxation",
  duration: "Unlimited",
  tags: ["relaxation", "stars", "constellations", "meditative", "ambient", "puzzle"],
},
{
  name: "Precision Archer",
  path: "games/precision-archer/index.html",
  icon: "🏹",
  description: "Test your aiming skills with physics-based archery! Adjust power and angle, account for wind, and hit targets for maximum points.",
  category: "Skill",
  duration: "10 arrows",
  tags: ["archery", "physics", "aiming", "precision", "skill", "target"],
}
];const container = document.getElementById("games-container");
const searchInput = document.getElementById("game-search");
const emptyState = document.getElementById("empty-state");
const clearSearchButton = document.getElementById("clear-search");
const countTargets = document.querySelectorAll("[data-games-count]");
const latestTargets = document.querySelectorAll("[data-latest-game]");
const previewCount = document.querySelector("[data-preview-count]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

const latestGameName = games.length ? games[games.length - 1].name : "--";
countTargets.forEach((el) => {
  el.textContent = String(games.length);
});
latestTargets.forEach((el) => {
  el.textContent = latestGameName;
});

if (previewCount) {
  animateCount(previewCount, games.length, 920);
}

renderGames(games);

if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderGames(filterGames(searchInput.value));
  });
}

if (clearSearchButton) {
  clearSearchButton.addEventListener("click", () => {
    if (!searchInput) return;
    searchInput.value = "";
    searchInput.focus();
    renderGames(games);
  });
}

function renderGames(list) {
  container.innerHTML = "";

  if (!list.length) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  list.forEach((game, index) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.tabIndex = 0;
    card.dataset.name = game.name.toLowerCase();
    card.style.setProperty("--stagger", `${index * 60}ms`);

    card.innerHTML = `
      <div class="card-header">
        <span class="card-pill">${game.icon} ${game.category}</span>
        <span class="card-timing">${game.duration}</span>
      </div>
      <h3 class="card-title"><span>${game.icon}</span>${game.name}</h3>
      <p class="card-body">${game.description}</p>
      <div class="card-tags">
        ${game.tags.map((tag) => `<span>#${tag}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="play-button" href="${game.path}">Play now</a>
        <a class="play-link" href="${game.path}" target="_blank" rel="noopener noreferrer">Open in new tab →</a>
      </div>
    `;

    card.addEventListener("pointermove", handleCardTilt);
    card.addEventListener("pointerleave", resetCardTilt);
    card.addEventListener("focusout", resetCardTilt);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.open(game.path, "_blank", "noopener,noreferrer");
    });

    container.appendChild(card);
    observer.observe(card);
  });
}

function filterGames(rawTerm) {
  const term = rawTerm.trim().toLowerCase();
  if (!term) return games;

  return games.filter((game) => {
    const haystack = [
      game.name,
      game.category,
      game.description,
      ...game.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

function handleCardTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;
  const tiltX = (0.5 - relativeY) * 8;
  const tiltY = (relativeX - 0.5) * 8;
  card.style.setProperty("--tiltX", `${tiltX.toFixed(2)}deg`);
  card.style.setProperty("--tiltY", `${tiltY.toFixed(2)}deg`);
}

function resetCardTilt(event) {
  const card = event.currentTarget;
  card.style.setProperty("--tiltX", "0deg");
  card.style.setProperty("--tiltY", "0deg");
}

function animateCount(node, target, duration) {
  const start = Number(node.textContent) || 0;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const value = Math.round(start + (target - start) * eased);
    node.textContent = value.toString().padStart(2, "0");
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme with error handling
try {
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
  }
} catch (e) {
  // Default to dark theme if localStorage unavailable
  console.log('localStorage not available, using default theme');
}

// FIX: Combined theme toggle and scroll button logic (Keeping the more complete logic from the fix branch)
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // Toggle the class on body
    const isNowLight = body.classList.toggle('light-theme');
    
    // Persist the user's choice
    try {
      localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
    } catch (e) {
      // Ignore localStorage errors (e.g., privacy mode)
      console.log('Could not save theme preference');
    }
  });
}

// Scroll to Top/Bottom Buttons
const scrollTopBtn = document.getElementById('scroll-top');
const scrollBottomBtn = document.getElementById('scroll-bottom');

function updateScrollBtns() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const winH = window.innerHeight || document.documentElement.clientHeight;
  const docH = document.documentElement.scrollHeight;

  // Show top button if not at top (with some threshold)
  if (scrollTopBtn) {
    scrollTopBtn.style.display = scrollY > 200 ? 'block' : 'none';
  }

  // Show bottom button if not at bottom (with some threshold)
  if (scrollBottomBtn) {
    scrollBottomBtn.style.display = (scrollY + winH < docH - 200) ? 'block' : 'none';
  }
}

// Toggle on click
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  const isLight = body.classList.contains('light-theme');
  themeToggle.textContent = isLight
});
