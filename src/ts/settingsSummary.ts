import { saveSettings, type Settings } from './storage';

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

/**
 * Reads the checked value of every radio group into one object.
 * @returns The current settings.
 */
function readSettings(): Settings {
  return {
    theme: getChecked('Themes') ?? '',
    player: getChecked('Player') ?? '',
    cards: getChecked('Cards') ?? '',
  };
}

/**
 * Saves the settings and redirects to the game page.
 * @param event - The submit event of the settings form.
 */
function handleSubmit(event: SubmitEvent): void {
  event.preventDefault();
  saveSettings(readSettings());
  window.location.href = 'game.html';
}