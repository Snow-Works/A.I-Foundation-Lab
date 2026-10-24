// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // If deploying to a custom domain later, change this to "/"
  // If deploying to username.github.io/repo-name, change this to "/repo-name/"
  base: "./", 
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // CodeMirror is heavy, we accept it
  },
});