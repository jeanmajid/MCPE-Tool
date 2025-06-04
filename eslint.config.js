import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

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
                __filename: "readonly"
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
            "no-var": "error"
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
                __filename: "readonly"
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
            "@typescript-eslint/no-redeclare": "error",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn"
        }
    },
    {
        ignores: ["node_modules/", "external/", ".vscode/", "dist/", "test/", "*.d.ts"]
    }
];
