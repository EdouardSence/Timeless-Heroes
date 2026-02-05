import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";

import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  {
    ignores: ["*.config.mjs", "*.config.js", ".*.mjs", ".*.js", "node_modules/", "dist/", ".next/"],
  },
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      // Next.js pages, layouts require default exports
      "import-x/no-default-export": "off",
    },
  },
  {
    rules: {
      // Rules to disable common false positives in Next.js/React
      "@typescript-eslint/no-misused-promises": ["warn", {
        checksVoidReturn: { attributes: false },
      }],
    },
  },
];