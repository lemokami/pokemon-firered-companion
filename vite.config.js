import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project at /pokemon-firered-companion/, not
  // the domain root, so every built asset URL needs that prefix.
  base: '/pokemon-firered-companion/',
  plugins: [react()],
})
