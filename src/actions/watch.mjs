import path from 'path'
import chokidar from 'chokidar'
import { getModules, getThemes } from '../main.mjs'
import { build } from './build.mjs'
import { instance } from './browser-sync.mjs'
import { inheritance } from './inheritance.mjs'
import { projectPath, tempPath } from '../config.mjs'

export const watch = async (themeName) => {
  const watcherConfig = { ignoreInitial: true }
  const theme = getThemes().find((theme) => theme.name === themeName)
  const modules = getModules().filter((module) => module.src && module.enabled)

  const themeTempSrc = path.join(tempPath, theme.dest)
  const themeSrc = [path.join(projectPath, theme.src)]

  // Add modules source directories to theme source paths array
  // Ignore the sources of modules that are in the vendor directory
  modules
    .filter((m) => !m.src.startsWith('vendor'))
    .forEach((m) => {
      themeSrc.push(path.join(projectPath, m.src))
    })

  // Initialize watchers
  const tempWatcher = chokidar.watch(themeTempSrc, watcherConfig)
  const srcWatcher = chokidar.watch(themeSrc, watcherConfig)

  // When files are created, updated or deleted, rebuild the symlinks
  const reinitialize = async () => await inheritance(themeName)

  // prettier-ignore
  srcWatcher
        .on('add', reinitialize)
        .on('addDir', reinitialize)
        .on('unlink', reinitialize)
        .on('unlinkDir', reinitialize)

  tempWatcher.on('ready', () => {
    console.log(`Watching ${themeTempSrc}`)
  })

  // Events handling
  tempWatcher.on('change', async (filePath) => {
    console.log(`File ${filePath} has been changed`)
    await build(themeName)

    // Files that require reload after save
    // TODO: Add more files to watch for reload

    if (['.html', '.phtml', '.xml', '.csv', '.js'].some((ext) => path.extname(filePath) === ext)) {
      if (instance) {
        instance.reload()
      }
    }
  })
}
