import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Merge all the requirejs-config files into one.
 *
 * @returns {import('magefront').Plugin}
 */
export default () => ({
  name: 'requirejs-config',

  async build(context) {
    /** @type {string[]} */
    const files = []
    const { themeList, themeDependencyTree } = context
    const moduleList = context.moduleList.filter(
      (mod) => mod.enabled && mod.src
    )

    /** @type {import('magefront').MagentoTheme | undefined} */
    const theme = themeList.find((theme) => theme.name === context.theme)

    // TODO: Remove once the theme object is passed in context
    if (!theme) {
      throw new Error(`Theme "${context.theme}" not found.`)
    }

    // Get the `requirejs-config.js` files from the modules
    // FIXME: Check for the module dependency tree (to get the correct order)
    moduleList.forEach((mod) => {
      const baseFilePath = path.join(
        context.cwd,
        mod.src,
        'view',
        'base',
        'requirejs-config.js'
      )
      if (fs.existsSync(baseFilePath)) {
        files.push(baseFilePath)
      }
      const filePath = path.join(
        context.cwd,
        mod.src,
        'view',
        theme.area,
        'requirejs-config.js'
      )
      if (fs.existsSync(filePath)) {
        files.push(filePath)
      }
    })

    // Get the `requirejs-config.js` files from the theme (and its parents)
    for (const dependencyName of themeDependencyTree) {
      const themeDependency = themeList.find(
        (theme) => theme.name === dependencyName
      )

      if (!themeDependency) {
        throw new Error(`Theme "${dependencyName}" not found.`)
      }

      const cwd = path.join(context.cwd, themeDependency.src)
      const themeFiles = await glob(
        ['[A-Z]*_[A-Z]*/requirejs-config.js', 'requirejs-config.js'],
        { cwd }
      )

      themeFiles.forEach((file) => {
        files.push(path.join(cwd, file))
      })
    }

    const packed = await Promise.all(
      files.map(async (filePath) => {
        const fileContent = await fs.promises.readFile(filePath)
        return `(function(){\n${fileContent}\nrequire.config(config);\n})();\n`
      })
    )

    // Output the final requirejs-config.js file, so it can be deployed
    const file = path.join(context.src, 'requirejs-config.js')
    await fs.promises.writeFile(
      file,
      `(function(require){\n${packed.join('')}})(require);`
    )
  },
})
