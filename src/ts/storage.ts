export interface Settings {
  theme: string;
  player: string;
  cards: string;
}

const STORAGE_KEY = 'memorySettings';
const SCORES_KEY = 'memoryScores';

/**
 * Saves the final scores to localStorage.
 * @param scores - The score of each player, e.g. { blue: 3, orange: 5 }.
 */
export function saveScores(scores: Record<string, number>): void {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

/**
 * Loads the final scores from localStorage.
 * @returns The scores, or null if none were saved.
 */
export function loadScores(): Record<string, number> | null {
  const raw = localStorage.getItem(SCORES_KEY);
  return raw ? (JSON.parse(raw) as Record<string, number>) : null;
}

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