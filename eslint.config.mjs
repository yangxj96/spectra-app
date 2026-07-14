import eslintPluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            "unpackage/**",
            "dist/**",
            "src/static/**",
            "**/*.d.ts",
            "auto-imports.d.ts",
            "components.d.ts"
        ]
    },
    {
        files: ["**/*.{ts,tsx,vue,js,jsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                parser: "@typescript-eslint/parser",
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser,
                uni: "readonly",
                plus: "readonly",
                wx: "readonly",
                WeixinJSBridge: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "no-console": "off",
            "no-debugger": "warn",
            "no-duplicate-imports": "error",
            "prefer-const": "error",
            "no-var": "error",
            eqeqeq: ["error", "always"],
            "no-throw-literal": "error"
        }
    },
    ...eslintPluginVue.configs["flat/recommended"].map(config => ({
        ...config,
        files: ["**/*.vue"]
    })),
    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: "@typescript-eslint/parser"
            }
        },
        rules: {
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "warn",
            "vue/require-default-prop": "off",
            "vue/define-macros-order": "warn"
        }
    },
    eslintConfigPrettier
);
