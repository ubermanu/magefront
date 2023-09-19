import glob from 'fast-glob'
import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'
import { getRegistrations } from './composer.js'

/**
 * Crawl the Magento project source code and return a list of all the themes.
 *
 * @type {(context: import('types').MagentoContext) => import('types').MagentoTheme[]}
 */
export const getThemes = memo((context) => {
  const { rootPath } = context

  /** @type {{ [name: string]: Omit<import('types').MagentoTheme, 'parent'> & { parent: string | null } }} */
  const list = {}

  // 1. Get the list of themes from the `app/design/` directory.
  const appDesign = glob.sync('app/design/{frontend,adminhtml}/*/*/theme.xml', {
    cwd: rootPath,
  })

  appDesign.forEach((designSrc) => {
    const name = designSrc.split('/').slice(3, -1).join('/')
    const area = designSrc.split('/')[2]

    list[name] = {
      name,
      src: designSrc.split('/').slice(0, -1).join('/'),
      area,
      parent: getParentFromThemeXml(path.join(rootPath, designSrc)),
      dest: path.join('pub/static', area, name),
      enabled: true,
    }
  })

  // 2. Get the themes from the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  /** @type {import('types').ComposerPackage[]} */
  const packages = context.packages.filter((pkg) => pkg.type === 'magento2-theme')

  packages.forEach((pkg) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const { name, area } = getThemeNameAndAreaFromRegistrationPhp(path.join(rootPath, src, 'registration.php'))

      list[name] = {
        name,
        src,
        area,
        parent: getParentFromThemeXml(path.join(rootPath, src, 'theme.xml')),
        dest: path.join('pub/static', area, name),
        enabled: true,
      }
    })
  })

  // 3. Attach the parent theme to each theme
  return Object.values(list).map(
    ({ parent, ...rest }) =>
      /** @type {import('types').MagentoTheme} */ ({
        ...rest,
        parent: parent ? list[parent] : null,
      })
  )
})

/**
 * Get the parent of a theme from its `theme.xml` file.
 *
 * @param {string} file
 * @returns {string | null}
 */
function getParentFromThemeXml(file) {
  const themeXml = fs.readFileSync(file).toString()
  const match = themeXml.match(/<parent>(.*)<\/parent>/)
  return match ? match[1].trim() : null
}

/**
 * Get the name and area of a theme from its `registration.php` file.
 *
 * @param {string} file
 * @returns {{ area: string; name: string }}
 */
function getThemeNameAndAreaFromRegistrationPhp(file) {
  const registration = fs.readFileSync(file).toString()
  const [, area, name] = registration.match(/'(frontend|adminhtml)\/([\w/]+)'/) ?? []
  return { name, area }
}

/**
 * Get the theme dependency tree with the upmost parent first. Also contains the theme itself!
 *
 * Example:
 *
 * If your theme extends `Magento/luma` which extends `Magento/blank`, the tree will be:
 *
 * - Magento/blank
 * - Magento/luma
 * - Vendor/theme-child
 *
 * @param {import('types').MagentoTheme} theme
 * @returns {import('types').MagentoTheme[]}
 */
export function getThemeDependencyTree(theme) {
  /** @type {import('types').MagentoTheme[]} */
  const tree = [theme]
  let cur = theme

  while (cur.parent) {
    tree.push(cur.parent)
    cur = cur.parent
  }

  return tree.reverse()
}
