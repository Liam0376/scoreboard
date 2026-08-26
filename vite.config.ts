import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  // singlefile inlines JS/CSS into index.html so the build can be opened
  // directly via file:// (double-click) with no server and no npm install.
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
