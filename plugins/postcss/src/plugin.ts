import glob, { type Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'node:path'
import postcss, { type AcceptedPlugin } from 'postcss'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  plugins?: AcceptedPlugin[]
}

/**
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited<void>>}
 */
export default (options: Options = {}) => {
  const { src, ignore, plugins } = options

  // @ts-ignore
  return async (buildContext) => {
    const files = await glob(src ?? '**/!(_)*.css', {
      ignore: ignore ?? [],
      cwd: buildContext.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(buildContext.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const compiler = await postcss(plugins ?? [])

        const result = await compiler.process(fileContent, {
          from: filePath,
          to: filePath,
        })

        // TODO: Forward to logger
        result.warnings().forEach((warn) => {
          console.warn(warn.toString())
        })

        return fs.promises.writeFile(filePath, result.css)
      })
    )
  }
}
