import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from "path";
import fs from "fs-extra";

const base = process.env.VUE_BASE || "/";

function checkForAdditionalTheme() {
  try {
    // Use corporate theme for production, brand theme for local development
    const isProduction = process.env.NODE_ENV === 'production';
    const themePackageName = isProduction ? "@siemens-ix/corporate-theme" : "@siemens/ix-brand-theme";
    
    const themePackage = import.meta.resolve(themePackageName);
    const theme = path.join(themePackage.replace("file://", ""), "..", "..");
    const currentDir = path.dirname(fileURLToPath(import.meta.url));

    fs.copySync(theme, path.join(currentDir, "public", "theme"), {
      filter: (src) => {
        return !src.includes("node_modules");
      },
    });
    console.log(`Load additional theme: ${themePackageName}`);
  } catch (e) {
    console.log("No additional theme found", e);
  }
}

checkForAdditionalTheme();

export default defineConfig({
  base,
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
