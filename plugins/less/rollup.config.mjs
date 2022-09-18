import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'plugin.ts',
    output: {
      file: 'dist/plugin.js',
      format: 'es',
      sourcemap: false
    },
    external: ['fast-glob', 'path', 'less', 'fs'],
    plugins: [typescript({ inlineSourceMap: false })]
  }
]
