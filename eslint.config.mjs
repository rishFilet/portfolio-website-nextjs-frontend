import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      react,
      'typescript-sort-keys': typescriptSortKeys,
    },

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-unused-vars': 'off',
      'no-console': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'object-curly-spacing': ['error', 'always'],

      'react/jsx-curly-spacing': [
        'error',
        {
          when: 'never',
          children: true,
          allowMultiline: true,
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
            'object',
            'unknown',
          ],

          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'typescript-sort-keys/interface': 'warn',
      'typescript-sort-keys/string-enum': 'warn',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          parser: 'flow',
          semi: true,
          trailingComma: 'all',
          printWidth: 80,
          bracketSpacing: true,
          rangeEnd: 80,
        },
      ],
    },
  },
];