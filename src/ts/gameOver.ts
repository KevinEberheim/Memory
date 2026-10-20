import { loadScores, loadSettings } from './storage';
import { showScoreIcons, showScore } from './gameHeader';

/**
 * Initialises the game over page from the saved settings and scores.
 * Redirects to the settings page if either of them is missing.
 */
export function initGameOver(): void {
  const settings = loadSettings();
  const scores = loadScores();
  if (!settings || !scores) {
    window.location.href = 'settings.html';
    return;
  }
  document.body.dataset.theme = settings.theme;
  showScoreIcons(settings.theme);
  Object.entries(scores).forEach(([player, score]) => showScore(player, score));
}