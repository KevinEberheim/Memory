interface Settings {
  theme: string;
  player: string;
  cards: string;
}

const STORAGE_KEY = 'memorySettings';
const COLUMNS: Record<string, number> = { '16': 4, '24': 6, '36': 6 };
const IMAGE_COUNT = 18;
const FLIPPED_CLASS = 'game__card__inner--flipped';
const MATCHED_CLASS = 'game__card--matched';
const MISMATCH_DELAY = 1000;
let openCards: HTMLButtonElement[] = [];
let locked = false;
const scores: Record<string, number> = { blue: 0, orange: 0 };
const savedSettings = loadSettings();
let currentPlayer = savedSettings?.player ?? 'blue';
const currentTheme = savedSettings?.theme ?? 'codeVibes';

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
 * Builds the icon path of a player for the current theme.
 * @param player - The player value, e.g. "blue".
 * @returns The icon path, e.g. ".../blue_codeVibes.svg".
 */
function getPlayerIcon(player: string): string {
  return `/src/assets/images/playerIcons/${player}_${currentTheme}.svg`;
}

/**
 * Shows the icon of the current player in the header.
 */
function showPlayer(): void {
  const icon = document.querySelector<HTMLImageElement>('.game__current-icon');
  if (!icon) return;
  icon.src = getPlayerIcon(currentPlayer);
  icon.alt = `${currentPlayer} player`;
}

/**
 * Sets the fixed player icons next to the score counters.
 */
function showScoreIcons(): void {
  document
    .querySelectorAll<HTMLImageElement>('.game__score-icon')
    .forEach((icon) => {
      const player = icon.dataset.player ?? '';
      icon.src = getPlayerIcon(player);
      icon.alt = `${player} player`;
    });
}

/**
 * Returns a shuffled copy of the array (Fisher-Yates).
 * @param items - The array to shuffle.
 * @returns A new shuffled array.
 */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds the image URLs of one theme folder.
 * @param theme - The theme folder name, e.g. "codeVibes".
 * @returns All image URLs of that theme.
 */
function getThemeImages(theme: string): string[] {
  return Array.from(
    { length: IMAGE_COUNT },
    (_, i) => `/src/assets/images/cards/${theme}/card_${i + 1}.svg`
  );
}

/**
 * Builds a shuffled deck: random images, each used twice.
 * @param theme - The theme folder name.
 * @param count - The total number of cards (even).
 * @returns The shuffled list of image URLs.
 */
function buildDeck(theme: string, count: number): string[] {
  const picked = shuffle(getThemeImages(theme)).slice(0, count / 2);
  return shuffle([...picked, ...picked]);
}

/**
 * Creates one face of a card.
 * @param modifier - Optional BEM modifier, e.g. "back".
 * @returns The face element.
 */
function createFace(modifier?: string): HTMLDivElement {
  const face = document.createElement('div');
  face.classList.add('game__card__face');
  if (modifier) face.classList.add(`game__card__face--${modifier}`);
  return face;
}

/**
 * Creates the back face of a card, which shows the motif.
 * @param image - The image URL of the motif.
 * @returns The back face element.
 */
function createBackFace(image: string): HTMLDivElement {
  const face = createFace('back');
  const img = document.createElement('img');
  img.src = image;
  img.alt = '';
  face.append(img);
  return face;
}

/**
 * Flips a card face up or face down.
 * @param card - The card element.
 * @param faceUp - True to show the motif, false to hide it.
 */
function setFlipped(card: HTMLButtonElement, faceUp: boolean): void {
  card
    .querySelector('.game__card__inner')
    ?.classList.toggle(FLIPPED_CLASS, faceUp);
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
  const el = document.querySelector<HTMLElement>(
    `[data-score="${currentPlayer}"]`
  );
  if (el) el.textContent = String(scores[currentPlayer]);
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
  showPlayer();
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
 * Creates a flippable card showing the given motif on its back.
 * @param image - The image URL of the motif.
 * @returns The card element.
 */
function createCard(image: string): HTMLButtonElement {
  const card = document.createElement('button');
  const inner = document.createElement('div');
  card.type = 'button';
  card.dataset.image = image;
  card.classList.add('game__card');
  inner.classList.add('game__card__inner');
  inner.append(createFace(), createBackFace(image));
  card.append(inner);
  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

/**
 * Fills the board with a random deck.
 * @param theme - The saved theme value.
 * @param cards - The saved board size, e.g. "16".
 */
function createBoard(theme: string, cards: string): void {
  const board = document.querySelector<HTMLElement>('.game__board');
  if (!board) return;
  board.style.setProperty('--columns', String(COLUMNS[cards]));
  const deck = buildDeck(theme, Number(cards));
  board.replaceChildren(...deck.map((image) => createCard(image)));
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
  showPlayer();
  showScoreIcons();
  createBoard(savedSettings.theme, savedSettings.cards);
}

/**
 * Returns an element by its id or throws if it does not exist.
 * @param id - The id of the element to find.
 * @returns The found element.
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element #${id} not found`);
  return element as T;
}

/**
 * Opens the exit confirmation dialog as a modal.
 */
function openExitDialog(): void {
  getElement<HTMLDialogElement>('exit-dialog').showModal();
}

/**
 * Closes the exit confirmation dialog and returns to the game.
 */
function closeExitDialog(): void {
  getElement<HTMLDialogElement>('exit-dialog').close();
}

/**
 * Closes the exit dialog when the click target is the dialog itself,
 * which is the case for clicks on the backdrop.
 * @param event - The click event fired on the dialog.
 */
function closeOnBackdropClick(event: MouseEvent): void {
  const dialog = getElement<HTMLDialogElement>('exit-dialog');
  if (event.target === dialog) closeExitDialog();
}

/**
 * Ends the game and navigates back to the settings page.
 */
function exitGame(): void {
  window.location.href = 'settings.html';
}

/**
 * Registers the click listeners for the exit button and the dialog buttons.
 */
export function initExitDialog(): void {
  getElement('exit-button').addEventListener('click', openExitDialog);
  getElement('dialog-back').addEventListener('click', closeExitDialog);
  getElement('dialog-exit').addEventListener('click', exitGame);
  getElement('exit-dialog').addEventListener('click', closeOnBackdropClick);
}