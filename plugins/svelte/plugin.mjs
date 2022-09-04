import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { compile } from 'svelte/compiler'

/**
 * @param {{compilerOptions?: {}, css?: any, any}} options
 * @return {function}
 */
export default (options = {}) => {
  return (themeConfig) => {
    const compilerOptions = options.compilerOptions

    glob('**/*.svelte', { cwd: themeConfig.src }).then((files) => {
      return Promise.all(
        files.map((file) => {
          const filePath = path.join(themeConfig.src, file)
          const output = compile(fs.readFileSync(filePath, 'utf-8'), compilerOptions)
          fs.writeFileSync(path.join(themeConfig.src, file.replace(/\.svelte$/, '.js')), output.js.code)
        })
      )
    })
  }
}
