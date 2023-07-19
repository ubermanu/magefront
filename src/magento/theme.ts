import glob from 'fast-glob'
import fs from 'fs'
import memo from 'memoizee'
import path from 'path'

import { rootPath } from '../env'
import type { ComposerPackage } from './composer'
import { getPackages, getRegistrations } from './composer'
import type { MagentoModule } from './module'

export interface MagentoTheme extends MagentoModule {
  area: string
  parent: string | false
  dest: string
}

/**
 * Crawl the Magento project source code and return a list of all the themes.
 *
 * @returns MagentoTheme[]
 */
export const getThemes = memo(() => {
  const list: { [name: string]: MagentoTheme } = {}

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
  const packages: ComposerPackage[] = getPackages().filter((pkg: ComposerPackage) => pkg.type === 'magento2-theme')

  packages.forEach((pkg: ComposerPackage) => {
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

  return Object.values(list)
})

/**
 * Get the parent of a theme from its `theme.xml` file.
 *
 * @param {string} file
 * @returns {string | false}
 */
function getParentFromThemeXml(file: string) {
  const themeXml = fs.readFileSync(file, 'utf8')
  const match = themeXml.match(/<parent>(.*)<\/parent>/)
  return match ? match[1].trim() : false
}

/**
 * Get the name and area of a theme from its `registration.php` file.
 *
 * @param {string} file
 * @returns {{ area: string; name: string }}
 */
function getThemeNameAndAreaFromRegistrationPhp(file: string) {
  const registration = fs.readFileSync(file).toString()
  // @ts-ignore
  const [, area, name] = registration.match(/'(frontend|adminhtml)\/([\w\/]+)'/)
  return { name, area }
}

/**
 * Get a theme by its name.
 *
 * @memoized
 */
export const findTheme = memo((themeName: string) => {
  return getThemes().find((theme) => theme.name === themeName)
})

/** @param themeName */
export const getThemeDependencyTree = memo((themeName: string): string[] => {
  return __resolveThemeDependencyTree(themeName)
})

/**
 * @param themeName
 * @param dependencyTree
 * @internal
 */
function __resolveThemeDependencyTree(themeName: string, dependencyTree: string[] = []): string[] {
  dependencyTree = dependencyTree ? dependencyTree : []
  dependencyTree.push(themeName)
  const theme = findTheme(themeName)

  if (theme && theme.parent) {
    return __resolveThemeDependencyTree(theme.parent, dependencyTree)
  } else {
    return dependencyTree.reverse()
  }
}
