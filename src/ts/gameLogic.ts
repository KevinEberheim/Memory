import { loadSettings } from './storage';
import { showPlayer, showScoreIcons, showScore } from './gameHeader';
import { createBoard, setFlipped } from './gameBoard';

const MATCHED_CLASS = 'game__card--matched';
const MISMATCH_DELAY = 1000;
let openCards: HTMLButtonElement[] = [];
let locked = false;
const scores: Record<string, number> = { blue: 0, orange: 0 };
const savedSettings = loadSettings();
let currentPlayer = savedSettings?.player ?? 'blue';
const currentTheme = savedSettings?.theme ?? 'codeVibes';

/**
 * Redirects to the settings page.
 */
function redirectToSettings(): void {
  window.location.href = 'settings.html';
}

/**
 * Sets the theme on the body so the SCSS can react to it.
 * @param theme - The saved theme value, e.g. "codeVibes".
 */
function applyTheme(theme: string): void {
  document.body.dataset.theme = theme;
}

/**
 * Clears the current turn so the next two cards can be opened.
 */
function resetTurn(): void {
  openCards = [];
  locked = false;
}

/**
 * Adds one point to the current player and updates the header.
 */
function addPoint(): void {
  scores[currentPlayer]++;
  showScore(currentPlayer, scores[currentPlayer]);
}

/**
 * Keeps a matching pair open and marks it as solved.
 */
function keepMatch(): void {
  openCards.forEach((card) => card.classList.add(MATCHED_CLASS));
  addPoint();
  resetTurn();
}

/**
 * Passes the turn to the other player and updates the header icon.
 */
function switchPlayer(): void {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
  showPlayer(currentPlayer, currentTheme);
}

/**
 * Flips a non-matching pair back after a short delay.
 */
function hideMismatch(): void {
  locked = true;
  setTimeout(() => {
    openCards.forEach((card) => setFlipped(card, false));
    switchPlayer();
    resetTurn();
  }, MISMATCH_DELAY);
}

/**
 * Compares the two open cards and resolves the turn.
 */
function evaluatePair(): void {
  const [first, second] = openCards;
  if (first.dataset.image === second.dataset.image) keepMatch();
  else hideMismatch();
}

/**
 * Handles a click on a card and evaluates the turn after two cards.
 * @param card - The clicked card element.
 */
function handleCardClick(card: HTMLButtonElement): void {
  const blocked = locked || card.classList.contains(MATCHED_CLASS);
  if (blocked || openCards.includes(card)) return;
  setFlipped(card, true);
  openCards.push(card);
  if (openCards.length === 2) evaluatePair();
}

/**
 * Initialises the game page from the saved settings.
 */
export function initGame(): void {
  if (!savedSettings) {
    redirectToSettings();
    return;
  }
  applyTheme(savedSettings.theme);
  showPlayer(currentPlayer, currentTheme);
  showScoreIcons(currentTheme);
  createBoard(savedSettings.theme, savedSettings.cards, handleCardClick);
}