/**
 * Builds the icon path of a player for a theme.
 * @param player - The player value, e.g. "blue".
 * @param theme - The theme value, e.g. "codeVibes".
 * @returns The icon path.
 */
function getPlayerIcon(player: string, theme: string): string {
  return `/src/assets/images/playerIcons/${player}_${theme}.svg`;
}

/**
 * Shows the icon of the current player in the header.
 * @param player - The current player.
 * @param theme - The active theme.
 */
export function showPlayer(player: string, theme: string): void {
  const icon = document.querySelector<HTMLImageElement>('.game__current-icon');
  if (!icon) return;
  icon.src = getPlayerIcon(player, theme);
  icon.alt = `${player} player`;
}

/**
 * Sets the fixed player icons next to the score counters.
 * @param theme - The active theme.
 */
export function showScoreIcons(theme: string): void {
  document
    .querySelectorAll<HTMLImageElement>('.game__score-icon')
    .forEach((icon) => {
      const player = icon.dataset.player ?? '';
      icon.src = getPlayerIcon(player, theme);
      icon.alt = `${player} player`;
    });
}

/**
 * Updates the score counter of one player.
 * @param player - The player value.
 * @param score - The new score.
 */
export function showScore(player: string, score: number): void {
  const el = document.querySelector<HTMLElement>(`[data-score="${player}"]`);
  if (el) el.textContent = String(score);
}