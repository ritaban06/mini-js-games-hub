const texts = [
  "The quick brown fox jumps over the lazy dog. Typing is a valuable skill that improves with consistent practice and dedication. Many people underestimate the importance of proper finger placement on the keyboard. The home row keys serve as the foundation for efficient typing technique.",
  "Practice makes perfect when learning to type faster. Every keystroke builds muscle memory that helps you type without looking at the keyboard. Professional typists can reach speeds of over one hundred words per minute through years of dedicated practice and proper technique.",
  "Typing is an essential skill in the modern world. Almost every job requires some level of computer proficiency and typing ability. Students who can type quickly have an advantage when taking notes or writing essays. The digital age demands fast and accurate typing skills.",
  "Keep your fingers on the home row for better accuracy. Your left hand should rest on A S D F keys while your right hand rests on J K L semicolon keys. This position allows you to reach all other keys efficiently without looking down at the keyboard during typing sessions.",
  "Speed comes naturally with consistent practice. Do not rush the learning process or sacrifice accuracy for speed. Focus on typing correctly first and the speed will develop over time. Regular practice sessions of fifteen to thirty minutes daily will yield significant improvements.",
  "Focus on accuracy first and speed will follow. Making fewer mistakes is more important than typing quickly at first. Correcting errors wastes time and disrupts your flow. Build good habits early by prioritizing precision over speed in your practice sessions.",
  "Every expert was once a beginner who kept practicing. Learning to touch type takes patience and perseverance but the rewards are worth the effort. Set realistic goals and celebrate small improvements along the way. Consistency is the key to mastering this valuable skill.",
  "The keyboard layout we use today was designed over a century ago. The QWERTY layout was created to prevent mechanical typewriter jams by separating commonly used letter pairs. Modern keyboards no longer face this issue but the layout has become the standard worldwide.",
  "Ergonomic keyboards can help reduce strain during long typing sessions. Taking regular breaks and maintaining good posture are important for preventing repetitive strain injuries. Position your monitor at eye level and keep your wrists straight while typing for optimal comfort.",
  "Touch typing means typing without looking at the keys. This skill allows you to focus on your thoughts and the screen instead of hunting for letters. Most people can learn basic touch typing in a few weeks with regular practice and proper instruction.",
  "Different keyboard layouts exist for various languages and preferences. The Dvorak and Colemak layouts claim to be more efficient than QWERTY. However, switching layouts requires significant retraining and most people stick with what they know. Consistency matters more than the perfect layout.",
  "Mechanical keyboards offer tactile feedback that many typists prefer. The distinct click and feel of mechanical switches can improve typing accuracy and satisfaction. Gaming keyboards often feature customizable lighting and programmable keys for enhanced functionality and personalization.",
  "Mobile devices have changed how we interact with text. Touchscreen typing requires different techniques than physical keyboards. Predictive text and autocorrect help compensate for the lack of tactile feedback. Many people now type more on their phones than on traditional computers.",
  "Coding requires precise typing skills with special characters and symbols. Programmers must be comfortable with brackets, semicolons, and various punctuation marks. Many development environments offer code completion to speed up the typing process and reduce errors in complex syntax.",
  "Creative writing flows better when typing skills are automatic. Writers can focus on their ideas instead of finding keys on the keyboard. Many authors compose directly on computers rather than writing by hand. Fast typing allows thoughts to be captured before they slip away.",
  "Keyboard shortcuts can dramatically improve productivity and efficiency. Learning common shortcuts for copy, paste, and undo saves countless mouse movements. Power users memorize dozens of shortcuts for their most frequently used applications and operating system functions.",
  "Online typing games make practice more enjoyable and engaging. Gamification elements like scores, levels, and achievements motivate learners to practice regularly. Competing with friends or tracking personal progress adds an element of fun to skill development.",
  "Voice recognition technology is advancing but typing remains essential. Many situations require silent text input where speaking is inappropriate. Typing also allows for careful editing and revision during the composition process. Both skills have their place in modern communication.",
  "Typing speed is measured in words per minute or WPM. The average person types between forty and fifty words per minute. Professional typists and court reporters can exceed one hundred words per minute. Speed matters less than accuracy in most real world applications.",
  "Learning keyboard shortcuts for special characters saves time and effort. The alt key combined with number codes produces various symbols. Many applications have their own shortcut systems for formatting and navigation. Mastering these shortcuts enhances overall computer proficiency and workflow.",
];

let currentText = "";
let startTime = null;
let timerInterval = null;
let currentIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let timeLimit = 60;
let timeRemaining = 60;

const textDisplay = document.getElementById("textDisplay");
const inputBox = document.getElementById("inputBox");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const resultModal = document.getElementById("resultModal");
const closeResultBtn = document.getElementById("closeResult");

function initGame() {
  currentText = texts[Math.floor(Math.random() * texts.length)];
  currentIndex = 0;
  correctChars = 0;
  incorrectChars = 0;
  startTime = null;
  timeRemaining = timeLimit;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerEl.textContent = timeLimit + "s";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  inputBox.value = "";
  inputBox.disabled = false;
  inputBox.focus();

  renderText();
}

function renderText() {
  textDisplay.innerHTML = currentText
    .split("")
    .map((char, index) => {
      let className = "";
      if (index < currentIndex) {
        className = inputBox.value[index] === char ? "correct" : "incorrect";
      } else if (index === currentIndex) {
        className = "current";
      }
      return `<span class="char ${className}">${char}</span>`;
    })
    .join("");
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeRemaining = timeLimit - elapsed;
    timerEl.textContent = timeRemaining + "s";

    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

function calculateWPM() {
  const timeInMinutes = (Date.now() - startTime) / 60000;
  const wordsTyped = correctChars / 5;
  return Math.round(wordsTyped / timeInMinutes) || 0;
}

function calculateAccuracy() {
  const total = correctChars + incorrectChars;
  return total === 0 ? 100 : Math.round((correctChars / total) * 100);
}

function showResults() {
  const finalWPM = calculateWPM();
  const finalAccuracy = calculateAccuracy();
  const timeTaken = timeLimit - timeRemaining;

  document.getElementById("finalWPM").textContent = finalWPM;
  document.getElementById("finalAccuracy").textContent = finalAccuracy + "%";
  document.getElementById("finalTime").textContent = timeTaken + "s";

  resultModal.style.display = "flex";
}

function endGame() {
  clearInterval(timerInterval);
  inputBox.disabled = true;
  showResults();
}

inputBox.addEventListener("input", (e) => {
  if (!startTime) {
    startTimer();
  }

  const typed = e.target.value;
  currentIndex = typed.length;

  correctChars = 0;
  incorrectChars = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  wpmEl.textContent = calculateWPM();
  accuracyEl.textContent = calculateAccuracy() + "%";

  renderText();

  if (typed.length === currentText.length && typed === currentText) {
    endGame();
  }
});

inputBox.addEventListener("paste", (e) => {
  e.preventDefault();
});

restartBtn.addEventListener("click", initGame);
closeResultBtn.addEventListener("click", () => {
  resultModal.style.display = "none";
  initGame();
});

initGame();
