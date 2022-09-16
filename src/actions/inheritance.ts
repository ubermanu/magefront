import fs from 'fs-extra'
import glob, { Pattern } from 'fast-glob'
import path from 'path'

import { getModules, MagentoModule } from '../magento/module'
import { getThemes, MagentoTheme } from '../magento/theme'
import { rootPath, tempPath } from '../env'

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
   * Copy the files from the src to the destination directory.
   * @param src
   * @param dest
   * @param ignore
   */
  async function generateCopies(src: string, dest: string, ignore: Pattern[] = []) {
    const files = await glob(src + '/**', {
      cwd: rootPath,
      ignore: ignore.map((pattern) => path.join(src, pattern)),
      onlyFiles: true
    })
    await Promise.all(
      files.map((srcPath) => {
        return fs.copy(path.join(rootPath, srcPath), path.join(dest, srcPath).replace(src + '/', '/'))
      })
    )
  }

  /**
   * Return the list of all the parent themes.
   * @param themeName
   * @param dependencyTree
   */
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
    throw new Error(`Theme "${themeName}" not found.`)
  }

  const themeDest = path.join(rootPath, tempPath, currentTheme.dest)

  // Clean destination dir before generating new symlinks
  fs.removeSync(themeDest)

  // Add the Magento core lib resources as a dependency for everyone
  // Ignore the css docs and txt files
  await generateCopies('lib', themeDest, ['web/css/docs', '**/*.txt', 'web/i18n'])

  // For each enabled modules, create symlinks into the theme
  const modules: MagentoModule[] = getModules().filter((m) => m.enabled && m.src)
  const area = currentTheme.area
  const ignore = ['page_layout', 'layout', 'templates', 'ui_component', 'layouts.xml', 'email']

  await Promise.all(
    modules.map(async (m: MagentoModule) => {
      // Resolve the "base" area as well (common to frontend and adminhtml)
      await generateCopies(path.join(m.src, 'view', 'base'), path.join(themeDest, m.name), ignore)
      await generateCopies(path.join(m.src, 'view', area), path.join(themeDest, m.name), ignore)
    })
  )

  // Copy the files from the themes
  // TODO: Get the theme dependency tree beforehand
  await Promise.all(
    getThemeDependencyTree(themeName).map(async (themeName) => {
      const theme = findTheme(themeName)
      if (!theme) {
        return
      }

      // TODO: Implement custom ignore property in the theme config
      // TODO: Add support for a `.magefrontignore` file?
      await generateCopies(theme.src, themeDest, ['composer.json', '*.txt', 'etc', 'i18n', '*.php'])
    })
  )
}
