import fs from 'fs'
import path from 'path'
import { getThemes } from './main.mjs'

// Default configuration plugins
import lessPlugin from 'magefront-plugin-less'
import webCopyPlugin from 'magefront-plugin-web'
import requirejsPlugin from 'magefront-plugin-requirejs'

// This tool is meant to be run at root level of the project
export const projectPath = process.cwd()
export const tempPath = path.join(projectPath, 'var/view_preprocessed/magefront')

/**
 * Get the configuration for the given theme name.
 * The theme config is passed to the plugins.
 *
 * @param themeName
 * @return {Promise<{locales, plugins, src, dest}>}
 */
export const getConfigForTheme = async (themeName) => {
  const theme = getThemes().find((t) => t.name === themeName)

  // TODO: Add as an option '-c' to specify the config file
  let customConfig = await getConfigFromFile(path.join(projectPath, 'magefront.config.js'))

  // Add support for array into the config file
  // Look for the theme name in the array of objects
  if (Array.isArray(customConfig)) {
    customConfig = customConfig.filter((entry) => entry.theme === themeName).shift() || {}
  }

  const defaultConfig = {
    theme: themeName,
    locales: ['en_US'],
    plugins: [lessPlugin()],
    copyWebDir: true,
    concatRequireJs: true,
    src: path.join(tempPath, theme.dest),
    dest: theme.dest
  }

  const finalConfig = Object.assign({}, defaultConfig, customConfig)

  if (finalConfig.copyWebDir) {
    finalConfig.plugins.push(webCopyPlugin())
  }

  if (finalConfig.concatRequireJs) {
    finalConfig.plugins.push(requirejsPlugin())
  }

  return finalConfig
}

/**
 * Get the configuration from a file.
 *
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
