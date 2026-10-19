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