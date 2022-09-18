import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const external = ['commander', 'winston', 'path', 'fs-extra', 'fast-glob', 'fs', 'browser-sync', 'chokidar', 'cli-table']
const plugins = [typescript()]

export default [
  {
    input: 'src/main.ts',
    output: [
      {
        file: 'dist/magefront.cjs',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/magefront.mjs',
        format: 'es',
        sourcemap: true
      }
    ],
    external,
    plugins
  },
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/bin/magefront.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
      sourcemap: false
    },
    external,
    plugins
  },
  {
    input: 'types/main.d.ts',
    output: [
      {
        file: 'dist/magefront.d.ts',
        format: 'es'
      }
    ],
    plugins: [dts()]
  }
]
