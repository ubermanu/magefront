import fs from 'fs-extra'
import glob, { Pattern } from 'fast-glob'
import path from 'path'

import { getModules } from '../magento/module'
import { getThemes, MagentoTheme } from '../magento/theme'
import { logger, rootPath, tempPath } from '../env'

/**
 * Gather all the theme files and copy them to the temporary directory.
 * When this is done, the `build` task should be run afterwards.
 * TODO: Use promises for a faster copy.
 *
 * @param {string} themeName
 */
export const inheritance = async (themeName: string) => {
  const themeList: MagentoTheme[] = getThemes()

  /**
   * @param {string} name
   * @return MagentoTheme|undefined
   */
  function findTheme(name: string) {
    return themeList.find((theme) => theme.name === name)
  }

  /**
   * Copy a file from the source to the destination.
   * TODO: Remove the `removeSync` call and use `fs.copy` instead.
   * @param srcPath
   * @param destPath
   */
  function createCopy(srcPath: string, destPath: string) {
    fs.removeSync(destPath)
    fs.copySync(srcPath, destPath)
  }

  function generateCopies(src: string, dest: string, replacePattern: string, ignore: Pattern[] = []) {
    glob.sync(src + '/**', { ignore, onlyFiles: true }).forEach((srcPath) => {
      createCopy(srcPath, path.join(dest, srcPath.toString()).replace(src + '/', replacePattern + '/'))
    })
  }

  function getThemeDependencyTree(themeName: string, dependencyTree: string[] = []): string[] {
    dependencyTree = dependencyTree ? dependencyTree : []
    dependencyTree.push(themeName)
    const theme = findTheme(themeName)

    if (theme && theme.parent) {
      return getThemeDependencyTree(theme.parent, dependencyTree)
    } else {
      return dependencyTree.reverse()
    }
  }

  const currentTheme = findTheme(themeName)

  if (!currentTheme) {
    logger.error(`Theme "${themeName}" not found.`)
    return
  }

  const themeDest = path.join(rootPath, tempPath, currentTheme.dest)

  // Clean destination dir before generating new symlinks
  fs.removeSync(themeDest)

  // Add the Magento/base resources as a dependency for everyone
  // TODO: Might have too many ignores here (for backend theme)
  const libSrc = path.join(rootPath, 'lib')
  generateCopies(libSrc, themeDest, '', ['internal/*', 'web/css/docs'])

  // For each enabled modules, create symlinks into the theme
  const modules = getModules().filter((m) => m.enabled && m.src)
  const area = currentTheme.area
  const ignore = ['page_layout', 'layout', 'templates']

  modules.forEach((m) => {
    // Resolve the "base" area as well (common to frontend and adminhtml)
    generateCopies(path.join(rootPath, m.src, 'view', 'base'), path.join(themeDest, m.name), '', ignore)
    generateCopies(path.join(rootPath, m.src, 'view', area), path.join(themeDest, m.name), '', ignore)
  })

  // Create symlinks for all the related themes
  getThemeDependencyTree(themeName).forEach((themeName) => {
    const theme = findTheme(themeName)
    if (!theme) {
      return
    }
    const themeSrc = path.join(rootPath, theme.src)
    // TODO: Implement custom ignore property in the theme config
    // TODO: Add support for a `.magefrontignore` file?
    generateCopies(themeSrc, themeDest, '', [])
  })
}
