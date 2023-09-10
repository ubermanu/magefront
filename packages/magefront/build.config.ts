import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: './src/main',
      name: 'magefront',
    },
    {
      input: './src/cli',
    },
  ],
  rollup: {
    emitCJS: true,
  },
  clean: true,
})
