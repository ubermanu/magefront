import glob from 'fast-glob'
import fs from 'fs'
import path from 'path'
import logger from './logger.mjs'

/**
 * Crawl the Magento project source code and return a list of all the modules.
 * @param projectRoot
 * @return {{name, enabled, src}}
 */
export function getModules(projectRoot) {
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
  // Might be nice to restore the previous behavior, which was
  // scanning the composer.lock before hand.
  // The problem is that the module xml might be placed at different
  // locations according to the module source code.
  glob
    .sync('vendor/**/*/etc/module.xml', {
      cwd: projectRoot
    })
    .forEach((vendorSrc) => {
      const name = getNameFromModuleXml(path.join(projectRoot, vendorSrc))
      if (!modules[name]) {
        logger.warn(`Module "${name}" not found in config.php`)
        return
      }
      modules[name].src = vendorSrc.split('/').slice(0, -2).join('/')
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
export const getThemes = (projectRoot) => {
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
      const dest = path.join(
        'pub/static',
        designSrc.split('/').slice(2, -1).join('/')
      )
      const area = designSrc.split('/')[2]
      const parent = getParentFromThemeXml(path.join(projectRoot, designSrc))
      themes[name] = { name, src, dest, area, parent }
    })

  // Get the themes from the vendor directory.
  // Might be nice to restore the previous behavior, which was
  // scanning the composer.lock before hand.
  glob
    .sync('vendor/*/*/theme.xml', {
      cwd: projectRoot
    })
    .forEach((vendorSrc) => {
      const src = vendorSrc.split('/').slice(0, -1).join('/')
      const registration = fs.readFileSync(
        path.join(projectRoot, src, 'registration.php'),
        'utf8'
      )
      const [, area, name] = registration.match(
        /'(frontend|adminhtml)\/([\w\/]+)'/
      )
      const dest = `pub/static/${vendorSrc.split('/').slice(1, -1).join('/')}`
      const parent = getParentFromThemeXml(path.join(projectRoot, vendorSrc))
      themes[name] = { name, src, dest, area, parent }
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
