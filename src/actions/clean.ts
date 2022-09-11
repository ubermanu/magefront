import fs from 'fs'

import { getConfigForTheme } from '../config'

/**
 * Clean up all the generated files.
 *
 * @param {string} themeName
 * @returns {Promise<void>}
 */
export const clean = async (themeName: string) => {
  const themeConfig = await getConfigForTheme(themeName)

  // Cleanup the `temp` folder
  if (fs.existsSync(themeConfig.src)) {
    await fs.promises.rm(themeConfig.src, { recursive: true })
  }

  // Clean up the `pub/static` folder
  if (fs.existsSync(themeConfig.dest)) {
    await fs.promises.rm(themeConfig.dest, { recursive: true })
  }
}
