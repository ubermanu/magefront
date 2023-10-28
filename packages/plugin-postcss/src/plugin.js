import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'

/**
 * Transforms CSS files using PostCSS.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'postcss',

  async build(context) {
    const { src, ignore, plugins } = { ...options }

    const files = await glob(src ?? '**/!(_)*.css', {
      ignore: ignore ?? [],
      cwd: context.cwd,
    })

    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.join(context.cwd, file)
        const destPath = path.join(context.dest, file)

        const fileContent = await fs.readFile(srcPath)
        const compiler = postcss(plugins ?? [])

        const result = await compiler.process(fileContent, {
          from: srcPath,
          to: destPath,
        })

        // TODO: Forward to logger
        result.warnings().forEach((warn) => {
          console.warn(warn.toString())
        })

        return fs.writeFile(destPath, result.css)
      })
    )
  },
})
