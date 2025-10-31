let score = 0;
let timeLeft = 60;
let gameInterval, timerInterval;
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const basket = document.getElementById('basket');

// basket state
let basketX = 130; // left position inside gameArea
const basketWidth = 60;

function updateBasketPosition(x) {
  const maxLeft = Math.max(0, gameArea.clientWidth - basketWidth);
  basketX = Math.max(0, Math.min(maxLeft, Math.round(x)));
  if (basket) basket.style.left = basketX + 'px';
}

// keyboard control for basket
document.addEventListener('keydown', (e) => {
  if (timeLeft <= 0) return;
  const step = 30;
  const left = parseInt(window.getComputedStyle(basket).getPropertyValue('left')) || basketX;
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    updateBasketPosition(left - step);
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    updateBasketPosition(left + step);
  }
});

// pointer controls
gameArea.addEventListener('pointermove', (e) => {
  if (e.buttons === 0) return; // only when pressed
  const rect = gameArea.getBoundingClientRect();
  const relX = e.clientX - rect.left - (basketWidth/2);
  updateBasketPosition(relX);
});
gameArea.addEventListener('pointerdown', (e) => {
  const rect = gameArea.getBoundingClientRect();
  const relX = e.clientX - rect.left - (basketWidth/2);
  updateBasketPosition(relX);
});

function startGame() {
  score = 0;
  timeLeft = 60;
  scoreDisplay.textContent = "Score: 0";
  timerDisplay.textContent = "Time: 60s";
  // remove any existing hearts but keep basket
  document.querySelectorAll('#gameArea .heart').forEach(h => h.remove());
  // ensure basket is present and reset position
  if (!basket) {
    const b = document.createElement('div');
    b.id = 'basket';
    b.textContent = '🧺';
    gameArea.appendChild(b);
  }
  updateBasketPosition(130);
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  gameInterval = setInterval(createHeart, 800);
  timerInterval = setInterval(updateTimer, 1000);
}

function createHeart() {
  if (timeLeft <= 0) return;

  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💖";
  const maxLeft = Math.max(0, gameArea.clientWidth - 30);
  const startLeft = Math.floor(Math.random() * maxLeft);
  heart.style.left = startLeft + "px";
  gameArea.appendChild(heart);

  // collision check interval for this heart
  const checkInterval = setInterval(() => {
    if (!heart.parentElement) {
      clearInterval(checkInterval);
      return;
    }
    const heartRect = heart.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    // if heart intersects basket area
    if (
      heartRect.left < basketRect.right &&
      heartRect.right > basketRect.left &&
      heartRect.bottom >= basketRect.top
    ) {
      // caught
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      heart.remove();
      clearInterval(checkInterval);
    }
  }, 40);

  // remove after animation ends (3s)
  setTimeout(() => {
    if (heart.parentElement) {
      heart.remove();
    }
    clearInterval(checkInterval);
  }, 3000);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    // remove hearts but keep basket
    document.querySelectorAll('#gameArea .heart').forEach(h => h.remove());
    alert(`💞 Time’s up! You caught ${score} hearts! 💖`);
  }
}
