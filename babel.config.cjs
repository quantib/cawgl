module.exports = {
  presets: [
    ['@babel/preset-env', { modules: 'auto' }],
  ],
  plugins: [
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-transform-runtime',
  ],
};
