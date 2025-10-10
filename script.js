const games = [
  {
    name: "Tic Tac Toe",
    path: "games/tictactoe/index.html",
    icon: "❎",
    description: "Classic 3x3 strategy — outsmart your opponent before the grid fills up.",
    category: "Strategy",
    duration: "2 min rounds",
    tags: ["2 players", "grid", "classic"],
  },
  {
    name: "Snake Game",
    path: "games/snake/index.html",
    icon: "🐍",
    description: "Guide the snake, snack on pixels, and avoid hitting the walls or yourself.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "retro", "keyboard"],
  },
  {
    name: "Memory Game",
    path: "games/memory/index.html",
    icon: "🧠",
    description: "Flip cards, remember emoji pairs, and clear the board in record time.",
    category: "Brain Teaser",
    duration: "5 min",
    tags: ["memory", "solo", "matching"],
  },
  {
    name: "Whack-a-Mole",
    path: "games/whack-a-mole/index.html",
    icon: "🔨",
    description: "Moles pop fast — keep your reflexes sharp to stack up the score.",
    category: "Arcade",
    duration: "30 sec",
    tags: ["reflex", "timed", "mouse"],
  },
  {
    name: "Reaction Timer",
    path: "games/reaction-timer/index.html",
    icon: "⚡",
    description: "Wait for green, tap quickly, and chase a new personal best reaction time.",
    category: "Reflex",
    duration: "Quick burst",
    tags: ["speed", "focus", "solo"],
  },
  {
    name: "Space Shooter",
    path: "games/space-shooter/index.html",
    icon: "🚀",
    description: "Fast-paced top-down shooter — dodge, weave and blast incoming waves.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "shooting", "keyboard"],
    name: "2048",
    path: "games/2048/index.html",
    icon: "🔢",
    description: "Slide tiles to combine numbers and reach 2048. A relaxing puzzle of strategy and luck.",
    category: "Puzzle",
    duration: "10-20 min",
    tags: ["puzzle", "singleplayer", "numbers"],
  },
  {
    name: "15 Puzzle",
    path: "games/15-puzzle/index.html",
    icon: "🔳",
    description: "Arrange the numbered tiles in order by sliding them into the empty space. Classic spatial puzzle.",
    category: "Puzzle",
    duration: "5-15 min",
    tags: ["puzzle", "tiles", "spatial"],
  },
  {
    name: "Pong",
    path: "games/pong/index.html",
    icon: "🏓",
    description: "A tiny Pong clone — play against the CPU or another player. Use W/S and ↑/↓ to move paddles.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "retro", "multiplayer", "cpu"],
  },


  
  {
  name: "Flappy Bird",
  path: "games/flappy_bird/index.html",
  icon: "🐤",
  description: "Tap or press SPACE to fly through pipes and beat your high score!",
  category: "Arcade",
  duration: "Endless",
  tags: ["arcade", "reflex", "gravity", "fun"],
},



];

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
