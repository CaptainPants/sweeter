module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:import/recommended',
        'plugin:import/typescript',
        // Fix up typescript imports to have .js
        'plugin:require-extensions/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['require-extensions', 'simple-import-sort'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        '@typescript-eslint/no-inferrable-types': ['Off'],
        '@typescript-eslint/promise-function-async': ['Off'],
        '@typescript-eslint/no-unused-vars': ['error', {
            "varsIgnorePattern": '^_',
            "args": "none"
        }],
        'n/no-callback-literal': ['Off'],
        'simple-import-sort/imports': [
            'error',
            {
                // \u0000 prefix for side effect imports
                // \u0000 suffix for type imports
                groups: [
                    // Any other packages that aren't internal and aren't side effects
                    ['^(?!~/|@captainpants|\\.|\u0000).*'],
                    ['^@captainpants.*'],
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
        'simple-import-sort/exports': 'error',
        "@typescript-eslint/explicit-member-accessibility": "error",
        // This falls down in the UI for some reason with tsconfig.json 'paths'
        "import/no-unresolved": "Off",
        // This is a pain for null/undefined values
        "@typescript-eslint/strict-boolean-expressions": "Off",
        '@typescript-eslint/no-empty-interface': [
            'error',
            { allowSingleExtends: true }
        ]
    },
    settings: {
        'import/resolver': {
            typescript: true,
            node: true,
        },
    }
};
