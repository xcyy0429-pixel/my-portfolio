import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves at /<repo>/ — Vercel serves at /.
// The Actions workflow sets GITHUB_PAGES=true at build time.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/my-portfolio/' : '/',
})
