import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'

/**
 * Transforms CSS files using PostCSS.
 *
 * @param {import('types').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'postcss',

  async build(context) {
    const { src, ignore, plugins } = { ...options }

    const files = await glob(src ?? '**/!(_)*.css', {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath)
        const compiler = postcss(plugins ?? [])

        const result = await compiler.process(fileContent, {
          from: filePath,
          to: filePath,
        })

        // TODO: Forward to logger
        result.warnings().forEach((warn) => {
          console.warn(warn.toString())
        })

        return fs.writeFile(filePath, result.css)
      })
    )
  },
})
