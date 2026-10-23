import { clearStorage } from './storage';

/**
 * Clears the saved data and opens the settings page.
 */
function startNewGame(): void {
  clearStorage();
  window.location.href = 'settings.html';
}

/**
 * Registers the click listener on the play button.
 */
export function initHome(): void {
  document.querySelector('.home_button')?.addEventListener('click', startNewGame);
}