import glob from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import { getThemeDependencyTree } from '../magento/theme.js'

/**
 * Gather all the theme files and copy them to the temporary directory. When
 * this is done, the `build` task should be run afterwards.
 *
 * @type {import('types').Action}
 */
export const inheritance = async (context) => {
  const { rootPath } = context.magento
  const { tmp } = context.buildConfig

  /** @type {Map<string, string>} */
  const fileList = new Map()

  /**
   * Gather the files from the src directory and add them to the file tree.
   *
   * @param {string} src
   * @param {string} dest
   * @param {import('fast-glob').Pattern[]} ignore
   * @returns {Promise<void>}
   */
  async function fetchFiles(src, dest, ignore = []) {
    const files = await glob(src + '/**', {
      cwd: rootPath,
      ignore,
      onlyFiles: true,
    })

    await Promise.all(
      files.map(async (srcPath) => {
        const destPath = path.join(dest, srcPath.substring(src.length + 1))
        fileList.set(destPath, srcPath)
      })
    )
  }

  // Add the Magento core lib resources as a dependency for everyone
  // Ignore the css docs and txt files
  await fetchFiles(path.join('lib', 'web'), '', ['css/docs', '**/*.txt'])

  // For each enabled modules, copy the web resources into the theme temp dir
  const modules = context.magento.modules.filter((m) => m.enabled && m.src)
  const ignore = ['**/node_modules/**']

  await Promise.all(
    modules.map(async (m) => {
      // Resolve the "base" area as well (common to frontend and adminhtml)
      await fetchFiles(path.join(m.src, 'view', 'base', 'web'), m.name, ignore)
      await fetchFiles(
        path.join(m.src, 'view', context.theme.area, 'web'),
        m.name,
        ignore
      )
    })
  )

  // Copy the files from the themes
  for (const theme of getThemeDependencyTree(context.theme)) {
    // TODO: Implement custom ignore property in the theme config
    // TODO: Add support for a `.magefrontignore` file?
    await fetchFiles(path.join(theme.src, 'web'), '', ignore)

    // Add the submodule source files (ex: `Magento_Catalog/web`)
    await Promise.all(
      modules.map((m) => {
        return fetchFiles(path.join(theme.src, m.name, 'web'), m.name, ignore)
      })
    )
  }

  // Clean destination dir
  await fs.remove(tmp)

  // Generate the copies
  await Promise.all(
    Array.from(fileList.entries()).map(([destPath, srcPath]) => {
      return fs.copy(path.join(rootPath, srcPath), path.join(tmp, destPath))
    })
  )
}
