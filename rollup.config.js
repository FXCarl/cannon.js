import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const extensions = ['.ts']

const babelOptions = {
  babelrc: false,
  extensions,
  exclude: '**/node_modules/**',
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: '>1%, not dead, not ie 11, not op_mini all',
      },
    ],
    '@babel/preset-typescript',
  ],
}

export default [
  {
    input: `./src/cannon-es`,
    output: { file: `dist/cannon-es.js`, format: 'esm' },
    plugins: [json(), resolve({ extensions }), babel(babelOptions), sizeSnapshot()],
  },
  {
    input: `./src/cannon-es`,
    output: { file: `dist/cannon-es.cjs.js`, format: 'cjs' },
    plugins: [
      json(),
      resolve({ extensions }),
      babel(babelOptions),
      sizeSnapshot(),
      replace({
        // Use node built-in performance.now in commonjs environments
        'globalThis.performance': `require('perf_hooks').performance`,
      }),
    ],
  },
]
