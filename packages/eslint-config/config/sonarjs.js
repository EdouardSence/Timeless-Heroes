import sonarjs from "eslint-plugin-sonarjs";

/**
 * ESLint configuration for SonarJS code quality rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const sonarjsConfig = [sonarjs.configs.recommended];
