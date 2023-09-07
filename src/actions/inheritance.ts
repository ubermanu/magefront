import glob, { Pattern } from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import { getThemeDependencyTree } from '../magento/theme'
import type { Action, MagentoModule } from '../types'

/** Gather all the theme files and copy them to the temporary directory. When this is done, the `build` task should be run afterwards. */
export const inheritance: Action = async (context) => {
  const { rootPath, tempPath, themes } = context.magento

  /**
   * Copy the files from the src to the destination directory.
   *
   * @param src
   * @param dest
   * @param ignore
   */
  async function generateCopies(src: string, dest: string, ignore: Pattern[] = []) {
    const files = await glob(src + '/**', {
      cwd: rootPath,
      ignore: ignore.map((pattern) => path.join(src, pattern)),
      onlyFiles: true,
    })
    await Promise.all(
      files.map(async (srcPath) => {
        const destPath = path.join(dest, srcPath.replace(src + '/', '/'))
        await fs.rm(destPath, { recursive: true, force: true })
        return fs.copy(path.join(rootPath, srcPath), destPath)
      })
    )
  }

  const currentTheme = context.theme

  const themeDest = path.join(rootPath, tempPath, currentTheme.dest)

  // Clean destination dir
  fs.removeSync(themeDest)

  // Add the Magento core lib resources as a dependency for everyone
  // Ignore the css docs and txt files
  await generateCopies(path.join('lib', 'web'), themeDest, ['css/docs', '**/*.txt', 'i18n'])

  // For each enabled modules, copy the web resources into the theme temp dir
  const modules = context.magento.modules.filter((m) => m.enabled && m.src)
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
  for (const themeDependency of getThemeDependencyTree(context.theme)) {
    const theme = themes.find((t) => t.name === themeDependency)
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
