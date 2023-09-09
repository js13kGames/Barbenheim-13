import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [ViteImageOptimizer()],
});
