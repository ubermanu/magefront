import glob from 'fast-glob'
import fs from 'fs'
import path from 'path'
import logger from './logger.mjs'

/**
 * Crawl the Magento project source code and return a list of all the modules.
 * @param projectRoot
 * @return {{name, enabled, src}}
 */
export function getModules(projectRoot = null) {
  projectRoot = projectRoot || process.cwd()
  const modules = {}

  // Get the list of modules from the config file.
  const config = fs.readFileSync(`${projectRoot}/app/etc/config.php`, 'utf8')
  config.match(/'(\w+_\w+)'\s*=>\s*(\d)/g).forEach((match) => {
    const [, module, enabled] = match.match(/'(\w+_\w+)'\s*=>\s*(\d)/)
    modules[module] = { name: module, enabled: enabled === '1', src: null }
  })

  // Resolve the source path for the modules into `app/code/`
  glob
    .sync('app/code/*/*', {
      onlyDirectories: true,
      cwd: projectRoot
    })
    .forEach((codeSrc) => {
      const moduleXmlFile = path.join(projectRoot, codeSrc, 'etc/module.xml')
      if (!fs.existsSync(moduleXmlFile)) {
        logger.warn(`Module XML file not found in ${codeSrc}`)
        return
      }
      const name = getNameFromModuleXml(moduleXmlFile)
      if (!modules[name]) {
        logger.warn(`Module "${name}" not found in config.php`)
        return
      }
      modules[name].src = codeSrc.split('/').slice(0, 4).join('/')
    })

  // Get the list of modules in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  getComposerPackages(projectRoot)
    .filter((pkg) => pkg.type === 'magento2-module')
    .forEach((pkg) => {
      getPackageRegistrations(pkg).forEach((registration) => {
        const src = path.join('vendor', pkg.name, path.dirname(registration))
        const name = getNameFromModuleXml(path.join(projectRoot, src, 'etc/module.xml'))
        if (!modules[name]) {
          logger.debug(`Module "${name}" not found in config.php`)
          return
        }
        modules[name].src = src
      })
    })

  return modules
}

/**
 * Return a list of module names that are enabled in the Magento project.
 * @return {[]}
 */
export const getEnabledModuleNames = () => {
  return Object.values(getModules())
    .filter((m) => m.enabled && m.src)
    .map((m) => m.name)
}

/**
 * Crawl the Magento project source code and return a list of all the themes.
 * @param projectRoot
 * @return {{name, src, dest, area, parent}}
 */
export const getThemes = (projectRoot = null) => {
  projectRoot = projectRoot || process.cwd()
  const themes = {}

  // Get the list of themes from the `app/design/` directory.
  glob
    .sync('app/design/{frontend,adminhtml}/*/*/theme.xml', {
      cwd: projectRoot
    })
    .forEach((designSrc) => {
      const name = designSrc.split('/').slice(3, -1).join('/')
      const src = designSrc.split('/').slice(0, -1).join('/')
      const area = designSrc.split('/')[2]
      const dest = path.join('pub/static', area, name)
      const parent = getParentFromThemeXml(path.join(projectRoot, designSrc))
      themes[name] = { name, src, dest, area, parent }
    })

  // Get the themes from the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  getComposerPackages(projectRoot)
    .filter((pkg) => pkg.type === 'magento2-theme')
    .forEach((pkg) => {
      getPackageRegistrations(pkg).forEach((registration) => {
        const src = path.join('vendor', pkg.name, path.dirname(registration))
        const { name, area } = getThemeNameAndAreaFromRegistrationPhp(path.join(projectRoot, src, 'registration.php'))
        const dest = path.join('pub/static', area, name)
        const parent = getParentFromThemeXml(path.join(projectRoot, src, 'theme.xml'))
        themes[name] = { name, src, dest, area, parent }
      })
    })

  return themes
}

/**
 * Get the theme by name.
 * @param name
 * @return {*}
 */
export const getTheme = (name) => {
  const themes = getThemes()
  if (!themes[name]) {
    throw new Error(`Theme "${name}" not found`)
  }
  return themes[name]
}

/**
 * Get the list of packages installed.
 * @param projectRoot
 * @return {*}
 */
function getComposerPackages(projectRoot = null) {
  projectRoot = projectRoot || process.cwd()
  const composerLock = path.join(projectRoot, 'composer.lock')
  if (!fs.existsSync(composerLock)) {
    throw new Error(`composer.lock not found in ${projectRoot}`)
  }
  const lock = JSON.parse(fs.readFileSync(composerLock, 'utf8'))
  return lock['packages'] || []
}

/**
 * Get the name of a module from its `etc/module.xml` file.
 * @param file
 * @return {string}
 */
function getNameFromModuleXml(file) {
  const moduleXml = fs.readFileSync(file, 'utf8')
  const [, name] = moduleXml.match(/<module[^>]+name="([^"]+)"/)
  return name
}

/**
 * Get the parent of a theme from its `theme.xml` file.
 * @param file
 * @return {string|false}
 */
function getParentFromThemeXml(file) {
  const themeXml = fs.readFileSync(file, 'utf8')
  const match = themeXml.match(/<parent>(.*)<\/parent>/)
  return match ? match[1].trim() : false
}

/**
 * Get the name and area of a theme from its `registration.php` file.
 * @param file
 * @return {{area: string, name: string}}
 */
function getThemeNameAndAreaFromRegistrationPhp(file) {
  const registration = fs.readFileSync(file, 'utf8')
  const [, area, name] = registration.match(/'(frontend|adminhtml)\/([\w\/]+)'/)
  return { name, area }
}

/**
 * Return a list of registration files for the given
 * composer package config.
 * TODO: At one point this could be any file, not just `registration.php`.
 * @param pkg
 * @return {[]}
 */
function getPackageRegistrations(pkg) {
  return (pkg?.autoload?.files || []).filter((file) => file.endsWith('registration.php'))
}
