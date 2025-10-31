const games = [
  {
    name: "Simon Says",
    path: "games/Simon-Says-Game/index.html",
    icon: "🧠",
    description:
      "Challenge your memory and reflexes in this fast-paced color sequence game! Each round adds a new twist—can you keep up as the pattern grows? Perfect for puzzle lovers and focus masters seeking a brain-boosting thrill.",
    category: "Memory",
    duration: "Progressive",
    tags: [
      "memory",
      "focus",
      "puzzle",
      "challenge",
      "reflex",
      "brain-training",
    ],
  },
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
    name: "Tap Challenge",
    path: "games/tap-challenge/index.html",
    icon: "🖱️",
    description:
      "A fast-paced reaction game where you tap the button as many times as possible before time runs out. Test your speed and reflexes!",
    category: "Arcade",
    duration: "20 seconds",
    tags: ["arcade", "reaction", "reflex", "clicker", "timed"],
  },
  {
    name: "Emoji Battle Arena",
    path: "games/emoji-battle-arena/index.html",
    icon: "🪄",
    description:
      "Fast-paced multiplayer arena where players control emoji characters, move around, and attack opponents. Last emoji standing wins!",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["multiplayer", "arcade", "emoji", "action", "battle"],
  },
  {
    name: "Quick Math Battle Quiz",
    path: "games/quick-math-battle-quiz/index.html",
    icon: "🧮",
    description:
      "A fast-paced math quiz game. Solve arithmetic questions (addition, subtraction, multiplication, division) before the timer runs out. Tracks score and speed for a fun and educational challenge.",
    category: "Puzzle",
    duration: "Timed",
    tags: ["puzzle", "quiz", "math", "logic", "speed"],
  },
  {
    name: "Reaction Duel",
    path: "games/reaction-duel/index.html",
    icon: "⚡",
    description:
      "A fast-paced two-player reaction game. Press your key as fast as possible after the signal appears!",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reflex", "two-player", "keyboard"],
  },
  {
    name: "Lights Out",
    path: "games/lights-out/index.html",
    icon: "💡",
    description: "Turn off all lights by toggling your moves wisely!",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "logic", "brain", "strategy"],
  },
  {
    name: "Brick Breaker",
    path: "games/brick-breaker/index.html",
    icon: "🧱",
    description:
      "A classic arcade game where the player controls a paddle to deflect a ball and destroy a wall of colored bricks.",
    category: "Arcade",
    duration: "Short/Medium",
    tags: ["arcade", "classic", "physics", "canvas"],
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
    name: "Simon color memory game",
    path: "games/simon_game/index.html",
    icon: "🧠",
   description: "Test your memory and quick thinking in this dynamic color pattern challenge! Each round adds a new twist to the sequence. Ideal for puzzle enthusiasts and sharp minds craving a stimulating mental workout.",
    category: "Memory",
    duration: "Progressive",
    tags: [
      "memory",
      "focus",
      "puzzle",
      "challenge",
      "reflex",
      "brain-training",
    ],
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
    name: "Falling Leaves Collector",
    path: "games/falling-leaves-collector/index.html",
    icon: "🍂",
    description:
      "Collect falling leaves before they hit the ground. Test your reflexes and hand-eye coordination, and try to get the highest score!",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reflex", "clicker", "catch", "reaction"],
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
    name: "Math Challenge",
    path: "games/math-challenge/index.html",
    icon: "🧮",
    description:
      "Test your arithmetic skills with addition, subtraction, multiplication, and division against the clock!",
    category: "Puzzle",
    duration: "60 seconds",
    tags: ["math", "puzzle", "arithmetic", "timed", "logic"],
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
    name: "Spot the Difference",
    path: "games/spot-the-difference/index.html",
    icon: "🔍",
    description:
      "Find all the differences between two images before time runs out! Test your observation and attention to detail.",
    category: "Puzzle",
    duration: "60 seconds",
    tags: ["puzzle", "observation", "attention", "clicker", "challenge"],
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
    description:
      "Run endlessly, dodge obstacles, and survive as the game speeds up!",
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
    name: "Avoid the Blocks",
    path: "games/avoid-the-blocks/index.html",
    icon: "⬛",
    description:
      "A fast-paced obstacle-avoidance game. Dodge falling blocks as long as possible. Tests reflexes and timing with increasing difficulty.",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reflex", "dodging", "timing"],
  },
  {
    name: "Emoji Match Game",
    path: "games/Emoji Match Game/index.html", // Updated path
    icon: "🧩",
    description:
      "A fun and addictive memory game! Flip cards to reveal emojis and match pairs. Track your moves and time—can you finish with the fewest moves?",
    category: "Memory",
    duration: "Unlimited",
    tags: ["memory", "puzzle", "matching", "logic", "brain-training", "fun"],
  },

  {
    name: "The Godzilla Fights game", // Updated name based on folder
    path: "games/The Godzilla Fights game(html,css,js)/index.html",
    icon: "&#129421",
    description:
      "A exciting fighting game where two cartoon gorillas stand on opposite rooftops in a cityscape at sunset. The player (on the left) aims and throws a bomb at the computer opponent by dragging to set the angle and velocity",
    category: "Fighting",
    duration: "Endless",
    tags: ["Fighting", "Special", "multiplayer", "computer"],
  },
  {
    name: "Color Switch Challenge",
    path: "games/color-switch-challenge/index.html",
    icon: "🎨",
    description:
      "A fast-paced game where you navigate a ball through rotating obstacles, matching its color. Test your reflexes and timing!",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "reflex", "timing", "color", "challenge"],
  },

  {
    name: "SimonSays", // Kept folder name due to duplicate name
    path: "games/SimonSays/index.html",
    icon: "🧠",
    description:
      "A fun memory game where players repeat an increasingly complex sequence of colors.",
    category: "Memory",
    duration: "Progressive",
    tags: ["memory", "focus", "puzzle", "challenge"],
  },
  {
    name: "Color Sequence Memory",
    path: "games/Color Sequence Memory/index.html", // Updated path
    icon: "🎨",
    description:
      "Test your memory by following the color sequence shown on the screen. Repeat the pattern correctly to advance through increasingly challenging levels.",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "memory", "sequence", "logic", "challenge"],
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
    description:
      "Click the balloons before they float away! Pop as many as you can.",
    category: "Arcade",
    duration: "30 seconds",
    tags: ["arcade", "reflex", "clicker"],
  },
  {
    name: "Minesweeper",
    path: "games/minesweeper/index.html",
    icon: "💣",
    description:
      "A classic Minesweeper game. Clear the grid without detonating mines. Numbers indicate how many mines are adjacent to a square.",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "logic", "grid", "strategy"],
  },

  {
    name: "Catch The Dot", // Updated name based on folder
    path: "games/Catch_The_Dot/index.html",
    icon: "⚫",
    description:
      "Test your reflexes! Click the moving dot as many times as you can before time runs out.",
    category: "Reflex / Skill",
    duration: "30 seconds per round",
    tags: ["single player", "reaction", "fast-paced", "matte UI"],
  },
  {
    name: "Emoji Pop Quiz",
    path: "games/Emoji Pop Quiz/index.html", // Updated path
    icon: "📝",
    description:
      "A fun and interactive quiz game. Guess the word, phrase, movie, or song from emoji combinations. Challenges your emoji interpretation skills and provides instant feedback.",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "quiz", "emoji", "brain-teaser", "logic"],
  },

  {
    name: "Rock Paper Scissors",
    path: "games/rock-paper-scissors/index.html",
    icon: "✊📄✂️",
    description:
      "Classic hand game — challenge the computer in a best-of-three Rock, Paper, Scissors match.",
    category: "Strategy / Fun",
    duration: "1–2 min",
    tags: ["fun", "strategy", "classic", "singleplayer"],
  },

  {
    name: "Meme Generator", // Updated name based on folder
    path: "games/meme_generator/index.html",
    icon: "😂",
    description:
      "Get your daily dose of memes! Fetch random memes dynamically from the API.",
    category: "Fun / Entertainment",
    duration: "Unlimited",
    tags: ["single player", "dynamic content", "API-driven", "fun"],
  },
  {
    name: "Find the Hidden Object",
    path: "games/find-hidden-object/index.html",
    icon: "🔍",
    description:
      "Spot and click hidden items in cluttered scenes before time runs out!",
    category: "Puzzle",
    duration: "60 seconds",
    tags: ["puzzle", "hidden", "seek", "timed", "casual"],
  },

  {
    name: "Color Guessing Game",
    path: "games/color-guessing-game/index.html",
    icon: "🎨",
    description:
      "Guess the correct color based on the RGB value shown — test your eyes and reflexes!",
    category: "Puzzle",
    duration: "30 seconds",
    tags: ["puzzle", "color", "rgb", "reflex", "visual"],
  },

  {
    name: "Click Combo Quiz", // Updated name based on folder
    path: "games/click-combo-quiz/index.html", // Updated path (was click_combo_game_quiz)
    icon: "⚡",
    description:
      "Speed + knowledge challenge! Click the correct answers to build combos and score high.",
    category: "Arcade / Quiz",
    duration: "Timed",
    tags: ["quiz", "combo", "reaction", "clicker", "fast"],
  },

  {
    name: "Number Gussing Game", // Updated name based on folder
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
    description:
      "Connect matching tiles before you run out of moves! A fun logic puzzle for quick thinkers.",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["arcade", "reflex", "clicker", "speed"],
  },
  {
    name: "Number Guessing Game", // Kept specific name due to folder name difference
    path: "games/Number_Guessing_Game/index.html", // Updated path
    icon: "🤓",
    description: "Guess the secret number in the lowest number of tries!",
    category: "Fun / Entertainment",
    duration: "Unlimited",
    tags: ["numbers", "solo", "fun"],
  },
  {
    name: "Sudoku", // Updated name
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
    name: "Fruit Slicer",
    path: "games/fruit-slicer/index.html",
    icon: "🍎",
    description:
      "Form a line of four of your own coloured discs - Outsmart your opponent",
    category: "Strategy",
    duration: "5-10 min",
    tags: ["two-player", "grid", "classic"],
  },
  {
    name: "Hangman",
    path: "games/hangman/index.html",
    icon: "🏗️",
    description:
      "Guess the word before you run out of attempts! Can you save the stickman?",
    category: "Puzzle",
    duration: "Unlimited",
    tags: ["puzzle", "word", "logic", "guessing"],
  },
  {
    name: "Frogger",
    path: "games/Frogger/index.html", // Updated path
    icon: "🐸",
    description:
      "Classic arcade game where you guide a frog across roads and rivers, avoiding obstacles and reaching safe zones.",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reaction", "strategy", "reflex"],
  },
  {
    name: "8 Ball Pool", // Updated name
    path: "games/8-ball-pool/index.html",
    icon: "🎱",
    description:
      "Realistic local 2-player 8-ball pool with cue aiming, power meter and physics using Canvas.",
    category: "Arcade",
    duration: "5-15 minutes",
    tags: ["arcade", "multiplayer", "physics", "canvas"],
  },
  {
    name: "Tiny Fishing",
    path: "games/tiny-fishing/index.html",
    icon: "🎣",
    description:
      "Cast your line, catch fish, and upgrade your gear! A relaxing fishing challenge built with Canvas.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "fishing", "canvas", "upgrade", "relaxing"],
  },
  {
    name: "Grass Defense",
    path: "games/grass-defense/index.html",
    icon: "🌿",
    description:
      "Strategic tower defense! Place plants to defend your garden from pests.",
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
    description:
      "Find the odd emoji/ odd-coloured tile out from a group of similar ones!",
    category: "Puzzle",
    duration: "1 min",
    tags: ["single player", "puzzle", "emoji", "fun"],
  },
  {
    name: "Tap the Bubble",
    path: "games/tap-the-bubble/index.html",
    icon: "🫧",
    description:
      "Tap the bubbles as they appear to score points! How many can you pop?",
    category: "Arcade / Reflex",
    duration: "Endless",
    tags: ["reflex", "clicker", "solo", "bubble"],
  },
  {
    name: "Pixel Art Creator",
    path: "games/pixel-art-creator/index.html",
    icon: "🎨",
    description:
      "Create beautiful pixel art on a 16x16 grid! Choose colors, draw, save your creations, and export as images.",
    category: "Creative",
    duration: "Unlimited",
    tags: ["art", "creative", "pixel", "drawing", "solo"],
  },
  {
    name: "Word Chain Puzzle",
    path: "games/word-chain-puzzle/index.html",
    icon: "🔗",
    description:
      "Build chains of related words in different categories with difficulty levels! Start with a word and find the next one starting with the last letter. Features hints, sound effects, and high score tracking.",
    category: "Puzzle",
    duration: "1 min rounds",
    tags: [
      "puzzle",
      "words",
      "vocabulary",
      "timed",
      "brain-teaser",
      "difficulty",
      "hints",
    ],
  },
  {
    name: "Starry Night Sky",
    path: "games/starry-night-sky/index.html",
    icon: "🌌",
    description:
      "A relaxing meditation game where you connect stars to form constellations. Features ambient music, breathing guide, and achievement system for mindful star gazing.",
    category: "Relaxation",
    duration: "Unlimited",
    tags: [
      "relaxation",
      "meditation",
      "stars",
      "constellations",
      "mindfulness",
      "ambient",
      "breathing",
    ],
  },
  {
    name: "Precision Archer",
    path: "games/precision-archer/index.html",
    icon: "🏹",
    description:
      "Test your aiming skills in this physics-based archery game! Adjust power and angle, account for wind effects, and hit moving targets for maximum points.",
    category: "Skill",
    duration: "10-15 min",
    tags: [
      "archery",
      "physics",
      "precision",
      "aiming",
      "wind",
      "targets",
      "skill-based",
    ],
  },
  {
    name: "Color Switch",
    path: "games/color-switch/index.html",
    icon: "🎨",
    description:
      "A fast-paced color-matching platformer! Switch the ball's color to match rotating platforms and survive as long as possible. Features smooth animations and increasing difficulty.",
    category: "Arcade",
    duration: "Endless",
    tags: [
      "color-matching",
      "platformer",
      "timing",
      "reflexes",
      "endless",
      "mobile-friendly",
    ],
  },
  {
    name: "ShadowShift",
    path: "games/shadowshift/index.html",
    icon: "🕶️",
    description:
      "Stealth puzzle: drag blocker panels to reshape shadows and sneak past lights to the goal.",
    category: "Puzzle",
    duration: "3-5 min",
    tags: ["single player", "stealth", "puzzle", "logic", "drag-and-drop"],
  },
  // --- Added Games Below ---
  {
    name: "Peglinko",
    path: "games/peglinko/index.html", // Corrected path from ' peglinko'
    icon: "🎯",
    description:
      "Drop balls and watch them bounce through pegs to score points.",
    category: "Arcade",
    duration: "Endless",
    tags: ["physics", "luck", "casual"],
  },
  {
    name: "Asteroids",
    path: "games/asteroids/index.html",
    icon: "☄️",
    description:
      "Blast asteroids and avoid collisions in this classic space shooter.",
    category: "Arcade",
    duration: "Endless",
    tags: ["space", "shooter", "retro"],
  },
  {
    name: "Breakout",
    path: "games/breakout/index.html",
    icon: "🧱",
    description: "Use a paddle to break bricks with a bouncing ball.",
    category: "Arcade",
    duration: "Level-based",
    tags: ["classic", "paddle", "retro"],
  },
  {
    name: "Bubble Shooter",
    path: "games/bubble-shooter/index.html",
    icon: "🫧",
    description: "Shoot bubbles to match colors and clear the board.",
    category: "Puzzle",
    duration: "Level-based",
    tags: ["matching", "shooter", "puzzle"],
  },
  {
    name: "Color Squid Puzzle",
    path: "games/color-squid-puzzle/index.html",
    icon: "🦑",
    description: "Solve color-based puzzles in sequence.",
    category: "Puzzle",
    duration: "Level-based",
    tags: ["color", "sequence", "logic"],
  },
  {
    name: "Cozy Blocks",
    path: "games/cozy-blocks/index.html",
    icon: "🧱",
    description: "Stack blocks as high as you can.",
    category: "Arcade",
    duration: "Endless",
    tags: ["stacking", "timing", "casual"],
  },
  {
    name: "Dodge the Blocks",
    path: "games/Dodge-the-blocks/index.html",
    icon: "🧱",
    description: "Move left and right to dodge falling blocks.",
    category: "Arcade",
    duration: "Endless",
    tags: ["reflex", "dodging", "simple"],
  },
  {
    name: "Doodle Jump",
    path: "games/doodle-jump/index.html",
    icon: "⬆️",
    description: "Jump up platforms endlessly.",
    category: "Arcade",
    duration: "Endless",
    tags: ["jumping", "platformer", "casual"],
  },
  {
    name: "Fruit Catcher",
    path: "games/fruit_catcher/index.html",
    icon: "🍎",
    description: "Catch falling fruits in your basket.",
    category: "Arcade",
    duration: "Lives-based",
    tags: ["catching", "reflex", "casual"],
  },
  {
    name: "Fruits",
    path: "games/fruits/index.html",
    icon: "🍓",
    description: "Control a basket to catch falling fruits.",
    category: "Arcade",
    duration: "Lives-based",
    tags: ["catching", "arrows", "simple"],
  },
  {
    name: "Island Survival",
    path: "games/island-survival/index.html",
    icon: "🏝️",
    description: "Make choices to survive on a deserted island.",
    category: "Simulation",
    duration: "Turns",
    tags: ["survival", "text-based", "choices"],
  },
  {
    name: "Line Game",
    path: "games/line-game/index.html",
    icon: "⚡",
    description: "Avoid falling obstacles while moving your line.",
    category: "Arcade",
    duration: "Endless",
    tags: ["dodging", "reflex", "minimalist"],
  },
  {
    name: "Maiolike Block Puzzle",
    path: "games/maiolike-block-puzzle/index.html",
    icon: "🧩",
    description: "Fit Tetris-like blocks onto a grid.",
    category: "Puzzle",
    duration: "Endless",
    tags: ["puzzle", "blocks", "grid"],
  },
  {
    name: "Merge Lab",
    path: "games/merge-lab/index.html",
    icon: "🧪",
    description: "Merge items of the same level to create higher levels.",
    category: "Puzzle",
    duration: "Endless",
    tags: ["merge", "puzzle", "casual"],
  },
  {
    name: "Minesweeper Clone",
    path: "games/minesweeper-clone/index.html",
    icon: "💣",
    description: "A clone of the classic Minesweeper game.",
    category: "Puzzle",
    duration: "Variable",
    tags: ["logic", "classic", "grid"],
  },
  {
    name: "Mole Whacking", // Used folder name
    path: "games/mole whacking/index.html",
    icon: "🔨",
    description: "Whack moles as they pop out of holes.",
    category: "Arcade",
    duration: "Timed",
    tags: ["reflex", "timed", "clicker"],
  },
  {
    name: "Rock Scissor Paper", // Used folder name
    path: "games/Rock_Scissor_Paper/index.html",
    icon: "✊✋✌️",
    description: "Play Rock Paper Scissors against the computer.",
    category: "Strategy / Fun",
    duration: "Rounds",
    tags: ["classic", "luck", "simple"],
  },
  {
    name: "Shadow Catcher",
    path: "games/shadow-catcher/index.html",
    icon: "👻",
    description: "Identify the object casting the moving shadow.",
    category: "Puzzle",
    duration: "Rounds",
    tags: ["visual", "puzzle", "timed"],
  },
  {
    name: "Stack Tower",
    path: "games/stack-tower/index.html",
    icon: "🗼",
    description: "Stack blocks perfectly to build the tallest tower.",
    category: "Arcade",
    duration: "Endless",
    tags: ["stacking", "timing", "precision"],
  },
  {
    name: "Tetris",
    path: "games/tetris/index.html",
    icon: "🧱",
    description: "Classic Tetris block stacking game.",
    category: "Puzzle",
    duration: "Endless",
    tags: ["classic", "blocks", "puzzle"],
  },
  {
    name: "TileMan.io",
    path: "games/tileman/index.html",
    icon: "🟩",
    description: "Claim tiles by moving around the grid, avoid enemies.",
    category: "Arcade",
    duration: "Endless",
    tags: ["io-game", "territory", "multiplayer-sim"],
  },
  {
    name: "Tower Defense",
    path: "games/tower-defense/index.html",
    icon: "🏰",
    description: "Place towers to defend against waves of enemies.",
    category: "Strategy",
    duration: "Wave-based",
    tags: ["strategy", "defense", "towers"],
  },
  {
    name: "Two Zero Four Eight", // Used folder name
    path: "games/two_zero_four_eight/index.html",
    icon: "🔢",
    description: "Slide and merge tiles to reach the 2048 tile.",
    category: "Puzzle",
    duration: "Variable",
    tags: ["puzzle", "numbers", "logic"],
  },
  {
    name: "Words of Wonders",
    path: "games/words-of-wonders/index.html",
    icon: "🧩",
    description: "Form words from given letters to fill a crossword.",
    category: "Puzzle",
    duration: "Level-based",
    tags: ["word", "puzzle", "crossword"],
  },
  {
    name: "Worlds Easiest Game",
    path: "games/worlds-easiest-game/index.html",
    icon: "😜",
    description: "A deceptively simple (or maybe just simple?) game.",
    category: "Fun",
    duration: "Instant",
    tags: ["simple", "fun", "casual"],
  },
  {
    name: "Tap Reveal",
    path: "games/tap-reveal/index.html",
    icon: "❓",
    description: "Tap cards to reveal and match pairs.",
    category: "Memory",
    duration: "Timed",
    tags: ["memory", "matching", "puzzle"],
  },
  // Newly added games from the folder list
  {
    name: "Blink Catch",
    path: "games/blink-catch/index.html",
    icon: "⚡",
    description: "Click the blinking icon as fast as you can before it moves!",
    category: "Reflex",
    duration: "Endless",
    tags: ["reflex", "speed", "clicker"],
  },
  {
    name: "Boom",
    path: "games/boom/index.html",
    icon: "💣",
    description: "Click the bombs before they explode!",
    category: "Arcade",
    duration: "Level-based",
    tags: ["arcade", "clicker", "reflex"],
  },
  {
    name: "Burger Builder",
    path: "games/burger-builder/index.html",
    icon: "🍔",
    description: "Assemble the burger ingredients in the correct order.",
    category: "Puzzle",
    duration: "Quick",
    tags: ["puzzle", "food", "sequence"],
  },
  {
    name: "Catch the Ball",
    path: "games/catch-the-ball/index.html",
    icon: "🎯",
    description: "Click the moving ball to score points.",
    category: "Arcade",
    duration: "Timed",
    tags: ["arcade", "reflex", "clicker"],
  },
  {
    name: "Catch the Falling Emoji",
    path: "games/catch-the-falling-emoji/index.html",
    icon: "🎯",
    description: "Catch the target emoji falling from the sky.",
    category: "Arcade",
    duration: "Lives-based",
    tags: ["arcade", "catching", "reflex", "emoji"],
  },
  {
    name: "Catch the Stars",
    path: "games/catch-the-stars/index.html",
    icon: "🌟",
    description: "Control a catcher to collect falling stars.",
    category: "Arcade",
    duration: "Lives-based",
    tags: ["arcade", "catching", "reflex", "stars"],
  },
  {
    name: "Clicker Farmer",
    path: "games/Clicker Farmer/index.html",
    icon: "🧑‍🌾",
    description: "Plant crops, harvest them, and expand your farm.",
    category: "Simulation",
    duration: "Endless",
    tags: ["clicker", "farming", "simulation", "idle"],
  },
  {
    name: "Color Catch",
    path: "games/color catch/index.html",
    icon: "🎯",
    description: "Click circles matching the target color.",
    category: "Arcade",
    duration: "Timed",
    tags: ["arcade", "reflex", "color", "clicker"],
  },
  {
    name: "Color Merge",
    path: "games/color-merge/index.html",
    icon: "🎨",
    description: "Merge blocks of the same color to reach the target.",
    category: "Puzzle",
    duration: "Endless",
    tags: ["puzzle", "merge", "color", "casual"],
  },
  {
    name: "Connect Four",
    path: "games/Connect-four/index.html",
    icon: "🔴🟡",
    description: "Drop discs to connect four in a row.",
    category: "Strategy",
    duration: "Variable",
    tags: ["strategy", "two-player", "classic", "grid"],
  },
  {
    name: "Emoji Connect",
    path: "games/emoji-connect/index.html",
    icon: "🧩",
    description: "Connect matching emojis without overlapping lines.",
    category: "Puzzle",
    duration: "Variable",
    tags: ["puzzle", "emoji", "connecting", "logic"],
  },
  {
    name: "Fast Finger Maze",
    path: "games/fast-finger-maze/index.html",
    icon: "👉",
    description: "Navigate a maze using arrow keys before time runs out.",
    category: "Arcade",
    duration: "Timed",
    tags: ["maze", "arcade", "speed", "keyboard"],
  },
  {
    name: "Logic Grid",
    path: "games/logic-grid/index.html",
    icon: "🧩",
    description: "Fill the grid based on logical clues.",
    category: "Puzzle",
    duration: "Variable",
    tags: ["puzzle", "logic", "grid", "brain-teaser"],
  },
  {
    name: "Memory Flip Game",
    path: "games/Memory-Game/index.html",
    icon: "🧠",
    description: "Flip cards to find matching emoji pairs.",
    category: "Memory",
    duration: "Variable",
    tags: ["memory", "puzzle", "matching", "emoji"],
  },
  {
    name: "Number Pop",
    path: "games/Number-Pop/index.html",
    icon: "#️⃣",
    description: "Click only the even numbers before they disappear.",
    category: "Arcade",
    duration: "Timed",
    tags: ["arcade", "reflex", "numbers", "clicker"],
  },
  {
    name: "Painting Rush",
    path: "games/painting-rush/index.html",
    icon: "🎨",
    description: "Quickly paint the targets before time runs out.",
    category: "Arcade",
    duration: "Timed",
    tags: ["arcade", "speed", "painting", "clicker"],
  },
  {
    name: "Shape Rotation Puzzle",
    path: "games/shape-rotation-puzzle/index.html",
    icon: "🔄",
    description: "Rotate and place falling shapes (like Tetris).",
    category: "Puzzle",
    duration: "Endless",
    tags: ["puzzle", "blocks", "rotation", "classic"],
  },
  {
    name: "Star Jump",
    path: "games/star-jump/index.html",
    icon: "⭐",
    description: "Jump between stars, avoid black holes.",
    category: "Arcade",
    duration: "Endless",
    tags: ["arcade", "jumping", "platformer", "space"],
  },
  {
    name: "Tap Pop Clouds",
    path: "games/tap-pop-clouds/index.html",
    icon: "☁️",
    description: "Tap the rising clouds before they float away.",
    category: "Arcade",
    duration: "Lives-based",
    tags: ["arcade", "clicker", "reflex", "casual"],
  },
  {
    name: "Tower of Hanoi",
    path: "games/tower-of-hanoi/index.html",
    icon: "🗼",
    description: "Move disks between pegs following the rules.",
    category: "Puzzle",
    duration: "Variable",
    tags: ["puzzle", "logic", "strategy", "classic"],
  },
  {
    name: "Trivia Showdown",
    path: "games/trivia-showdown/index.html",
    icon: "❓",
    description: "Answer trivia questions from various categories.",
    category: "Quiz",
    duration: "Variable",
    tags: ["quiz", "trivia", "knowledge"],
  },
  {
    name: "Underwater Diver",
    path: "games/underwater-diver/index.html",
    icon: "🤿",
    description: "Swim through an underwater world, avoid obstacles, collect pearls, and survive as long as possible.",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade","reflex","action","underwater","diver"],
  },
  {
    name: "Knife Thrower",
    path: "games/knife-thrower/index.html",
    icon: "🔪",
    description: "Throw knives at a rotating board. Avoid hitting stuck knives and survive as long as possible!",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "reflex", "action", "skill"],
  },
  {
  name: "Light Orb Quest",
  path: "games/light-orb-quest/index.html",
  icon: "🔆",
  description: "Navigate a glowing orb through dark ruins — light reveals only nearby tiles. Find treasures, avoid traps and solve light-based puzzles.",
  category: "Puzzle",
  duration: "Varies",
  tags: ["puzzle","exploration","stealth","light","arcade"],
  },
  {
  name: "Mirror Math",
  path: "games/mirror-math/index.html",
  icon: "🪞",
  description: "Decode mirrored/rotated arithmetic equations before time runs out. Practice visual rotation, pattern recognition, and quick math.",
  category: "Puzzle",
  duration: "Varies",
  tags: ["puzzle", "math", "visual", "rotation", "brain-train"],
},
{
  name: "Math Rush — Addition Challenge",
  path: "games/math-rush/index.html",
  icon: "➕",
  description: "Solve quick addition problems before time runs out! Test your reflexes and accuracy.",
  category: "Math",
  duration: "10 seconds per round",
  tags: ["math", "addition", "speed", "challenge", "fun"],
},
{
  name: "Blackjack",
  path: "games/blackjack/index.html",
  description: "A classic card game where the goal is to get closer to 21 than the dealer. Features betting, doubling down, and a polished UI.",
  icon: "🃏",
  category: "Card Game",
  duration: "Endless",
  tags: ["Card", "Casino", "Strategy", "Classic"]
},
  {
    name: "Bloom Catch",
    path: "games/bloom-catch/index.html",
    icon: "🌸",
    description: "A calm arcade game where soft petals drift down a pastel-gradient sky. Tilt or drag a vase to catch them, collect combos to grow your vase into a blooming plant. Relaxing pace with subtle sound.",
    category: "Arcade",
    duration: "Unlimited",
    tags: ["arcade", "relaxing", "mobile", "canvas", "petals", "combo"],
  },
  // Add these objects to the end of the "games" array in the main script.js file

  {
    name: "Follow the Path",
    path: "games/follow-the-path/index.html",
    description: "A sleek memory game where players must repeat a progressively longer path on a grid. Features infinite levels and high-score saving.",
    icon: "🧠",
    category: "Puzzle",
    duration: "Endless",
    tags: ["Memory", "Puzzle", "Logic", "Pattern"]
  },
  {
    name: "Perfect Aim",
    path: "games/perfect-aim/index.html",
    description: "A minimalist arcade game of pure timing. Stop a rotating pointer inside a target sector that shrinks with each hit. Features a combo multiplier and 'perfect hit' bonuses.",
    icon: "🎯",
    category: "Arcade",
    duration: "Endless",
    tags: ["Timing", "Reflex", "Arcade", "Skill"]
  },
  {
    name: "Un-tangle",
    path: "games/un-tangle/index.html",
    description: "A relaxing yet challenging logic puzzle. Drag the nodes to untangle a web of intersecting lines. Features procedurally generated levels of increasing difficulty.",
    icon: "➰",
    category: "Puzzle",
    duration: "Endless",
    tags: ["Puzzle", "Logic", "Relaxing", "Lines"]
  },
  {
    name: "The Floor is Lava",
    path: "games/the-floor-is-lava/index.html",
    description: "A fast-paced survival game where you must hop between safe tiles to avoid the rising lava. Features endless gameplay with a unique lava cooldown mechanic.",
    icon: "🔥",
    category: "Arcade",
    duration: "Endless",
    tags: ["Survival", "Arcade", "Fast-Paced", "Endless"]
  },
  {
    name: "Star Collector",
    path: "games/star-collector/index.html",
    icon: "⭐",
    description: "Navigate through space collecting stars while avoiding asteroids. Use arrow keys to move your spaceship and collect as many stars as possible!",
    category: "Arcade",
    duration: "Endless",
    tags: ["space", "arcade", "keyboard", "avoider", "stars"],
  },
  {
    name: "Bubble Pop Adventure",
    path: "games/bubble-pop-adventure/index.html",
    icon: "🫧",
    description: "Pop bubbles of different colors to score points in this relaxing game. Click on floating bubbles to burst them and earn points based on their color!",
    category: "Arcade",
    duration: "Endless",
    tags: ["relaxing", "clicker", "colorful", "casual", "bubble"]
  },
];

