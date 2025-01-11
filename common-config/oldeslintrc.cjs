module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        // Fix up typescript imports to have .js
        'plugin:require-extensions/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        //project: 'tsconfig.json',
        //tsconfigRootDir: __dirname + '/../.',
    },
    plugins: ['require-extensions', 'simple-import-sort'],
    rules: {
    },
    settings: {
        "import/resolver": {
            "typescript": {
                "directory": "./tsconfig.json"
            },
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        },
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
    }
}
