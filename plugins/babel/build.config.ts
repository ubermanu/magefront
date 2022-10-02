import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/plugin'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  }
})