const container = document.getElementById("games-container");
const searchInput = document.getElementById("game-search");
const emptyState = document.getElementById("empty-state");
const clearSearchButton = document.getElementById("clear-search");
const countTargets = document.querySelectorAll("[data-games-count]");
const latestTargets = document.querySelectorAll("[data-latest-game]");
const previewCount = document.querySelector("[data-preview-count]");
const seeMoreContainer = document.getElementById("see-more-container");

//Sorting the game array alphabetically for consistent order
games.sort((a, b) => a.name.localeCompare(b.name));

const INIT_GAMES_LIMIT = 9;
const SEE_MORE_INCREMENT = 15;
let displayedGamesCount = 0;
let currGameList = games;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.1 }
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

  if (!list.length && displayedGamesCount === 0) {
    if (emptyState) emptyState.hidden = false;
    if (seeMoreContainer) seeMoreContainer.innerHTML = "";
    return;
  }

  if (emptyState) emptyState.hidden = true;

  const fragment = document.createDocumentFragment();

  list.forEach((game, index) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.tabIndex = 0;
    card.dataset.name = game.name.toLowerCase();
    card.style.setProperty(
      "--stagger",
      `${(displayedGamesCount + index) * 30}ms`
    );

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
        <a class="play-link" href="${
          game.path
        }" target="_blank" rel="noopener noreferrer">Open in new tab →</a>
      </div>
    `;

    card.addEventListener("pointermove", handleCardTilt);
    card.addEventListener("pointerleave", resetCardTilt);
    card.addEventListener("focusout", resetCardTilt);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const gameName = card
        .querySelector(".card-title")
        ?.textContent.replace(game.icon, "")
        .trim();
      trackGamePlay(gameName);
      window.open(game.path, "_blank", "noopener,noreferrer");
    });
    card.querySelector(".play-button")?.addEventListener("click", () => {
      const gameName = card
        .querySelector(".card-title")
        ?.textContent.replace(game.icon, "")
        .trim();
      trackGamePlay(gameName);
    });

    fragment.appendChild(card);
    observer.observe(card);
  });
  container.appendChild(fragment);

  displayedGamesCount += list.length;
  updateSeeMore(list);
}

function displayGames(reset = false) {
  if (reset) {
    container.innerHTML = "";
    displayedGamesCount = 0;
  }
  const nextGames = currGameList.slice(
    displayedGamesCount,
    displayedGamesCount === 0
      ? INIT_GAMES_LIMIT
      : displayedGamesCount + SEE_MORE_INCREMENT
  );
  renderGames(nextGames);
}

function updateSeeMore() {
  if (seeMoreContainer) {
    seeMoreContainer.innerHTML = "";
    if (displayedGamesCount < currGameList.length) {
      const btn = document.createElement("button");
      btn.className = "cta-button see-more-button";
      btn.textContent = "See More Games";
      btn.id = "see-more-btn";
      btn.addEventListener("click", () => {
        displayGames(false);
      });
      seeMoreContainer.appendChild(btn);
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    currGameList = filterGames(searchInput.value);
    displayGames(true);
  });
}

currGameList = games;
displayGames(true);

function filterGames(rawTerm) {
  const term = rawTerm.trim().toLowerCase();
  if (!term) return games;

  return games.filter((game) => {
    const haystack = [game.name, game.category, game.description, ...game.tags]
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

// Theme Toggle Logic
const themeToggleBtn = document.getElementById("themeToggle");
const appBody = document.body;
const themeKey = "theme-preference";

function applyTheme(theme) {
  appBody.classList.toggle("light-theme", theme === "light");

  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = theme === "light" ? "☀️" : "🌙";
  }

  try {
    localStorage.setItem(themeKey, theme);
  } catch (e) {
    console.warn("Could not save theme preference to localStorage.");
  }
}
const savedTheme = localStorage.getItem(themeKey) || "dark"; // Default to dark
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isLight = appBody.classList.contains("light-theme");
    applyTheme(isLight ? "dark" : "light");
  });
}

// Scroll Button Logic
const scrollTopBtn = document.getElementById("scroll-top");
const scrollBottomBtn = document.getElementById("scroll-bottom");
let lastScrollTop = 0;

window.addEventListener(
  "scroll",
  () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Show/Hide buttons based on scroll position
    if (scrollTopBtn) scrollTopBtn.style.display = st > 100 ? "block" : "none";
    if (scrollBottomBtn)
      scrollBottomBtn.style.display =
        st + clientHeight < scrollHeight - 100 ? "block" : "none";

    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  },
  false
);

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (scrollBottomBtn) {
  scrollBottomBtn.addEventListener("click", () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });
}
