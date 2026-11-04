import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Boundary & Dependency Hygiene: Prevent importing route handlers or raw internal server files
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message: "Do not import 'server-only' into Client Components.",
            },
          ],
          patterns: [
            {
              group: ["@/app/api/**"],
              message: "Do not import route handlers directly. Use Server Actions or API client.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
