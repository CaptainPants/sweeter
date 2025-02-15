// @ts-check

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

/**
 * @type {(path: string) => import('typescript-eslint').ConfigArray}
 */
const commonConfig = (tsconfigPath) => tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
        plugins: {
            "simple-import-sort": simpleImportSort,
            "import": importPlugin
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "args": "all",
                    "argsIgnorePattern": "^_",
                    "caughtErrors": "all",
                    "caughtErrorsIgnorePattern": "^_",
                    "destructuredArrayIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ],
            "simple-import-sort/imports": [
                'error',
                {
                    // \u0000 prefix for side effect imports
                    // \u0000 suffix for type imports
                    groups: [
                        // Any other packages that aren't internal and aren't side effects
                        ['^(?!~/|@serpentis|\\.|\u0000).*'],
                        ['^@serpentis.*'],
                        // @app points to the root of an application, might use this for example app
                        ['^~/.*'],
                        // Parent paths
                        ['^\\.\\./.*'],
                        // Sibling paths
                        ['^\\./.*'],
                        // Side effects (including scss imports)
                        ['^\u0000'],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",
            "import/extensions": ['error', "ignorePackages", {
                "checkTypeImports": true
            }],
            "import/consistent-type-specifier-style": ['error', 'prefer-inline']
        }
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: tsconfigPath,
            },
        },
        settings: {
        }
    },
);

export { commonConfig };

/**
 * @type {import('typescript-eslint').ConfigArray}
 */
const rootConfig = [{ ignores: ['examples/**/*.*', 'packages/**/*.*', 'tools/**/*.*'] }, ...commonConfig(import.meta.url)];

// This should only be used by tooling operating outside a sub-project (which will have its own eslint.config.mjs)
export default rootConfig;