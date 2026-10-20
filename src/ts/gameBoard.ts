import { shuffle } from './utils';

type CardHandler = (card: HTMLButtonElement) => void;

const COLUMNS: Record<string, number> = { '16': 4, '24': 6, '36': 6 };
const IMAGE_COUNT = 18;
const FLIPPED_CLASS = 'game__card__inner--flipped';
const FRONT_IMAGE = '/src/assets/images/cards/card_image.svg';
const FRONT_IMAGE_THEMES = ['codeVibes', 'food'];

/**
 * Builds the image URLs of one theme folder.
 * @param theme - The theme folder name, e.g. "codeVibes".
 * @returns All image URLs of that theme.
 */
function getThemeImages(theme: string): string[] {
  return Array.from(
    { length: IMAGE_COUNT },
    (_, i) => `/src/assets/images/cards/${theme}/card_${i + 1}.svg`
  );
}

/**
 * Builds a shuffled deck: random images, each used twice.
 * @param theme - The theme folder name.
 * @param count - The total number of cards (even).
 * @returns The shuffled list of image URLs.
 */
function buildDeck(theme: string, count: number): string[] {
  const picked = shuffle(getThemeImages(theme)).slice(0, count / 2);
  return shuffle([...picked, ...picked]);
}

/**
 * Creates one face of a card.
 * @param modifier - Optional BEM modifier, e.g. "back".
 * @returns The face element.
 */
function createFace(modifier?: string): HTMLDivElement {
  const face = document.createElement('div');
  face.classList.add('game__card__face');
  if (modifier) face.classList.add(`game__card__face--${modifier}`);
  return face;
}

/**
 * Creates the front face of a card. Themes with a shared front image show it.
 * @param theme - The theme folder name, e.g. "food".
 * @returns The front face element.
 */
function createFrontFace(theme: string): HTMLDivElement {
  const face = createFace();
  if (!FRONT_IMAGE_THEMES.includes(theme)) return face;
  const img = document.createElement('img');
  img.src = FRONT_IMAGE;
  img.alt = '';
  face.append(img);
  return face;
}

/**
 * Creates the back face of a card, which shows the motif.
 * @param image - The image URL of the motif.
 * @returns The back face element.
 */
function createBackFace(image: string): HTMLDivElement {
  const face = createFace('back');
  const img = document.createElement('img');
  img.src = image;
  img.alt = '';
  face.append(img);
  return face;
}

/**
 * Flips a card face up or face down.
 * @param card - The card element.
 * @param faceUp - True to show the motif, false to hide it.
 */
export function setFlipped(card: HTMLButtonElement, faceUp: boolean): void {
  card
    .querySelector('.game__card__inner')
    ?.classList.toggle(FLIPPED_CLASS, faceUp);
}

/**
 * Creates a flippable card showing the given motif on its back.
 * @param image - The image URL of the motif.
 * @param theme - The theme folder name.
 * @param onClick - Called with the card when it is clicked.
 * @returns The card element.
 */
function createCard(image: string, theme: string, onClick: CardHandler): HTMLButtonElement {
  const card = document.createElement('button');
  const inner = document.createElement('div');
  card.type = 'button';
  card.dataset.image = image;
  card.classList.add('game__card');
  inner.classList.add('game__card__inner');
  inner.append(createFrontFace(theme), createBackFace(image));
  card.append(inner);
  card.addEventListener('click', () => onClick(card));
  return card;
}

/**
 * Fills the board with a random deck.
 * @param theme - The saved theme value.
 * @param cards - The saved board size, e.g. "16".
 * @param onClick - Called with a card when it is clicked.
 */
export function createBoard(theme: string, cards: string, onClick: CardHandler): void {
  const board = document.querySelector<HTMLElement>('.game__board');
  if (!board) return;
  board.style.setProperty('--columns', String(COLUMNS[cards]));
  const deck = buildDeck(theme, Number(cards));
  board.replaceChildren(...deck.map((image) => createCard(image, theme, onClick)));
}