import { babel } from '@rollup/plugin-babel';

export default [
  {
    input: 'source/index.js',
    output: {
      file: 'dist/cawgl.es5.js',
      format: 'cjs',
    },
    plugins: [
      babel({ babelHelpers: 'runtime' }),
    ],
  },
  {
    input: 'source/index.js',
    output: {
      file: 'dist/cawgl.es6.js',
      format: 'es',
    },
  },
];
