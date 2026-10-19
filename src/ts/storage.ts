export interface Settings {
  theme: string;
  player: string;
  cards: string;
}

const STORAGE_KEY = 'memorySettings';

/**
 * Loads the saved settings from localStorage.
 * @returns The settings object, or null if none were saved.
 */
export function loadSettings(): Settings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Settings) : null;
}

/**
 * Saves the settings to localStorage.
 * @param settings - The settings object to save.
 */
export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}