import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss, { type AcceptedPlugin } from 'postcss'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  plugins?: AcceptedPlugin[]
}

/** Transforms CSS files using PostCSS. */
export default (options?: Options): Plugin => {
  const { src, ignore, plugins } = { ...options }

  return async (context) => {
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
  }
}
