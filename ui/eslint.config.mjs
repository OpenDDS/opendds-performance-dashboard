import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['.eslintrc.js', 'svelte.config.js', 'tsconfig.json', 'vite.config.js']
  },
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,ts,svelte}'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        DOMException: 'readonly',
        DOMStringList: 'readonly',
        Location: 'readonly',
        Response: 'readonly',
        SVGElement: 'readonly',
        console: 'readonly',
        clearInterval: 'readonly',
        describe: 'readonly',
        document: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',
        expect: 'readonly',
        fetch: 'readonly',
        HTMLInputElement: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        localStorage: 'readonly',
        module: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        test: 'readonly',
        window: 'readonly'
      }
    }
  },
  {
    files: ['src/**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tsParser
      }
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'warn',
      'svelte/no-reactive-reassign': 'warn',
      'svelte/prefer-svelte-reactivity': 'warn',
      'svelte/require-each-key': 'warn'
    }
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: false
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'off'
    }
  },
  prettier
];
