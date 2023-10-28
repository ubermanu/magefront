import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Fetches all the `requirejs-config.js` files from the modules source dirs and
 * the theme, and merge them into one file.
 *
 * @returns {import('magefront').Plugin}
 */
export default () => ({
  name: 'requirejs-config',

  async build(context) {
    const { theme, themeDependencyTree } = context
    const { modules, rootPath } = context.magento

    /** @type {Set<string>} */
    const files = new Set()

    // Get the `requirejs-config.js` files from the modules
    modules.forEach((mod) => {
      const baseFilePath = path.join(
        rootPath,
        mod.src,
        'view',
        'base',
        'requirejs-config.js'
      )

      if (fs.existsSync(baseFilePath)) {
        files.add(baseFilePath)
        return
      }

      const filePath = path.join(
        rootPath,
        mod.src,
        'view',
        theme.area,
        'requirejs-config.js'
      )

      if (fs.existsSync(filePath)) {
        files.add(filePath)
      }
    })

    // Get the `requirejs-config.js` files from the theme (and its parents)
    for (const themeDependency of themeDependencyTree) {
      const cwd = path.join(rootPath, themeDependency.src)

      // Keep the order of the modules defined in the `config.php` file
      const entries = modules.map((mod) =>
        path.join(mod.name, 'requirejs-config.js')
      )

      const themeFiles = await glob([...entries, 'requirejs-config.js'], {
        cwd,
      })

      themeFiles.forEach((file) => {
        files.add(path.join(cwd, file))
      })
    }

    const packed = await Promise.all(
      Array.from(files).map(async (filePath) => {
        const fileContent = await fs.promises.readFile(filePath)
        return `(function(){\n${fileContent}\nrequire.config(config);\n})();\n`
      })
    )

    // Output the final requirejs-config.js file, so it can be deployed
    const file = path.join(context.cwd, 'requirejs-config.js')
    await fs.promises.writeFile(
      file,
      `(function(require){\n${packed.join('')}})(require);`
    )
  },
})
