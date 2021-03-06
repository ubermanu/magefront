import fs from 'fs'
import glob from 'fast-glob'
import path from 'path'
import { getPackages, getRegistrations } from './composer.mjs'

export class Module {
  name
  src
  enabled
}

/**
 * Read the `config.php` file and return the modules list.
 * Resolve the modules paths from `app/code` then from the `vendor` directory.
 *
 * @param {string} projectRoot
 * @return Module[]
 */
export const getModules = (projectRoot = process.cwd()) => {
  const list = {}
  const config = fs.readFileSync(`${projectRoot}/app/etc/config.php`, 'utf8')

  // 1. Get the list of modules from the config file
  config.match(/'(\w+_\w+)'\s*=>\s*(\d)/g).forEach((match) => {
    const [, name, enabled] = match.match(/'(\w+_\w+)'\s*=>\s*(\d)/)
    const module = new Module()
    module.name = name
    module.enabled = enabled === '1'
    list[name] = module
  })

  // 2. Resolve the source path for the modules into `app/code/`
  const appCode = glob.sync('app/code/*/*', { onlyDirectories: true, cwd: projectRoot })

  appCode.forEach((codeSrc) => {
    const moduleXmlFile = path.join(projectRoot, codeSrc, 'etc/module.xml')

    if (!fs.existsSync(moduleXmlFile)) {
      console.warn(`Module XML file not found in ${codeSrc}`)
      return
    }

    const name = fetchNameFromModuleXml(moduleXmlFile)
    if (!list[name]) {
      console.warn(`Module "${name}" not found in config.php`)
      return
    }

    list[name].src = codeSrc.split('/').slice(0, 4).join('/')
  })

  // 3. Get the list of modules in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages = getPackages(projectRoot).filter((pkg) => pkg.type === 'magento2-module')

  packages.forEach((pkg) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const name = fetchNameFromModuleXml(path.join(projectRoot, src, 'etc/module.xml'))

      if (!list[name]) {
        console.warn(`Module "${name}" not found in config.php`)
        return
      }

      list[name].src = src
    })
  })

  return Object.values(list)
}

/**
 * Get the name of a module from its `etc/module.xml` file.
 *
 * @param {string} file
 * @return {string}
 */
function fetchNameFromModuleXml(file) {
  const moduleXml = fs.readFileSync(file, 'utf8')
  const [, name] = moduleXml.match(/<module[^>]+name="([^"]+)"/)
  return name
}
