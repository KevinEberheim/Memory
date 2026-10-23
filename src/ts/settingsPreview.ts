let committedId: string | null = null;
const IMAGE_PATH = 'assets/images/gameSettingThemes/';

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
 * Returns the id of the currently checked theme radio.
 * @returns The checked theme id, or null if none is checked.
 */
function getCheckedThemeId(): string | null {
  const radio = document.querySelector<HTMLInputElement>('input[name="Themes"]:checked');
  return radio ? radio.id : null;
}

/**
 * Checks the hovered radio temporarily and shows its preview.
 * @param radio - The hovered theme radio input.
 */
function previewHover(radio: HTMLInputElement): void {
  radio.checked = true;
  updateThemePreview(radio.id);
}

/**
 * Restores the radio and the preview image of the committed theme.
 */
function restoreCommitted(): void {
  if (!committedId) return;
  const radio = document.getElementById(committedId) as HTMLInputElement | null;
  if (radio) radio.checked = true;
  updateThemePreview(committedId);
}

/**
 * Stores a clicked radio as the committed theme and notifies the form.
 * A click on an already checked radio fires no change event, so it is dispatched manually.
 * @param radio - The clicked theme radio input.
 */
function commitClick(radio: HTMLInputElement): void {
  committedId = radio.id;
  radio.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Registers hover, click and change listeners on one theme radio input.
 * @param radio - The theme radio input.
 */
function registerRadio(radio: HTMLInputElement): void {
  const label = radio.closest('label');
  label?.addEventListener('mouseenter', () => previewHover(radio));
  label?.addEventListener('mouseleave', restoreCommitted);
  radio.addEventListener('click', () => commitClick(radio));
  radio.addEventListener('change', () => {
    committedId = radio.id;
    updateThemePreview(radio.id);
  });
}

/**
 * Registers the listeners on every theme radio input.
 */
export function initThemePreview(): void {
  committedId = getCheckedThemeId();
  document
    .querySelectorAll<HTMLInputElement>('input[name="Themes"]')
    .forEach(registerRadio);
}