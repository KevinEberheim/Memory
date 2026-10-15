const IMAGE_PATH = 'src/assets/images/gameSettingThemes/';

const THEME_IMAGES: Record<string, string> = {
  codeVibes: 'theme_codeVibes.png',
  gaming: 'theme_gaming.png',
  food: 'theme_food.png',
};

/**
 * Sets the preview image to the one belonging to the given theme.
 * @param themeId - The id of the selected theme radio input.
 */
function updateThemePreview(themeId: string): void {
  const img = document.querySelector<HTMLImageElement>('.settings__section__rightside > img');
  const file = THEME_IMAGES[themeId];
  if (!img || !file) return;
  img.src = IMAGE_PATH + file;
  img.alt = `${themeId} theme`;
}

/**
 * Registers a change listener on every theme radio input.
 */
export function initThemePreview(): void {
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="Themes"]');
  radios.forEach((radio) => {
    radio.addEventListener('change', () => updateThemePreview(radio.id));
  });
}



const SUMMARY_FORMAT: Record<string, (value: string) => string> = {
  Themes: (value) => value,
  Player: (value) => `${value} Player`,
  Cards: (value) => `Board-${value}`,
};

/**
 * Returns the value of the checked radio of a group.
 * @param group - The name attribute of the radio group.
 * @returns The checked value, or null if nothing is selected.
 */
function getChecked(group: string): string | null {
  const radio = document.querySelector<HTMLInputElement>(
    `input[name="${group}"]:checked`
  );
  return radio ? radio.value : null;
}

/**
 * Returns the visible label text of the checked radio of a group.
 * @param group - The name attribute of the radio group.
 * @returns The label text, or null if nothing is selected.
 */
function getCheckedLabel(group: string): string | null {
  const radio = document.querySelector<HTMLInputElement>(
    `input[name="${group}"]:checked`
  );
  return radio?.nextElementSibling?.textContent ?? null;
}

/**
 * Shows the selected value in a summary paragraph, or restores its default text.
 * @param p - The summary paragraph with a data-group attribute.
 */
function updateSummaryLine(p: HTMLElement): void {
  const group = p.dataset.group ?? '';
  const value = getCheckedLabel(group);
  p.dataset.default ??= p.textContent ?? '';
  p.textContent = value ? SUMMARY_FORMAT[group](value) : p.dataset.default;
}

/**
 * Enables the start button only if every group has a selection.
 */
function updateStartButton(): void {
  const button = document.querySelector<HTMLButtonElement>('.settings__chosen__button');
  const groups = Object.keys(SUMMARY_FORMAT);
  if (button) button.disabled = !groups.every((group) => getChecked(group));
}

/**
 * Refreshes all summary lines and the start button state.
 */
function updateSummary(): void {
  document
    .querySelectorAll<HTMLElement>('.settings__chosen p[data-group]')
    .forEach((p) => updateSummaryLine(p));
  updateStartButton();
}

/**
 * Registers the change listener on the form and renders the initial state.
 */
export function initSummary(): void {
  const form = document.querySelector('.settings__form');
  form?.addEventListener('change', updateSummary);
  updateSummary();
  form?.addEventListener('submit', (e) => handleSubmit(e as SubmitEvent));
}

const STORAGE_KEY = 'memorySettings';

/**
 * Reads the checked value of every radio group into one object.
 * @returns The current settings keyed by group name.
 */
function readSettings(): Record<string, string | null> {
  return {
    theme: getChecked('Themes'),
    player: getChecked('Player'),
    cards: getChecked('Cards'),
  };
}

/**
 * Saves the settings and redirects to the game page.
 * @param event - The submit event of the settings form.
 */
function handleSubmit(event: SubmitEvent): void {
  event.preventDefault();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readSettings()));
  window.location.href = 'game.html';
}