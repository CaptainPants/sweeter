module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    //'plugin:import/recommended',
    //'plugin:import/typescript',
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
  },
}
