import path from 'path'
import glob from 'fast-glob'
import fs from 'fs'

/**
 * Merge all the requirejs-config files into one.
 *
 * @returns {function(*): Promise<void>}
 */
export default () => {
  // @ts-ignore
  return async (themeConfig) => {
    const files: string[] = []

    // @ts-ignore
    const moduleList = themeConfig.moduleList.filter((mod) => mod.enabled && mod.src)

    // Get the `requirejs-config.js` files from the modules
    // FIXME: Check for the module dependency tree (to get the correct order)
    // @ts-ignore
    moduleList.forEach((mod) => {
      const filePath = path.join(mod.src, 'view/frontend/requirejs-config.js')
      if (fs.existsSync(filePath)) {
        files.push(filePath)
      }
    })

    // Get the `requirejs-config.js` files from the theme
    //FIXME: Might need to check for the parent themes as well.
    const themeFiles = await glob(['requirejs-config.js', '[A-Z]*_[A-Z]*/requirejs-config.js'], { cwd: themeConfig.src })
    themeFiles.forEach((file) => {
      files.push(path.join(themeConfig.src, file))
    })

    const packed = await Promise.all(
      files.map(async (filePath) => {
        const fileContent = await fs.promises.readFile(filePath)
        return `(function(){\n${fileContent}\nrequire.config(config);\n})();\n`
      })
    )

    // Output the final requirejs-config.js file, so it can be deployed
    const file = path.join(themeConfig.src, 'requirejs-config.js')

    return fs.promises.writeFile(file, `(function(require){\n${packed.join('')}})(require);`)
  }
}
