import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from network (for mobile testing)
    port: 5173, // Default Vite port
  },
  preview: {
    host: true, // Allow access from network for preview mode
    port: 4173, // Default Vite preview port
  },
})
