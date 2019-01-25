import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

const shouldMinify = !!process.env.minify;

let plugins = [
  resolve({
    extensions: ['.ts', '.js'],
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.ts'],
  }),
  commonjs({
    namedExports: {
      'async-disk-cache': ['default'],
    },
    ignore: ['istextorbinary'],
  }),
  json(),
];

if (shouldMinify) {
  plugins = [...plugins, terser()];
}


export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
  },
  plugins,
  external: ['path', 'fs', 'os', 'tty', 'net', 'zlib', 'crypto', 'child_process', 'util', 'http', 'https', 'stream'],
};
