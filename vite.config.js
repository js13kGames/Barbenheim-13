import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default {
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [ViteImageOptimizer()],
};
