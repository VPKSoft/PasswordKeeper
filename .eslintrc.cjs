// eslint-disable-next-line unicorn/filename-case
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors.
        "plugin:unicorn/recommended",
        "plugin:import/warnings",
    ],
    parser: "@typescript-eslint/parser",
    ignorePatterns: [".eslintrc.cjs"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2_020,
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
        project: ['tsconfig.json'],
    },
    plugins: ["eslint-plugin-jsdoc", "eslint-plugin-unicorn", "react", "@typescript-eslint", "prettier", "react-hooks", "prefer-arrow"],
    settings: {
        react: {
            version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    // Fine tune rules
    rules: {
        "@typescript-eslint/no-var-requires": 0,
        eqeqeq: "error",
        "no-console": "warn",
        "no-undef": "off",
        "no-unused-vars": "off",
        "prettier/prettier": "warn",
        "curly": 2,
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "unicorn/prevent-abbreviations": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/jsx-no-bind": "error",
        "unicorn/no-null": "off",
        "import/order": "warn",
        "unicorn/numeric-separators-style": ["error", { number: { minimumDigits: 0, groupLength: 3 } }],
        "unicorn/filename-case": [
            "error",
            {
                case: "pascalCase",
                ignore: ["^\\.js$", "^\\.?.*\\.js$", "^\\.?.*\\.cjs$", "^_.*", "main.*?.tsx", "vite.config.ts", ".*?\\.ts"],
            },
        ],
        "prefer-arrow/prefer-arrow-functions": [
            "error",
            {
                disallowPrototype: true,
                singleReturnOnly: false,
                classPropertiesAllowed: false,
            },
        ],
        "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
        "func-style": ["error", "expression", { allowArrowFunctions: true }],
        "no-restricted-syntax": ["error", {
            "selector": "ExportDefaultDeclaration",
            "message": "Prefer named exports"
        }],
    },
};
