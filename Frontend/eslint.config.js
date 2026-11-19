// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [...rootConfig.configs.tsRecommended, ...tseslint.configs.recommended],
    processor: rootConfig.processInlineTemplates,
    rules: {
      // Angular Component & Directive Architecture
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Component', 'App'],
        },
      ],

      // TypeScript & Code Quality
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...rootConfig.configs.templateRecommended,
      ...rootConfig.configs.templateAccessibility,
    ],
    rules: {
      // Mandatory Modern Angular Control Flow
      '@angular-eslint/template/prefer-control-flow': 'error',

      // Template Expression Quality
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
  // Integration with Prettier (disables conflicting formatting rules)
  eslintConfigPrettier,
);
