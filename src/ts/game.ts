interface Settings {
  theme: string;
  player: string;
  cards: string;
}

const STORAGE_KEY = 'memorySettings';
const COLUMNS: Record<string, number> = { '16': 4, '24': 6, '36': 6 };

/**
 * Loads the saved settings from localStorage.
 * @returns The settings object, or null if none were saved.
 */
function loadSettings(): Settings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Settings) : null;
}

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
 * Shows the chosen player in the header.
 * @param player - The saved player value, e.g. "blue".
 */
function showPlayer(player: string): void {
  const el = document.querySelector<HTMLElement>('.game__player');
  if (!el) return;
  el.textContent = `${player.charAt(0).toUpperCase()}${player.slice(1)} Player`;
  el.dataset.player = player;
}

/**
 * Creates a single empty card element.
 * @returns The card element.
 */
function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.classList.add('game__card');
  return card;
}

/**
 * Fills the board with the chosen number of cards.
 * @param cards - The saved board size, e.g. "16".
 */
function createBoard(cards: string): void {
  const board = document.querySelector<HTMLElement>('.game__board');
  if (!board) return;
  board.style.setProperty('--columns', String(COLUMNS[cards]));
  board.replaceChildren(...Array.from({ length: Number(cards) }, createCard));
}

/**
 * Initialises the game page from the saved settings.
 */
export function initGame(): void {
  const settings = loadSettings();
  if (!settings) {
    redirectToSettings();
    return;
  }
  applyTheme(settings.theme);
  showPlayer(settings.player);
  createBoard(settings.cards);
}