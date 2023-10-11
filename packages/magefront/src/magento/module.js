import glob from 'fast-glob'
import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'
import { getRegistrations } from './composer.js'

/**
 * Read the `config.php` file and return the modules list. Resolve the modules
 * paths from `app/code` then from the `vendor` directory.
 *
 * @type {(
 *   context: import('types').MagentoContext
 * ) => import('types').MagentoModule[]}
 */
export const getModules = memo((context) => {
  const { rootPath } = context

  /** @type {Map<string, import('types').MagentoModule>} */
  const modules = new Map()

  const config = fs
    .readFileSync(path.join(rootPath, '/app/etc/config.php'))
    .toString()

  if (!config) {
    // FIXME: logger.error('No config.php file found.')
    return []
  }

  // 1. Get the list of modules from the config file
  config.match(/'(\w+_\w+)'\s*=>\s*(\d)/g)?.forEach((match) => {
    const [, name, enabled] = match.match(/'(\w+_\w+)'\s*=>\s*(\d)/) ?? []
    modules.set(name, {
      name,
      enabled: enabled === '1',
      src: '',
    })
  })

  // 2. Resolve the source path for the modules into `app/code/`
  const appCode = glob.sync('app/code/*/*', {
    onlyDirectories: true,
    cwd: rootPath,
  })

  appCode.forEach((codeSrc) => {
    const moduleXmlFile = path.join(rootPath, codeSrc, 'etc/module.xml')

    if (!fs.existsSync(moduleXmlFile)) {
      // FIXME: logger.warn(`Module XML file not found in ${codeSrc}`)
      return
    }

    const name = fetchNameFromModuleXml(moduleXmlFile)
    if (!modules.has(name)) {
      // FIXME: logger.warn(`Module "${name}" not found in config.php`)
      return
    }

    const module = modules.get(name)
    if (module) {
      module.src = codeSrc.split('/').slice(0, 4).join('/')
    }
  })

  // 3. Get the list of modules in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages = context.packages.filter(
    (pkg) => pkg.type === 'magento2-module'
  )

  packages.forEach((pkg) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const name = fetchNameFromModuleXml(
        path.join(rootPath, src, 'etc/module.xml')
      )

      if (!modules.has(name)) {
        // FIXME: logger.warn(`Module "${name}" not found in config.php`)
        return
      }

      const module = modules.get(name)
      if (module) {
        module.src = src
      }
    })
  })

  return Array.from(modules.values())
})

/**
 * Get the name of a module from its `etc/module.xml` file.
 *
 * @param {string} file
 * @returns {string}
 */
function fetchNameFromModuleXml(file) {
  const moduleXml = fs.readFileSync(file).toString()
  const [, name] = moduleXml.match(/<module[^>]+name="([^"]+)"/) ?? []
  return name
}
