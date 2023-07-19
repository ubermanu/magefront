import glob from 'fast-glob'
import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'

import { logger, rootPath } from '../env'
import type { ComposerPackage } from './composer'
import { getPackages, getRegistrations } from './composer'

export interface MagentoModule {
  name: string
  src: string
  enabled: boolean
}

/**
 * Read the `config.php` file and return the modules list. Resolve the modules paths from `app/code` then from the `vendor` directory.
 *
 * @returns MagentoModule[]
 */
export const getModules = memo(() => {
  const list: { [name: string]: MagentoModule } = {}
  const config = fs.readFileSync(path.join(rootPath, '/app/etc/config.php')).toString()

  if (!config) {
    logger.error('No config.php file found.')
    return []
  }

  // 1. Get the list of modules from the config file
  config.match(/'(\w+_\w+)'\s*=>\s*(\d)/g)?.forEach((match) => {
    const [, name, enabled] = match.match(/'(\w+_\w+)'\s*=>\s*(\d)/)
    list[name] = {
      name,
      enabled: enabled === '1',
      src: '',
    }
  })

  // 2. Resolve the source path for the modules into `app/code/`
  const appCode = glob.sync('app/code/*/*', {
    onlyDirectories: true,
    cwd: rootPath,
  })

  appCode.forEach((codeSrc) => {
    const moduleXmlFile = path.join(rootPath, codeSrc, 'etc/module.xml')

    if (!fs.existsSync(moduleXmlFile)) {
      logger.warn(`Module XML file not found in ${codeSrc}`)
      return
    }

    const name = fetchNameFromModuleXml(moduleXmlFile)
    if (!list[name]) {
      logger.warn(`Module "${name}" not found in config.php`)
      return
    }

    list[name].src = codeSrc.split('/').slice(0, 4).join('/')
  })

  // 3. Get the list of modules in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages: ComposerPackage[] = getPackages().filter((pkg: ComposerPackage) => pkg.type === 'magento2-module')

  packages.forEach((pkg: ComposerPackage) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const name = fetchNameFromModuleXml(path.join(rootPath, src, 'etc/module.xml'))

      if (!list[name]) {
        logger.warn(`Module "${name}" not found in config.php`)
        return
      }

      list[name].src = src
    })
  })

  return Object.values(list)
})

/**
 * Get the name of a module from its `etc/module.xml` file.
 *
 * @param {string} file
 * @returns {string}
 */
function fetchNameFromModuleXml(file: string) {
  const moduleXml = fs.readFileSync(file).toString()
  // @ts-ignore
  const [, name] = moduleXml.match(/<module[^>]+name="([^"]+)"/)
  return name
}
