import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "dist/**",
    "node_modules/**",
    "nextjs-example/**",
    "src/routes/**",
    "src/main.tsx",
    "src/routeTree.gen.ts",
    "vite.config.ts",
  ]),
]);
