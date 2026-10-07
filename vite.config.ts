import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const local = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Configured usage imports from the ThreeUI package; resolve it to the registered local source.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@designcodeio\/threeui\/style\.css$/, replacement: local("./src/shaders/threeui.css") },
      { find: /^@designcodeio\/threeui$/, replacement: local("./src/shaders/landing-pages/KageLandingPage.tsx") },
    ],
  },
});
