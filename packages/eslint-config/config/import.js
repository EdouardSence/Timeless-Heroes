import importX from "eslint-plugin-import-x";

/**
 * ESLint configuration for import-x plugin (import ordering and validation).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const importConfig = [
  {
    plugins: {
      "import-x": importX,
    },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
        },
      ],
      "import-x/no-duplicates": "error",
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-mutable-exports": "error",
    },
  },
];

export default importConfig;
