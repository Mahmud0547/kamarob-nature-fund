import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: { include: ["tests/rls/**/*.test.ts"], environment: "node", env: loadEnv(mode, process.cwd(), "NEXT_PUBLIC_"), testTimeout: 20000 },
}));
