// @ts-expect-error TypeScript has no declaration for SCSS side-effect imports.
import './styles/style.scss';
import './ts/settings';
import { initThemePreview } from './ts/settings';
import { initSummary } from './ts/settings';
import { initGame } from './ts/game';
import { initExitDialog } from './ts/game';


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