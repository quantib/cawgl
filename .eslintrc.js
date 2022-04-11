module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      jest: {
        jestConfigFile: './jest.config.cjs',
      },
    },
  },
};
