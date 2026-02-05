import globals from "globals";

import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for Node.js libraries.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const libraryConfig = [
  ...baseConfig,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        JSX: true,
        React: true,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [".*.js", "node_modules/", "dist/"],
  },
];

export default libraryConfig;