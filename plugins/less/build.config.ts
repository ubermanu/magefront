import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['plugin'],
  externals: ['fast-glob', 'path', 'less', 'fs'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  }
})
