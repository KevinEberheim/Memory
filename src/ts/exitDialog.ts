import { getElement } from './utils';

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