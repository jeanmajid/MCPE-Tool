import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
    js.configs.recommended,
    prettier,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                console: "readonly",
                fetch: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly"
            }
        },
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            "prettier/prettier": [
                "warn",
                {
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    singleQuote: false,
                    trailingComma: "none",
                    printWidth: 100,

                    endOfLine: "auto"
                }
            ],
            "no-unused-vars": "warn",
            "prefer-const": "warn",
            "no-var": "error",
            eqeqeq: "error",
            curly: "error"
        }
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            globals: {
                console: "readonly",
                fetch: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly"
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            }
        },
        plugins: {
            "@typescript-eslint": typescript,
            prettier: prettierPlugin
        },
        rules: {
            ...typescript.configs.recommended.rules,
            "prettier/prettier": [
                "warn",
                {
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    trailingComma: "none",
                    printWidth: 100,
                    endOfLine: "auto"
                }
            ],
            "no-redeclare": "off",
            "prefer-const": "warn",
            "@typescript-eslint/no-redeclare": "error",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            eqeqeq: "error",
            curly: "error"
        }
    },
    {
        ignores: ["node_modules/", ".vscode/", "dist/", "test/", "*.d.ts"]
    }
];
