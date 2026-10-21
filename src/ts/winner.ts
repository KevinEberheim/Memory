import { loadScores, loadSettings } from './storage';
import { getElement } from './utils';

type Result = 'blue' | 'orange' | 'draw';

const SUBLINES: Record<Result, string> = {
    blue: 'The winner is',
    orange: 'The winner is',
    draw: "It's a",
};

const HEADLINES: Record<Result, string> = {
    blue: 'Blue Player',
    orange: 'Orange Player',
    draw: 'Draw',
};

const IMAGE_PATH = '/src/assets/images/gameOverIcons/';

/**
 * Determines the result of the game from the scores.
 * @param scores - The score of each player, e.g. { blue: 3, orange: 5 }.
 * @returns The winning player or "draw".
 */
function getResult(scores: Record<string, number>): Result {
    if (scores.blue > scores.orange) return 'blue';
    if (scores.orange > scores.blue) return 'orange';
    return 'draw';
}

/**
 * Shows the subline and the headline for the result.
 * @param result - The result of the game.
 */
function showTexts(result: Result): void {
    getElement('winner-subline').textContent = SUBLINES[result];
    getElement('winner-headline').textContent = HEADLINES[result];
}

/**
 * Sets the button text for the theme and links it to the start page.
 * @param theme - The active theme, e.g. "codeVibes".
 */
function showButton(theme: string): void {
    const button = getElement('winner-button');
    button.textContent = theme === 'codeVibes' ? 'Back to start' : 'Home';
    button.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

/**
 * Builds the image file name for a result and theme.
 * The gaming theme shows one trophy for both winners.
 * @param result - The result of the game.
 * @param theme - The active theme, e.g. "gaming".
 * @returns The file name without path.
 */
function getImageName(result: Result, theme: string): string {
    if (theme === 'gaming' && result !== 'draw') return 'pokal_gaming.svg';
    return `${result}_${theme}.svg`;
}

/**
 * Shows the image that belongs to the result and theme.
 * @param result - The result of the game.
 * @param theme - The active theme.
 */
function showImage(result: Result, theme: string): void {
    const img = getElement<HTMLImageElement>('winner-image');
    img.src = IMAGE_PATH + getImageName(result, theme);
    img.alt = HEADLINES[result];
}

/**
 * Renders texts, image and button for the result.
 * @param result - The result of the game.
 * @param theme - The active theme.
 */
function showResult(result: Result, theme: string): void {
  document.body.dataset.result = result;
  showTexts(result);
  showImage(result, theme);
  showButton(theme);
}

/**
 * Initialises the winner page from the saved settings and scores.
 * Redirects to the settings page if either of them is missing.
 */
export function initWinner(): void {
  const settings = loadSettings();
  const scores = loadScores();
  if (!settings || !scores) {
    window.location.href = 'settings.html';
    return;
  }
  document.body.dataset.theme = settings.theme;
  showResult(getResult(scores), settings.theme);
}