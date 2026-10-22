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