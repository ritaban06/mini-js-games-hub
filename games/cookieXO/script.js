const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const resetBtn = document.getElementById("resetBtn");
const computerMsg = document.getElementById('computerMsg');
const choiceOverlay = document.getElementById('choiceOverlay');
const chooseCross = document.getElementById('chooseCross');
const chooseCircle = document.getElementById('chooseCircle');

let options = ["", "", "", "", "", "", "", "", ""];
let playerSymbol = null; // '✿' or '○'
let computerSymbol = null;
let playerTurn = true; // whether it's player's turn
let running = false; // starts false until player chooses

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", cellClicked));
resetBtn.addEventListener("click", resetGame);
chooseCross.addEventListener('click', () => startGameAs('✿'));
chooseCircle.addEventListener('click', () => startGameAs('○'));

function cellClicked() {
  if (!running || !playerTurn) return; // ignore clicks when it's computer's turn or game not running
  const index = this.getAttribute("data-index");
  if (options[index] !== "") return;
  placeSymbol(index, playerSymbol);
  if (!checkWinner(playerSymbol)) {
    // let computer think a bit
    playerTurn = false;
    statusText.textContent = "Computer is thinking...";
    setTimeout(() => {
      computerMove();
    }, 450);
  }
}

function placeSymbol(index, sym) {
  options[index] = sym;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  if (cell) {
    cell.textContent = sym;
    cell.style.color = sym === "✿" ? "#ff69b4" : "#6ecbff";
  }
}

function checkWinner(sym) {
  // returns true if sym just won (or if tie), and updates UI accordingly
  let won = false;
  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (options[a] && options[a] === options[b] && options[a] === options[c]) {
      won = true;
      break;
    }
  }

  if (won) {
    statusText.textContent = `${sym === '✿' ? '🩷 Cross' : '💙 Circle'} wins! 🎀`;
    running = false;
    return true;
  } else if (!options.includes("")) {
    statusText.textContent = "It’s a tie! 🧸";
    running = false;
    return true;
  }
  // game continues
  return false;
}

function resetGame() {
  options = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  // Show choice overlay again
  running = false;
  playerSymbol = null;
  computerSymbol = null;
  playerTurn = true;
  computerMsg.textContent = '';
  statusText.textContent = 'Pick a side to start the game';
  choiceOverlay.style.display = 'flex';
}

// Start game with player's chosen symbol
function startGameAs(sym) {
  playerSymbol = sym;
  computerSymbol = sym === '✿' ? '○' : '✿';
  options = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  running = true;
  // Cross starts by convention
  if (playerSymbol === '✿') {
    playerTurn = true;
    statusText.textContent = `Your turn — you are ${playerSymbol === '✿' ? '🩷 Cross' : '💙 Circle'}`;
  } else {
    playerTurn = false;
    statusText.textContent = `Computer starts — you are ${playerSymbol === '✿' ? '🩷 Cross' : '💙 Circle'}`;
    // let computer move first
    setTimeout(computerMove, 500);
  }
  choiceOverlay.style.display = 'none';
}

// Simple AI: try to win, block, take center, take corner, else random
function computerMove() {
  if (!running) return;
  // find available indices
  const avail = options.map((v,i)=> v===''?i:null).filter(v=>v!==null);
  let pick = null;

  // helper to test win for a symbol
  function wouldWin(sym, idx) {
    const copy = options.slice();
    copy[idx] = sym;
    for (const pattern of winPatterns) {
      const [a,b,c] = pattern;
      if (copy[a] && copy[a] === copy[b] && copy[a] === copy[c]) return true;
    }
    return false;
  }

  // try to win
  for (const i of avail) {
    if (wouldWin(computerSymbol, i)) { pick = i; break; }
  }
  // block player
  if (pick === null) {
    for (const i of avail) {
      if (wouldWin(playerSymbol, i)) { pick = i; break; }
    }
  }
  // center
  if (pick === null && avail.includes(4)) pick = 4;
  // corner
  const corners = [0,2,6,8];
  const availCorners = corners.filter(c=> avail.includes(c));
  if (pick === null && availCorners.length) pick = availCorners[Math.floor(Math.random()*availCorners.length)];
  // fallback random
  if (pick === null) pick = avail[Math.floor(Math.random()*avail.length)];

  // place
  placeSymbol(pick, computerSymbol);

  // computer messages
  const neutral = [
    `Computer: I place ${computerSymbol} at (${Math.floor(pick/3)+1}, ${pick%3+1}).`,
    `Computer moved — your turn.`
  ];
  const playful = [
    `Computer: Heh — I took that spot. Your move!`,
    `Computer: Boop! ${computerSymbol} is now there.`
  ];
  const competitive = [
    `Computer: Move made. Think you can stop me?`,
    `Computer: That's my claim. Your turn.`
  ];
  const apologetic = [
    `Computer: Oops, I placed ${computerSymbol} there. Your move.`,
    `Computer: Sorry, had to take that one — your turn.`
  ];

  // pick tone randomly
  const all = [neutral, playful, competitive, apologetic];
  const tone = all[Math.floor(Math.random()*all.length)];
  const msg = tone[Math.floor(Math.random()*tone.length)];
  computerMsg.textContent = msg;

  // check win/tie
  if (!checkWinner(computerSymbol)) {
    playerTurn = true;
    statusText.textContent = `Your turn — you are ${playerSymbol === '✿' ? '🩷 Cross' : '💙 Circle'}`;
  }
}
