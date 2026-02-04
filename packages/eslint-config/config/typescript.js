import tseslint from "typescript-eslint";

/**
 * ESLint configuration for stricter TypeScript rules.
 * Requires type-checking (projectService) to be enabled.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const typescriptConfig = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
  },
];
