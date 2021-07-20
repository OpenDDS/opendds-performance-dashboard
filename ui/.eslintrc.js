module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    describe: 'readonly',
    expect: 'readonly',
    it: 'readonly',
    require: 'readonly',
    test: 'readonly',
    module: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [{files: ['*.svelte'], processor: 'svelte3/svelte3'}],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  rules: {}
};
