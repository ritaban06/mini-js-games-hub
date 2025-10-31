const cloud = document.getElementById("cloud");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById('streak');
const multStatus = document.getElementById('multStatus');
let score = 0;
let gameRunning = true;

// timer
const timeLeftDisplay = document.getElementById('timeLeft');
const TOTAL_TIME = 60; // seconds
let timeRemaining = TOTAL_TIME;
let countdownInterval = null;

// combo / multiplier state
let streak = 0; // consecutive blue catches
let multiplier = 1; // current effective multiplier (1 or 2)
let multiplierActive = false;
let multiplierEnd = 0; // timestamp when multiplier expires

// Use dynamic sizes so movement clamps correctly on different screen sizes
function getBounds() {
  const areaRect = gameArea.getBoundingClientRect();
  const cloudWidth = cloud.offsetWidth || 60;
  return { areaLeft: areaRect.left, areaWidth: areaRect.width, cloudWidth };
}

// Update cloud horizontal position (x is left coordinate relative to gameArea)
function updateCloudPosition(x) {
  const { areaWidth, cloudWidth } = getBounds();
  const maxLeft = Math.max(0, areaWidth - cloudWidth - 2); // small padding
  const clamped = Math.max(0, Math.min(maxLeft, Math.round(x)));
  cloud.style.left = clamped + 'px';
}

// Keyboard movement (snappy)
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  // prevent arrow keys from scrolling the page
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
  const left = parseInt(window.getComputedStyle(cloud).getPropertyValue("left")) || 0;
  const step = 30; // snappy step
  if (e.key === "ArrowLeft" || e.key === 'a') {
    updateCloudPosition(left - step);
  } else if (e.key === "ArrowRight" || e.key === 'd') {
    updateCloudPosition(left + step);
  }
});

// Pointer (mouse/touch) controls — immediate and smooth
gameArea.addEventListener('pointermove', (e) => {
  if (!gameRunning) return;
  if (e.buttons === 0) return; // only move when user is actively pressing or touching
  const rect = gameArea.getBoundingClientRect();
  const relativeX = e.clientX - rect.left - (cloud.offsetWidth / 2);
  updateCloudPosition(relativeX);
});

// Also allow pointerdown to jump the cloud to that point
gameArea.addEventListener('pointerdown', (e) => {
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  const relativeX = e.clientX - rect.left - (cloud.offsetWidth / 2);
  updateCloudPosition(relativeX);
});

function createDrop() {
  if (!gameRunning) return;
  const drop = document.createElement("div");
  // weighted random: multiplier pickup rare, blue common, gray bad
  const r = Math.random();
  if (r < 0.06) {
    drop.classList.add('drop', 'mult');
  } else {
    const isBlue = r > 0.3;
    drop.classList.add("drop", isBlue ? "blue" : "gray");
  }

  // place drop somewhere inside game area
  const { areaWidth } = getBounds();
  const maxLeft = Math.max(0, areaWidth - 15);
  drop.style.left = Math.floor(Math.random() * maxLeft) + "px";
  gameArea.appendChild(drop);

  let fallInterval = setInterval(() => {
    let dropTop = parseInt(window.getComputedStyle(drop).getPropertyValue("top") || 0);
    if (dropTop > (gameArea.clientHeight - 20)) {
      drop.remove();
      clearInterval(fallInterval);
    } else {
      drop.style.top = dropTop + 5 + "px";
      checkCatch(drop, fallInterval);
    }
  }, 25);

  setTimeout(createDrop, Math.random() * 800 + 500);
}

function checkCatch(drop, interval) {
  const dropTop = parseInt(drop.style.top);
  const dropLeft = parseInt(drop.style.left);
  const cloudLeft = parseInt(window.getComputedStyle(cloud).getPropertyValue("left")) || 0;
  const cloudWidth = cloud.offsetWidth || 60;

  // only check when drop is near bottom of the area
  if (dropTop >= gameArea.clientHeight - 50 && dropLeft > cloudLeft - 10 && dropLeft < cloudLeft + cloudWidth) {
    if (drop.classList.contains("blue")) {
      // combo streak
      streak += 1;
      const extra = Math.max(0, streak - 1); // 2nd gives +1, 3rd +2, etc
      const base = 1;
      const points = (base + extra) * multiplier;
      score += points;
      updateSky();
      showFloatingText(dropLeft, dropTop, `+${points}`, '#2ecc71');
    } else if (drop.classList.contains('mult')) {
      // multiplier pickup: double points for 8s
      multiplierActive = true;
      multiplier = 2;
      multiplierEnd = Date.now() + 8000; // 8 seconds
      multStatus.textContent = `Multiplier: x${multiplier}`;
      showFloatingText(dropLeft, dropTop, 'x2 for 8s', '#ffd54f');
      // do not change streak on multiplier pickup
    } else {
      // gray drop (bad)
      streak = 0;
      score -= 2;
      showFloatingText(dropLeft, dropTop, '-2', '#ff4d4d');
    }

    // update UI
    scoreDisplay.textContent = `Score: ${score}`;
    streakDisplay.textContent = `Streak: ${streak}`;
    drop.remove();
    clearInterval(interval);
  }
}

// floating feedback
function showFloatingText(x, y, text, bg) {
  const el = document.createElement('div');
  el.className = 'floatText';
  el.textContent = text;
  el.style.left = (x) + 'px';
  el.style.top = (y) + 'px';
  el.style.background = bg || 'rgba(0,0,0,0.6)';
  gameArea.appendChild(el);
  // trigger transform on next frame
  requestAnimationFrame(() => {
    el.classList.add('float-up');
  });
  setTimeout(() => el.remove(), 800);
}

// check multiplier expiry periodically
setInterval(() => {
  if (multiplierActive && Date.now() > multiplierEnd) {
    multiplierActive = false;
    multiplier = 1;
    multStatus.textContent = `Multiplier: x${multiplier}`;
  }
}, 300);

function updateSky() {
  let colorValue = 180 + Math.min(score * 2, 70);
  document.body.style.background = `linear-gradient(to bottom, rgb(${colorValue},240,255), #f5f9ff)`;
}

function restartGame() {
  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  document.querySelectorAll(".drop").forEach(d => d.remove());
  // reset combo/multiplier UI
  streak = 0;
  multiplierActive = false;
  multiplier = 1;
  multiplierEnd = 0;
  streakDisplay.textContent = 'Streak: 0';
  multStatus.textContent = 'Multiplier: x1';
  // reset and start timer
  timeRemaining = TOTAL_TIME;
  updateTimeDisplay();
  startCountdown();
  createDrop();
}

function updateTimeDisplay() {
  if (!timeLeftDisplay) return;
  const m = Math.floor(timeRemaining / 60);
  const s = timeRemaining % 60;
  timeLeftDisplay.textContent = `Time Left: ${m}:${s.toString().padStart(2,'0')}`;
}

function startCountdown() {
  stopCountdown();
  countdownInterval = setInterval(() => {
    if (!gameRunning) {
      stopCountdown();
      return;
    }
    timeRemaining -= 1;
    if (timeRemaining <= 0) {
      timeRemaining = 0;
      updateTimeDisplay();
      // time's up — end the game
      gameRunning = false;
      // show final message in score area
      scoreDisplay.textContent = `Score: ${score} | Time's up!`;
      stopCountdown();
      return;
    }
    updateTimeDisplay();
  }, 1000);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

createDrop();
