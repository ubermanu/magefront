import path from 'path'
import glob from 'fast-glob'
import fs from 'fs'

/**
 * Merge all the requirejs-config files into one.
 *
 * @param {{src?: string, dest?: string}} options
 * @return {(function(*): void)|*}
 */
export default (options = {}) => {
  const { src, dest } = options
  let packed = ''

  return (themeConfig) => {
    const files = glob.sync(src || '*/requirejs-config.js', {
      cwd: themeConfig.src
    })

    // Sort by module order (defined in the config.php)
    // TODO: Handle errors
    const modules = themeConfig.modules
    files.sort((a, b) => {
      const [, modA] = a.match(/^(\w+_\w+)\/requirejs-config\.js$/)
      const [, modB] = b.match(/^(\w+_\w+)\/requirejs-config\.js$/)
      return modules.indexOf(modA) - modules.indexOf(modB)
    })

    files.forEach((file) => {
      const content = fs.readFileSync(path.join(themeConfig.src, file), 'utf8')
      packed += `(function(){\n${content}\nrequire.config(config);\n})();\n`
    })

    const file = path.join(themeConfig.dest, dest || 'requirejs-config.js')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, `(function(require){\n${packed}})(require);`)
  }
}
