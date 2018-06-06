import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

const shouldCompileDeclaration = !!process.env.declaration;
const shouldMinify = !!process.env.minify;

let plugins = [
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        declaration: shouldCompileDeclaration,
      },
    },
    check: true,
  }),
  resolve({
    module: true,
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
  exports: 'named',
};
