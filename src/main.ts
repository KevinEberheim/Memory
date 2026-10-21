// @ts-expect-error TypeScript has no declaration for SCSS side-effect imports.
import './styles/style.scss';
import { initThemePreview } from './ts/settingsPreview';
import { initSummary } from './ts/settingsSummary';
import { initGame } from './ts/gameLogic';
import { initExitDialog } from './ts/exitDialog';
import { initGameOver } from './ts/gameOver';
import { initWinner } from './ts/winner';


/**
 * Runs the page specific initialisation for the current page.
 */
function initApp(): void {
    if (document.body.classList.contains('settings')) {
        initThemePreview();
        initSummary();
    }
    if (document.body.classList.contains('game')) {
        initGame();
        initExitDialog();
    }
    if (document.body.classList.contains('gameOver')) {
        initGameOver();
    }
    if (document.body.classList.contains('winner')) {
        initWinner();
    }
}

document.addEventListener('DOMContentLoaded', initApp);