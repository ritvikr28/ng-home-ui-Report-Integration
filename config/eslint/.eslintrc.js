module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  globals: {
    JSX: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "prettier", // Make sure to keep this at the end of the list to allow Prettier to properly work with ESlint.,
    "plugin:cypress/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "jest"],
  ignorePatterns: [
    "packages/**/*/coverage",
    "packages/**/*/dist",
    "packages/**/*/node_modules",
    "packages/client/src/talismanfailure.js",
    "packages/**/*/storybook-static",
    "packages/**/*/dist",
  ],
  rules: {
    "no-else-return": "warn",
    "react/prop-types": "off",
    "no-console": "warn",
    "react/no-array-index-key": "warn",
    "react/jsx-boolean-value": "warn",
    "import/prefer-default-export": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-use-before-define": "off",
    "import/extensions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "@typescript-eslint/no-empty-pattern": "off",
    "no-empty-pattern": "off",
    "react/jsx-props-no-spreading": "off",
    "comma-dangle": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        arrays: "never",
        objects: "only-multiline",
        imports: "never",
        exports: "never",
        functions: "never",
      }
    ],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".tsx", ".ts"] }
    ]
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
