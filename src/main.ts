// @ts-expect-error TypeScript has no declaration for SCSS side-effect imports.
import './styles/style.scss';
import { initThemePreview } from './ts/settingsPreview';
import { initSummary } from './ts/settingsSummary';
import { initGame } from './ts/gameLogic';
import { initExitDialog } from './ts/exitDialog';
import { initGameOver } from './ts/gameOver';
import { initWinner } from './ts/winner';
import { initHome } from './ts/home';

/**
 * Initialises the settings page.
 */
function initSettingsPage(): void {
    initThemePreview();
    initSummary();
}

/**
 * Initialises the game page.
 */
function initGamePage(): void {
    initGame();
    initExitDialog();
}

/**
 * Maps body classes to the init function of the matching page.
 * @returns The init functions by body class.
 */
function getPageInits(): Record<string, () => void> {
    return {
        home: initHome,
        settings: initSettingsPage,
        game: initGamePage,
        gameOver: initGameOver,
        winner: initWinner,
    };
}

/**
 * Runs the page specific initialisation for the current page.
 */
function initApp(): void {
    Object.entries(getPageInits()).forEach(([pageClass, init]) => {
        if (document.body.classList.contains(pageClass)) init();
    });
}

document.addEventListener('DOMContentLoaded', initApp);