import fs from 'fs-extra'
import glob, { Pattern } from 'fast-glob'
import path from 'path'

import { getModules, MagentoModule } from '../magento/module'
import { getThemes, MagentoTheme } from '../magento/theme'
import { rootPath, tempPath } from '../env'

/**
 * Gather all the theme files and copy them to the temporary directory.
 * When this is done, the `build` task should be run afterwards.
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
      files.map(async (srcPath) => {
        const destPath = path.join(dest, srcPath.replace(src + '/', '/'))
        await fs.rm(destPath, { recursive: true, force: true })
        return fs.copy(path.join(rootPath, srcPath), destPath)
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

  // Clean destination dir
  fs.removeSync(themeDest)

  // Add the Magento core lib resources as a dependency for everyone
  // Ignore the css docs and txt files
  await generateCopies(path.join('lib', 'web'), themeDest, ['css/docs', '**/*.txt', 'i18n'])

  // For each enabled modules, copy the web resources into the theme temp dir
  const modules: MagentoModule[] = getModules().filter((m) => m.enabled && m.src)
  const area = currentTheme.area
  const ignore = ['**/node_modules/**']

  await Promise.all(
    modules.map(async (m: MagentoModule) => {
      // Resolve the "base" area as well (common to frontend and adminhtml)
      await generateCopies(path.join(m.src, 'view', 'base', 'web'), path.join(themeDest, m.name), ignore)
      await generateCopies(path.join(m.src, 'view', area, 'web'), path.join(themeDest, m.name), ignore)
    })
  )

  // Copy the files from the themes
  // TODO: Get the theme dependency tree beforehand
  for (const themeDependency of getThemeDependencyTree(themeName)) {
    const theme = findTheme(themeDependency)
    if (!theme) {
      return
    }

    // TODO: Implement custom ignore property in the theme config
    // TODO: Add support for a `.magefrontignore` file?
    await generateCopies(path.join(theme.src, 'web'), themeDest, ignore)

    // Add the submodule source files
    await Promise.all(
      modules.map((m: MagentoModule) => {
        return generateCopies(path.join(theme.src, m.name, 'web'), path.join(themeDest, m.name), ignore)
      })
    )
  }
}
