// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'pocketbase']),
  
  // 1. Standard React Frontend Rules
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/workers/**/*.js'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': 'warn', 
      'no-empty': 'warn',
    }
  },

  // 2. Web Worker Rules (for pythonWorker.js)
  {
    files: ['src/workers/**/*.js'],
    languageOptions: {
      globals: { 
        ...globals.worker,
        loadPyodide: 'readonly' 
      },
    },
    rules: {
      'no-undef': 'warn', // Pyodide is injected via CDN
    }
  },

  // 3. Node.js Rules (for config files and e2e tests)
  {
    files: ['*.config.js', 'e2e/**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  }
])