import path from 'path'
import glob from 'fast-glob'
import fs from 'fs'

/**
 * Merge all the requirejs-config files into one.
 *
 * @param options
 * @return {(function(*): void)|*}
 */
export default (options) => (themeConfig) => {
  options = options || {}
  const { src, dest } = options

  let packed = ''

  glob
    .sync(path.join(themeConfig.src, src || '*/requirejs-config.js'))
    .forEach((file) => {
      const content = fs.readFileSync(file, 'utf8')
      packed += `(function(){\n${content}\nrequire.config(config);\n})();\n`
    })

  const file = path.join(themeConfig.dest, dest || 'requirejs-config.js')
  fs.writeFileSync(file, `(function(require){\n${packed}})(require);`)
}
