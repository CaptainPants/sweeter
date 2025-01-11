
export default[
    {
        files: ['**/*.json'],
        // Override or add rules here
        rules: {},
        languageOptions: {
            parser: require('jsonc-eslint-parser'),
        },
    },

    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: [
            '**/*.ts',
            '**/*.tsx',
            '**/*.js',
            '**/*.jsx',
            '**/*.cjs',
            '**/*.mjs',
        ],
        // Override or add rules here
        rules: {},
    },
    {
        files: ['**/*.json'],
        rules: {
            '@nx/dependency-checks': [
                'error',
                {
                    ignoredFiles: [
                        '{projectRoot}/eslint.config.{js,cjs,mjs}',
                        '{projectRoot}/vite.config.{js,ts,mjs,mts}',
                    ],
                },
            ],
        },
        languageOptions: {
            parser: require('jsonc-eslint-parser'),
        },
    },
    {
        files: ['**/package.json'],
        rules: {
            '@nx/nx-plugin-checks': 'error',
        },
        languageOptions: {
            parser: require('jsonc-eslint-parser'),
        },
    },
];
