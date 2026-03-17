import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // default template
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // customize override
  {
    rules: {
      // (allow export default none name)
      "react/display-name": "off",

      // 'React' must be in scope when using JSX
      "react/react-in-jsx-scope": "off",

      // Unexpected empty object
      "no-empty-pattern": "off",

      // Unexpected any. Specify a different
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["build", "node_modules", ".react-router"],
  },
]);
