import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    server: {
      port: 8000,
    },
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["setupTest.ts"],
    },
  };
});
