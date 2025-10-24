// Maze Runner — simple, hand-written, educational implementation.
// - randomized depth-first maze generator
// - player moves by cell, collects coins, reaches exit to go to next level

(() => {
  // DOM
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const levelLabel = document.getElementById('level');
  const scoreLabel = document.getElementById('score');
  const restartBtn = document.getElementById('restart');
  const nextBtn = document.getElementById('nextLevel');

  // Game state
  let cols = 15; // starting size (will grow with levels)
  let rows = 15;
  let level = 1;
  let coinsCollected = 0;

  // grid
  let grid = [];
  let cellSize = 40; // computed

  // player
  let player = { r: 0, c: 0 };
  let exitCell = { r: 0, c: 0 };
  let coins = new Set(); // store as 'r,c' strings

  // Helpers
  function idx(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return -1;
    return r * cols + c;
  }

  function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Cell factory
  function makeCell(r, c) {
    return {
      r, c,
      walls: [true, true, true, true], // top,right,bottom,left
      visited: false
    };
  }

  // Maze generation using iterative DFS
  function generateMaze() {
    grid = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) grid.push(makeCell(r, c));
    }

    const stack = [];
    const start = grid[0];
    start.visited = true;
    stack.push(start);

    while (stack.length) {
      const current = stack[stack.length - 1];
      const { r, c } = current;
      const neighbors = [];

      // neighbors that are in bounds and not visited
      const check = [ [r-1,c,0,2], [r,c+1,1,3], [r+1,c,2,0], [r,c-1,3,1] ];
      for (const [nr,nc,wallIdx,opp] of check) {
        const i = idx(nr,nc);
        if (i !== -1 && !grid[i].visited) neighbors.push({cell:grid[i],wallIdx,opp});
      }

      if (neighbors.length) {
        const n = randChoice(neighbors);
        // knock down wall between current and chosen neighbor
        current.walls[n.wallIdx] = false;
        n.cell.walls[n.opp] = false;
        n.cell.visited = true;
        stack.push(n.cell);
      } else {
        stack.pop();
      }
    }
  }

  // Place coins on some open cells
  function plantCoins() {
    coins.clear();
    // target number depends on level and size
    const base = Math.max(3, Math.floor((rows * cols) / 40));
    const count = Math.min(12, base + level - 1);
    const pathCells = grid.filter(c => true); // all cells are reachable in this maze

    // pick random cells (not start, not exit)
    const forbidden = new Set([`0,0`, `${exitCell.r},${exitCell.c}`]);
    let tries = 0;
    while (coins.size < count && tries < rows*cols*8) {
      const c = randChoice(pathCells);
      const key = `${c.r},${c.c}`;
      if (!forbidden.has(key) && key !== `0,0` && !coins.has(key)) coins.add(key);
      tries++;
    }
    coinsCollected = 0;
    updateHUD();
  }

  // Initialize a level
  function initLevel() {
    // increase grid every few levels to make it harder
    const growth = Math.floor((level - 1) / 2);
    cols = 15 + growth * 2; // keep odd/even is not necessary here
    rows = 15 + growth * 2;

    // fit cell size to canvas
    const available = Math.min(canvas.width, canvas.height);
    cellSize = Math.floor(available / Math.max(rows, cols));
    if (cellSize < 12) cellSize = 12;

    generateMaze();

    // player starts top-left
    player = { r: 0, c: 0 };

    // exit at bottom-right
    exitCell = { r: rows - 1, c: cols - 1 };

    plantCoins();
    updateHUD();
    render();
  }

  // Draw the entire scene
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate( (canvas.width - cellSize*cols)/2, (canvas.height - cellSize*rows)/2 );

    // walls
    ctx.lineWidth = Math.max(2, Math.round(cellSize * 0.08));
    ctx.strokeStyle = '#dbeafe';
    for (const cell of grid) {
      const x = cell.c * cellSize;
      const y = cell.r * cellSize;
      // top
      if (cell.walls[0]) { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+cellSize,y); ctx.stroke(); }
      // right
      if (cell.walls[1]) { ctx.beginPath(); ctx.moveTo(x+cellSize,y); ctx.lineTo(x+cellSize,y+cellSize); ctx.stroke(); }
      // bottom
      if (cell.walls[2]) { ctx.beginPath(); ctx.moveTo(x+cellSize,y+cellSize); ctx.lineTo(x,y+cellSize); ctx.stroke(); }
      // left
      if (cell.walls[3]) { ctx.beginPath(); ctx.moveTo(x,y+cellSize); ctx.lineTo(x,y); ctx.stroke(); }
    }

    // coins
    for (const key of coins) {
      const [r,c] = key.split(',').map(Number);
      const cx = c*cellSize + cellSize/2;
      const cy = r*cellSize + cellSize/2;
      ctx.beginPath(); ctx.fillStyle = '#ffd166'; ctx.arc(cx,cy,Math.max(4,cellSize*0.18),0,Math.PI*2); ctx.fill();
      // small shine
      ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.arc(cx - cellSize*0.06, cy - cellSize*0.08, cellSize*0.05,0,Math.PI*2); ctx.fill();
    }

    // exit
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(exitCell.c*cellSize + cellSize*0.18, exitCell.r*cellSize + cellSize*0.18, cellSize*0.64, cellSize*0.64);

    // player
    const px = player.c*cellSize + cellSize/2;
    const py = player.r*cellSize + cellSize/2;
    ctx.beginPath(); ctx.fillStyle = '#8ec5ff'; ctx.arc(px,py,Math.max(6,cellSize*0.25),0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.fillStyle = '#0b1220'; ctx.arc(px,py,Math.max(3,cellSize*0.08),0,Math.PI*2); ctx.fill();

    ctx.restore();
  }

  // Update HUD
  function updateHUD() {
    levelLabel.textContent = `Level: ${level}`;
    scoreLabel.textContent = `Coins: ${coinsCollected}`;
  }

  // Move player if there's no wall
  function tryMove(dr, dc) {
    const r = player.r;
    const c = player.c;
    const i = idx(r,c);
    if (i === -1) return;
    const cell = grid[i];
    // map dr,dc to wall index: up( -1,0)->0, right(0,1)->1, down(1,0)->2, left(0,-1)->3
    let wallIdx = -1;
    if (dr === -1 && dc === 0) wallIdx = 0;
    if (dr === 0 && dc === 1) wallIdx = 1;
    if (dr === 1 && dc === 0) wallIdx = 2;
    if (dr === 0 && dc === -1) wallIdx = 3;
    if (wallIdx === -1) return;

    if (cell.walls[wallIdx]) {
      // blocked
      return;
    }

    const nr = r + dr;
    const nc = c + dc;
    if (idx(nr,nc) === -1) return;
    player.r = nr; player.c = nc;

    // collect coin?
    const key = `${nr},${nc}`;
    if (coins.has(key)) { coins.delete(key); coinsCollected++; updateHUD(); }

    // reached exit?
    if (nr === exitCell.r && nc === exitCell.c) {
      // small delay so player sees the exit
      setTimeout(() => { level++; initLevel(); }, 220);
    }

    render();
  }

  // Key handling
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return; // ignore holding repeat to keep movement crisp
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') tryMove(-1,0);
    if (key === 'arrowright' || key === 'd') tryMove(0,1);
    if (key === 'arrowdown' || key === 's') tryMove(1,0);
    if (key === 'arrowleft' || key === 'a') tryMove(0,-1);
  });

  // Buttons
  restartBtn.addEventListener('click', () => { initLevel(); });
  nextBtn.addEventListener('click', () => { level++; initLevel(); });

  // Resize canvas to be crisp on high-DPI
  function fixCanvasSize() {
    const ratio = window.devicePixelRatio || 1;
    const desired = Math.min(760, window.innerWidth - 40);
    canvas.width = Math.min(760, desired);
    canvas.height = canvas.width; // square
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    // scale for DPI
    canvas.width = Math.round(canvas.width * ratio);
    canvas.height = Math.round(canvas.height * ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }

  window.addEventListener('resize', () => { fixCanvasSize(); initLevel(); });

  // Kick off
  fixCanvasSize();
  initLevel();

})();
