/**
 * Returns a shuffled copy of the array (Fisher-Yates).
 * @param items - The array to shuffle.
 * @returns A new shuffled array.
 */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns an element by its id or throws if it does not exist.
 * @param id - The id of the element to find.
 * @returns The found element.
 */
export function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element #${id} not found`);
  return element as T;
}