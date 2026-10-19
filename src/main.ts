// @ts-expect-error TypeScript has no declaration for SCSS side-effect imports.
import './styles/style.scss';
import { initThemePreview } from './ts/settingsPreview';
import { initSummary } from './ts/settingsSummary';
import { initGame } from './ts/gameLogic';
import { initExitDialog } from './ts/exitDialog';


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
}

document.addEventListener('DOMContentLoaded', initApp);