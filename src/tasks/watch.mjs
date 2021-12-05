import path from 'path'
import chokidar from 'chokidar'
import { getModules, getThemes } from '../magento.mjs'
import { build } from './build.mjs'
import { instance } from './browser-sync.mjs'
import { inheritance } from './inheritance.mjs'

const projectPath = process.cwd()
const tempPath = path.join(projectPath, 'var/view_preprocessed/magefront')

// TODO: Implement watch task
export const watch = async (themeName) => {
  const watcherConfig = { ignoreInitial: true }
  const theme = getThemes()[themeName]
  const modules = Object.values(getModules()).filter((m) => m.src && m.enabled)

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

  async function reinitialize() {
    await inheritance(themeName)
  }

  // Watch add / move / rename / delete events on source files
  srcWatcher
    .on('add', reinitialize)
    .on('addDir', reinitialize)
    .on('unlink', reinitialize)
    .on('unlinkDir', reinitialize)

  // print msg when temp dir watcher is initialized
  tempWatcher.on('ready', () => {
    console.log(`Watching ${themeTempSrc}`)
  })

  // Events handling
  tempWatcher.on('change', async (filePath) => {
    console.log(`File ${filePath} has been changed`)
    await build(themeName)

    // Files that require reload after save
    // TODO: Add more files to watch for reload
    if (
      ['.html', '.phtml', '.xml', '.csv', '.js'].some(
        (ext) => path.extname(filePath) === ext
      )
    ) {
      if (instance) {
        instance.reload()
      }
    }
  })
}
