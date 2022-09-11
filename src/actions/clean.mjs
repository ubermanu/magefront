import fs from 'fs'

import { getConfigForTheme } from '../config.mjs'
import { getThemes } from '../magento/theme.mjs'

/**
 * Clean up all the generated files.
 *
 * @param {string} themeName
 * @returns {Promise<void>}
 */
export const clean = async (themeName) => {
  const themeConfig = await getConfigForTheme(themeName)
  const theme = getThemes().find((t) => t.name === themeName)

  // Cleanup the `temp` folder
  if (fs.existsSync(themeConfig.dest)) {
    await fs.promises.rm(themeConfig.dest, { recursive: true })
  }

  // Clean up the `pub/static` folder
  if (fs.existsSync(theme.dest)) {
    await fs.promises.rm(theme.dest, { recursive: true })
  }
}
