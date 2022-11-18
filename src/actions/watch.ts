// @ts-nocheck
import path from 'path'
import chokidar from 'chokidar'

import { inheritance } from './inheritance'
import { build } from './build'
import { deploy } from './deploy'
import { getModules } from '../magento/module'
import { getThemes } from '../magento/theme'
import { logger, rootPath } from '../env'

export const watch = async (themeName: string) => {
  const watcherConfig = { ignoreInitial: true }
  const theme = getThemes().find((theme) => theme.name === themeName)
  const modules = getModules().filter((module) => module.src && module.enabled)

  const themeSrc = [path.join(rootPath, theme.src)]

  // Add modules source directories to theme source paths array
  // Ignore the sources of modules that are in the vendor directory
  modules
    .filter((m) => !m.src.startsWith('vendor'))
    .forEach((m) => {
      themeSrc.push(path.join(rootPath, m.src))
    })

  // Initialize watcher
  const srcWatcher = chokidar.watch(themeSrc, watcherConfig)

  // When files are created, updated or deleted, rebuild the theme
  const rebuild = async () => {
    logger.info('Rebuilding theme...')
    await inheritance(themeName)
    await build(themeName)
    await deploy(themeName)
    logger.info('Done.')
  }

  // TODO: Only build the plugins that are affected by the change
  srcWatcher
    .on('add', rebuild)
    .on('addDir', rebuild)
    .on('unlink', rebuild)
    .on('unlinkDir', rebuild)
    .on('change', async (filePath) => {
      await rebuild()
      if (['.html', '.phtml', '.xml', '.csv', '.js'].some((ext) => path.extname(filePath) === ext)) {
        if (instance) {
          instance.reload()
        }
      }
    })

  srcWatcher.on('ready', () => {
    logger.info(`Watching source files...`)
  })
}
