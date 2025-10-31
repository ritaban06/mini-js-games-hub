const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// --- Timing & Synchronization Constants ---
const BPM = 120; // Beats Per Minute
const MS_PER_BEAT = 60000 / BPM; // Milliseconds per beat (e.g., 500ms for 120 BPM)
const NOTE_TRAVEL_DURATION = 2000; // 2 seconds for a note to travel from top to hit line

// Visual positions
const HIT_LINE_Y = CANVAS_HEIGHT * 0.8; // Target line is 80% down the screen
const START_LINE_Y = 0;

// Calculated speed (pixels per millisecond)
// Note must travel CANVAS_HEIGHT * 0.8 in NOTE_TRAVEL_DURATION time
const NOTE_SPEED_PIXELS_PER_MS = HIT_LINE_Y / NOTE_TRAVEL_DURATION;

// Hit tolerance windows (in milliseconds)
const PERFECT_WINDOW = 50;  // +/- 50ms from target time
const GOOD_WINDOW = 150;    // +/- 150ms from target time

// --- Game State Variables ---
let score = 0;
let lastBeatTime = performance.now();
let notes = [];
let keys = {};
let noteCounter = 0; // Used to determine which note pattern to spawn