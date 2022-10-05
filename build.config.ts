import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: './src/main',
      name: 'magefront',
      declaration: true
    },
    {
      input: './src/cli',
      declaration: false
    }
  ],
  rollup: {
    emitCJS: true
  },
  clean: true,
  declaration: true
})
