module.exports = {
  env: { browser: true, es2020: true },
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
  parserOptions: { 
    ecmaVersion: 'latest',
    sourceType: 'module',
    //project: 'tsconfig.json',
    //tsconfigRootDir: __dirname + '/../.',
  },
  plugins: ['require-extensions', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
        "varsIgnorePattern": '^_',
        "args": "none"
    }],
    "@typescript-eslint/consistent-type-imports": [
        'error', {
            'prefer': 'type-imports'
        }
    ]
  },
  settings: {
    "import/resolver": {
        "typescript": {
          "directory": "./tsconfig.json"
        },
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
        }
      }
  }
}
