import eslintPluginUnicorn from "eslint-plugin-unicorn";

/**
 * ESLint configuration for unicorn plugin (modern JS practices).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const unicornConfig = [
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      // Conflicts with NestJS/Next.js naming conventions
      "unicorn/filename-case": "off",
      // Too strict for common abbreviations (props, params, etc.)
      "unicorn/prevent-abbreviations": "off",
      // null is commonly used throughout the codebase
      "unicorn/no-null": "off",
    },
  },
];

export default unicornConfig;
