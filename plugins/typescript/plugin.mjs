import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import typescript from 'typescript'

/**
 * @param {{compilerOptions?: {}, any}} options
 * @return {function}
 */
export default (options = {}) => {
  return (themeConfig) => {
    const compilerOptions = options.compilerOptions ?? {}

    glob('**/*.ts', { cwd: themeConfig.src }).then((files) => {
      return Promise.all(
        files.map((file) => {
          const filePath = path.join(themeConfig.src, file)
          const output = typescript.transpile(fs.readFileSync(filePath, 'utf-8').toString(), compilerOptions)
          fs.writeFileSync(path.join(themeConfig.src, file.replace(/\.ts$/, '.js')), output)
        })
      )
    })
  }
}
