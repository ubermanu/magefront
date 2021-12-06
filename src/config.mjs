import fs from 'fs'
import path from 'path'
import { getTheme } from './magento.mjs'
import less from 'magefront-plugin-less'

// This tool is meant to be run at root level of the project
export const projectPath = process.cwd()
const relTempPath = 'var/view_preprocessed/magefront'
export const tempPath = path.join(projectPath, relTempPath)

/**
 * Get the configuration for the given theme name.
 * The theme config is passed to the plugins.
 *
 * @param themeName
 * @return {Promise<{locales, plugins, src, dest}>}
 */
export const getConfigForTheme = async (themeName) => {
  const theme = getTheme(themeName)

  const customConfig = await getConfigFromFile(
    path.join(projectPath, 'magefront.config.js')
  )

  const defaultConfig = {
    locales: ['en_US'],
    plugins: [less()],
    src: path.join(relTempPath, theme.dest),
    dest: theme.dest
  }

  return Object.assign({}, defaultConfig, customConfig)
}

/**
 * Get the configuration from a file.
 * @param file
 * @return {Promise<{}|*>}
 */
const getConfigFromFile = async (file) => {
  if (fs.existsSync(file)) {
    const { default: defaults } = await import(file)
    return defaults
  }
  return {}
}
