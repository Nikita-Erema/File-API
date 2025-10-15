const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    // Для всех JS файлов
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    // Для тестов (Jest)
    files: ['**/*.test.js', '**/e2e/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    // Игнорируем папки
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '**/coverage/**'
    ],
  },
];