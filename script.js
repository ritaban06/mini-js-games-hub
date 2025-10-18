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
    path: "games/meme_generator/index.html",
    icon: "😂",
    description: "Get your daily dose of memes! Fetch random memes dynamically from the API.",
    category: "Fun / Entertainment",
    duration: "Unlimited",
    tags: ["single player", "dynamic content", "API-driven", "fun"]
  },
  {
    name: "Number Guessing Game",
    path: "games/Number_Gussing_game/NGG.html",
    icon: "🤓",
    description: "Guess the number in lowest time",
    category: "Fun / Entertainment",
    duration: "Unlimited",
    tags: ["single player", "Solo", "Numbers", "fun"]
  },
  {
    name: "Sudoku Game",
    path: "games/sudoku/index.html",
    icon: "🤯",
    description: "Think the number with logic",
    category: "Classic / Skill",
    duration: "Unlimited",
    tags: ["single player", "Solo", "Numbers", "fun", "brain"]
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
  name: "Sunday Monday",
  path: "games/sunday-monday/index.html",
  icon: "📅",
  description: "Click the days of the week in correct order! Fun and interactive memory game.",
  category: "Memory / Fun",
  duration: "Quick play",
  tags: ["memory", "days", "fun", "simple", "interactive"]
}];

const container = document.getElementById("games-container");
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

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-theme');
  // themeToggle.textContent = '🌞'; // Removed changing button text on load
}

// Toggle on click
themeToggle.addEventListener('click', () => {
  // Toggle the class on body
  const isNowLight = body.classList.toggle('light-theme');
  // Persist the user's choice
  try {
    localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
  } catch (e) {
    // ignore localStorage errors (e.g., privacy mode)
  }
  // Do not change the button symbol/text per request — keep its existing content
});

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
window.addEventListener('scroll', updateScrollBtns);
window.addEventListener('resize', updateScrollBtns);
setTimeout(updateScrollBtns, 300); // Initial

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
if (scrollBottomBtn) {
  scrollBottomBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  });
}
