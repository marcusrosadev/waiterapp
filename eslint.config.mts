import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default tseslint.config(
  // 1. Global ignores
  // It's good practice to explicitly ignore common directories.
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".expo/",
      "babel.config.js",
    ],
  },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. TypeScript specific rules
  // We spread the recommended configs from typescript-eslint as it's an array.
  ...tseslint.configs.recommended,

  // 4. React specific rules
  // This applies React-specific linting rules.
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"], // Ensure React rules apply to all relevant files
    settings: {
      react: {
        // Automatically detect the React version you are using.
        version: "detect",
      },
    },
  },

  // 5. Custom rules and overrides
  // You can add your own project-specific rules here.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // For React 17+ with the new JSX transform, this rule is often not needed.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  }
);
