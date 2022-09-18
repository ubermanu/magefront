import glob, { Pattern } from 'fast-glob'
import path from 'path'
import fs from 'fs'
import postcss, { AcceptedPlugin } from 'postcss'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  plugins?: AcceptedPlugin[]
}

/**
 * @param {Options} options
 * @returns {function(*): Promise<Awaited<void>>}
 */
export default (options: Options = {}) => {
  const { src, ignore, plugins } = options

  // @ts-ignore
  return async (buildContext) => {
    const files = await glob(src ?? '**/!(_)*.css', { ignore: ignore ?? [], cwd: buildContext.src })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(buildContext.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const compiler = await postcss(plugins ?? [])

        compiler.process(fileContent, { from: filePath, to: filePath }).then((result) => {
          result.warnings().forEach((warn) => {
            console.warn(warn.toString())
          })

          fs.promises.writeFile(filePath, result.css)
        })
      })
    )
  }
}
