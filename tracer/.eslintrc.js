module.exports = {
  env: { browser: true, esnext: true },
  extends: ['plugin:solid/jsx', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['solid', '@typescript-eslint'],
  rules: {}
};
