import perfectionist from "eslint-plugin-perfectionist";

/**
 * ESLint configuration for perfectionist plugin (sorting).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const perfectionistConfig = [
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-objects": [
        "error",
        { type: "natural", order: "asc" },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        { type: "natural", order: "asc" },
      ],
      "perfectionist/sort-enums": [
        "error",
        { type: "natural", order: "asc" },
      ],
    },
  },
];

export default perfectionistConfig;
