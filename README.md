# Memory

A two-player memory card game for the browser. Three themes, three board sizes, runs entirely client-side. Built with TypeScript, SCSS and Vite, without a UI framework.

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

The app runs under the sub-path `/Memory/`, for example `http://localhost:5173/Memory/`.

| Script            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the development server                 |
| `npm run build`   | Type-check (`tsc -noEmit`), then `vite build` |
| `npm run preview` | Serve the production build locally           |

## Build

`vite.config.ts` sets `base: '/Memory/'` and lists all HTML pages under `build.rollupOptions.input` (`index`, `settings`, `game`, `gameOver`, `winner`). Vite only builds `index.html` by default, so every new page must be added there.

Upload the contents of `dist/` to a static host that serves the app under `/Memory/`.

## Asset Paths

Images and fonts live in `public/` and are referenced by path.

| Where                | Path style                              | Example                                        |
| -------------------- | --------------------------------------- | ---------------------------------------------- |
| HTML, TypeScript     | Relative, no leading `/`, no `src/`     | `assets/images/cards/${theme}/card_1.svg`      |
| SCSS (`url(...)`)    | Absolute from the public root           | `/assets/images/gameSettingIcons/line_end.svg` |
| SCSS (`@font-face`)  | Absolute from the public root           | `/fonts/Orbitron-Bold.ttf`                     |

Vite does not rewrite paths that are only strings in TypeScript, so an absolute path there would ignore `/Memory/`. In CSS, relative paths resolve against the CSS file and break after the build, while Vite prepends `base` to absolute paths.

## Game Rules

- Each turn flips two cards.
- Match: cards stay open, the player scores a point and plays again.
- No match: cards flip back after 1 second, the other player is up.
- The game ends when all cards are matched. More points wins, equal points are a draw.

## Project Structure

```
.
├── *.html              index, settings, game, gameOver, winner
├── vite.config.ts
├── public/
│   ├── fonts/
│   └── assets/         icons and images/ (cards, playerIcons, ...)
└── src/
    ├── main.ts         entry, page-specific init via body class
    ├── styles/         abstract, base, themes, components, layout, pages
    └── ts/             game logic, board, header, settings, storage, utils
```

State is passed between pages via `localStorage` (`memorySettings`, `memoryScores`). No data leaves the browser. The active theme is set as `data-theme` on `<body>` and applied through CSS custom properties.

## Code Conventions

- Every TypeScript function has at most 14 lines (signature, closing brace and blank lines included).
- Every TypeScript function is documented in English with TSDoc.
- TypeScript runs in strict mode.

## License

ISC (as defined in `package.json`).