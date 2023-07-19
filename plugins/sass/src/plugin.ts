import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs'
import path from 'node:path'
import dartSass, { type Options as RenderOptions, type SassException, type Result as SassResult } from 'sass'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compiler?: any
  compilerOptions?: RenderOptions
}

/** Compile SCSS files to CSS. You can use the `compiler` option to specify the sass compiler to use. (e.g. node-sass) */
export default (options: Options = {}): Plugin => {
  const { src, ignore, sourcemaps, compiler, compilerOptions } = { ...options }
  const sass = compiler ?? dartSass

  return async (context) => {
    const files = await glob(src ?? '**/!(_)*.scss', {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)

        return sass.render(
          {
            ...compilerOptions,
            file: filePath,
          },
          (err: SassException, output: SassResult) => {
            if (err) {
              console.error(err)
            } else {
              const cssFilePath = filePath.replace(/\.scss$/, '.css')
              fs.writeFileSync(cssFilePath, output.css, 'utf8')

              // TODO: The map is always null?
              if (sourcemaps && output.map) {
                fs.writeFileSync(`${cssFilePath}.map`, JSON.stringify(output.map), 'utf8')
              }
            }
          }
        )
      })
    )
  }
}
