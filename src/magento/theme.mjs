import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { getPackages, getRegistrations } from './composer.mjs'
import { Module } from './module.mjs'

export class Theme extends Module {
  enabled = true
  area
  parent = null
  modules = []

  get dest() {
    return path.join('pub/static', this.area + '/' + this.name)
  }
}

/**
 * Crawl the Magento project source code and return a list of all the themes.
 *
 * @param projectRoot
 * @return Theme[]
 */
export const getThemes = (projectRoot = process.cwd()) => {
  const list = {}

  // 1. Get the list of themes from the `app/design/` directory.
  const appDesign = glob.sync('app/design/{frontend,adminhtml}/*/*/theme.xml', { cwd: projectRoot })

  appDesign.forEach((designSrc) => {
    const theme = new Theme()
    theme.name = designSrc.split('/').slice(3, -1).join('/')
    theme.src = designSrc.split('/').slice(0, -1).join('/')
    theme.area = designSrc.split('/')[2]
    theme.parent = getParentFromThemeXml(path.join(projectRoot, designSrc))
    list[theme.name] = theme
  })

  // 2. Get the themes from the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages = getPackages(projectRoot).filter((pkg) => pkg.type === 'magento2-theme')

  packages.forEach((pkg) => {
    getRegistrations(pkg).forEach((registration) => {
      const theme = new Theme()
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const { name, area } = getThemeNameAndAreaFromRegistrationPhp(path.join(projectRoot, src, 'registration.php'))
      theme.name = name
      theme.src = src
      theme.area = area
      theme.parent = getParentFromThemeXml(path.join(projectRoot, src, 'theme.xml'))
      list[name] = theme
    })
  })

  return Object.values(list)
}

/**
 * Get the parent of a theme from its `theme.xml` file.
 *
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
 *
 * @param file
 * @return {{area: string, name: string}}
 */
function getThemeNameAndAreaFromRegistrationPhp(file) {
  const registration = fs.readFileSync(file, 'utf8')
  const [, area, name] = registration.match(/'(frontend|adminhtml)\/([\w\/]+)'/)
  return { name, area }
}
