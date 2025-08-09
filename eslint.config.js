export default {
  languageOptions: {
    globals: {
      window: 'readonly',
      document: 'readonly',
      console: 'readonly',
      navigator: 'readonly',
      localStorage: 'readonly'
    },
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'comma-dangle': ['error', 'never']
  }
}
