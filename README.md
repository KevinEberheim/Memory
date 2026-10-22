# Memory

A two-player memory card game for the browser. Players take turns flipping cards and try to find matching pairs. The game has three visual themes, three board sizes and runs entirely client-side.

Built with TypeScript, SCSS and Vite, without a UI framework.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Build and Deployment](#build-and-deployment)
- [Asset Paths](#asset-paths)
- [Game Flow](#game-flow)
- [Game Rules](#game-rules)
- [Themes](#themes)
- [Project Structure](#project-structure)
- [Data Storage](#data-storage)
- [Code Conventions](#code-conventions)
- [License](#license)

## Features

- Two players: Blue and Orange
- Choose which player starts
- Three themes: Code vibes, Gaming, Foods
- Three board sizes: 16, 24 or 36 cards
- Random deck on every game (images are picked and shuffled with Fisher-Yates)
- Flip animation for cards (CSS 3D transform)
- Live score and current-player indicator in the header
- Exit confirmation dialog (native `<dialog>`)
- Game over screen followed by an automatic redirect to the winner screen
- Winner screen with draw handling

## Tech Stack

| Area     | Tool                       |
| -------- | -------------------------- |
| Language | TypeScript 7 (strict mode) |
| Styling  | SCSS (Sass 1.105)          |
| Bundler  | Vite 8                     |
| Runtime  | Browser, no dependencies   |

All packages are `devDependencies`. The built game has no runtime dependencies.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8 and Sass; `import.meta.dirname` in the Vite config needs Node 20.11 or newer)
- npm

## Getting Started

```bash
git clone <repository-url>
cd Memory
npm install
npm run dev
```

The project uses `base: '/Memory/'` (see [Build and Deployment](#build-and-deployment)). Open the URL printed by Vite, which includes the `/Memory/` sub-path, for example `http://localhost:5173/Memory/`.

## Scripts

Defined in `package.json`:

| Script            | Command                     | Purpose                                      |
| ----------------- | --------------------------- | -------------------------------------------- |
| `npm run dev`     | `vite`                      | Start the development server with hot reload |
| `npm run build`   | `tsc -noEmit && vite build` | Type-check, then create the production build |
| `npm run preview` | `vite preview`              | Serve the production build locally           |

## Build and Deployment

`npm run build` runs two steps in sequence:

1. `tsc -noEmit` type-checks all files in `src/` using `tsconfig.json` (strict mode, no output files). If there is a type error, the build stops here.
2. `vite build` bundles the project, compiles SCSS and writes the result to `dist/`.

Use `npm run preview` to test `dist/` locally before deploying.

### Vite configuration

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

const root: string = import.meta.dirname

export default defineConfig({
  base: '/Memory/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        settings: resolve(root, 'settings.html'),
        game: resolve(root, 'game.html'),
        gameOver: resolve(root, 'gameOver.html'),
        winner: resolve(root, 'winner.html'),
      },
    },
  },
});
```

- `base: '/Memory/'` makes the app run under the sub-path `/Memory/` instead of the domain root. The repository name and this value must match if the app is hosted under a repository path (for example on GitHub Pages).
- The project is a multi-page app. By default Vite only builds `index.html`, so every HTML page is listed explicitly under `build.rollupOptions.input`. If you add a new page, add it here as well.

### Deployment

Upload the contents of `dist/` to a static host that serves the app under `/Memory/`. No server-side code is needed.

## Asset Paths

Images, icons and fonts are not imported through the bundler. They live in `public/` and are referenced by path. Vite copies `public/` unchanged to `dist/`. The rules below keep the paths working in development and in the build with `base: '/Memory/'`.

| Where                     | Path style                                  | Example                                          |
| ------------------------- | ------------------------------------------- | ------------------------------------------------ |
| HTML (`src` attributes)   | Relative, no leading slash, no `src/`       | `assets/exit.svg`                                |
| TypeScript strings        | Relative, no leading slash, no `src/`       | `assets/images/cards/${theme}/card_1.svg`        |
| SCSS (`url(...)`)         | Absolute from the public root               | `/assets/images/gameSettingIcons/line_end.svg`   |
| SCSS fonts (`@font-face`) | Absolute from the public root               | `/fonts/Orbitron-Bold.ttf`                       |
| Script entry in HTML      | Absolute, handled by Vite                   | `/src/main.ts`                                   |

Why the difference:

- Relative paths in HTML and TypeScript are resolved against the page URL. All HTML pages are in the project root, so `assets/...` always resolves to `/Memory/assets/...`, no matter which TypeScript file builds the string.
- A relative path in CSS is resolved against the CSS file instead, which breaks after the build. In SCSS, absolute paths to files in `public/` are used. Vite prepends the `base` automatically.
- Paths that are only strings in TypeScript are not rewritten by Vite. This is why they must be relative and must not start with `/`, otherwise they would point to the domain root and ignore `/Memory/`.

Rule for new code: never start an asset path in HTML or TypeScript with `/` or `src/`.

## Game Flow

```
index.html -> settings.html -> game.html -> gameOver.html -> winner.html
   (home)     (choose options)    (play)     (final score)     (result)
```

| Page            | Body class | Description                                                          |
| --------------- | ---------- | -------------------------------------------------------------------- |
| `index.html`    | `home`     | Landing page with a Play button                                      |
| `settings.html` | `settings` | Select theme, starting player and board size. Start needs all three. |
| `game.html`     | `game`     | The board, score header, exit dialog                                 |
| `gameOver.html` | `gameOver` | Shows the final score, redirects to the winner page after 2 seconds  |
| `winner.html`   | `winner`   | Shows the winner (or draw) and a button back to the start page       |

`src/main.ts` checks the body class and runs the initialisation for the current page. If saved settings or scores are missing, the game, game over and winner pages redirect to `settings.html`.

## Game Rules

- The deck consists of pairs. A 16-card board uses 8 pairs, 24 cards use 12 pairs, 36 cards use 18 pairs.
- A turn consists of flipping two cards.
- Match: both cards stay open (shown dimmed), the current player gets one point and plays again.
- No match: after 1 second both cards flip back and the turn passes to the other player.
- The game ends when all cards are matched. The player with more points wins, equal points are a draw.

## Themes

The active theme is stored in `data-theme` on the `<body>` element. Each theme sets CSS custom properties (colors, fonts, radii, shadows) that the shared component styles consume.

| Theme      | Value       | Notes                                              |
| ---------- | ----------- | -------------------------------------------------- |
| Code vibes | `codeVibes` | Dark theme, teal accent, confetti on winner screen |
| Gaming     | `gaming`    | Pink accent on blue-grey, Orbitron font            |
| Foods      | `food`      | Orange accent, KleeOne and DeliusUnicase fonts     |

Each theme has its own folder with 18 card images (`card_1.svg` to `card_18.svg`) and its own player and result icons.

To add a theme:

1. Add a SCSS file in `themes/` that defines the custom properties and register it in `style.scss`.
2. Add the card images under `public/assets/images/cards/<theme>/`.
3. Add player icons, result images and the settings preview image for the theme.
4. Add a radio input to `settings.html` and an entry to `THEME_IMAGES` in `settingsPreview.ts`.

## Project Structure

The structure below is derived from the imports and paths in the source files. Adjust it if your folders differ.

```
.
├── index.html
├── settings.html
├── game.html
├── gameOver.html
├── winner.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── fonts/                      Web fonts
│   └── assets/
│       ├── *.svg                   Icons of the home and game page
│       └── images/
│           ├── cards/              Card front and per-theme motifs
│           ├── playerIcons/
│           ├── gameOverIcons/
│           ├── gameOverImages/     Confetti
│           ├── gameSettingIcons/
│           └── gameSettingThemes/  Theme preview images
└── src/
    ├── main.ts                     Entry point, page-specific init
    ├── styles/
    │   ├── style.scss              Imports all partials
    │   ├── abstract/               _variables.scss
    │   ├── base/                   _reset.scss, _fonts.scss
    │   ├── themes/                 _codeVibes.scss, _gaming.scss, _food.scss
    │   ├── components/             _button.scss, _dialog.scss, _card.scss
    │   ├── layout/                 _header.scss, _board.scss
    │   └── pages/                  _home, _settings, _game, _gameOver, _winner
    └── ts/
        ├── gameLogic.ts            Turn handling, scoring, game end
        ├── gameBoard.ts            Deck building and card rendering
        ├── gameHeader.ts           Player icons and score display
        ├── exitDialog.ts           Exit confirmation dialog
        ├── gameOver.ts             Game over page
        ├── winner.ts               Winner page
        ├── settingsPreview.ts      Theme preview image on the settings page
        ├── settingsSummary.ts      Settings summary, start button state, submit
        ├── storage.ts              localStorage access
        └── utils.ts                shuffle, getElement
```

### TypeScript modules

| Module               | Responsibility                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `gameLogic.ts`       | Holds game state (open cards, lock, scores, current player), evaluates pairs, detects game end |
| `gameBoard.ts`       | Builds the shuffled deck, creates the card elements, toggles the flip state                     |
| `gameHeader.ts`      | Updates the current-player icon, score icons and score values                                   |
| `settingsSummary.ts` | Reads the radio groups, updates the summary, enables Start, saves settings                      |
| `storage.ts`         | `saveSettings`, `loadSettings`, `saveScores`, `loadScores`                                      |
| `utils.ts`           | `shuffle` (Fisher-Yates), `getElement` (throws if the id is missing)                            |

### SCSS architecture

- BEM-style class names (`game__card__inner--flipped`, `settings__section__headline`, ...).
- Static values (colors, fonts, max width) are SCSS variables in `_variables.scss`.
- Theme-dependent values are CSS custom properties, so a theme only has to override variables.
- Maximum layout width is `1440px`.

## Data Storage

State is passed between pages with `localStorage`:

| Key              | Content                                                  |
| ---------------- | -------------------------------------------------------- |
| `memorySettings` | `{ theme, player, cards }`, written when starting a game |
| `memoryScores`   | `{ blue, orange }`, written when the game is finished    |

No data leaves the browser.

## Code Conventions

- Every TypeScript function has at most 14 lines. This includes the signature, closing brace and blank lines.
- Every TypeScript function is documented in English using TSDoc (`@param`, `@returns`).
- TypeScript runs in strict mode. `npm run build` fails on type errors.
- Asset paths follow the rules in [Asset Paths](#asset-paths).

## License

ISC (as defined in `package.json`).