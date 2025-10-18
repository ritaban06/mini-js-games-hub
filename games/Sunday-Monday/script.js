const dates = [
  new Date("2025-01-13"),
  new Date("2025-02-25"),
  new Date("2025-03-10"),
  new Date("2025-07-18"),
];

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const dateDisplay = document.getElementById("date-display");
const dayInput = document.getElementById("day-input");
const checkBtn = document.getElementById("check-btn");
const result = document.getElementById("result");

// Pick a random date
let currentDate = dates[Math.floor(Math.random() * dates.length)];

// Only show numeric date: "Jan 13, 2025"
dateDisplay.textContent = `Date: ${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
// Or alternative format:
// dateDisplay.textContent = `Date: ${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;

checkBtn.addEventListener("click", () => {
  const userGuess = dayInput.value.trim().toLowerCase();
  const correctDay = days[currentDate.getDay()].toLowerCase();

  if (!userGuess) return;

  if (userGuess === correctDay) {
    result.textContent = "✅ Correct!";
  } else {
    result.textContent = "❌ Wrong!";
  }

  dayInput.value = "";

  // Pick a new random date for next round
  currentDate = dates[Math.floor(Math.random() * dates.length)];
  dateDisplay.textContent = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
});