import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

import { importConfig } from "./config/import.js";
import { perfectionistConfig } from "./config/perfectionist.js";
import { sonarjsConfig } from "./config/sonarjs.js";
import { typescriptConfig } from "./config/typescript.js";
import { unicornConfig } from "./config/unicorn.js";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  // Type-checked configs (requires projectService)
  ...typescriptConfig,
  ...unicornConfig,
  ...importConfig,
  ...perfectionistConfig,
  ...sonarjsConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
