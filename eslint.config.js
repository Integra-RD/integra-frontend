import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: ['react-refresh', 'react-hooks', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
]
