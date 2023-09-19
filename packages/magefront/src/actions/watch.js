import chokidar from 'chokidar'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import prettyMilliseconds from 'pretty-ms'
import { instance } from './browser-sync.js'
import { build } from './build.js'
import { deploy } from './deploy.js'
import { inheritance } from './inheritance.js'

/**
 * Watch the source files of a theme, and rebuild on change.
 *
 * @type {import('types').Action}
 */
export const watch = async (context) => {
  const { logger, magento, theme } = context
  const { rootPath } = magento

  const watcherConfig = { ignoreInitial: true }
  const modules = magento.modules.filter((m) => m.src && m.enabled)

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

  let isBuilding = false

  // When files are created, updated or deleted, rebuild the theme
  const rebuild = async () => {
    if (isBuilding) {
      return
    }
    isBuilding = true
    logger.info('Rebuilding theme...')
    const now = performance.now()
    await inheritance(context)
    await build(context)
    await deploy(context)
    logger.info(`Done in ${prettyMilliseconds(performance.now() - now)}`)
    isBuilding = false
  }

  // TODO: Only build the plugins that are affected by the change
  srcWatcher
    .on('add', rebuild)
    .on('addDir', rebuild)
    .on('unlink', rebuild)
    .on('unlinkDir', rebuild)
    .on('change', async (filePath) => {
      await rebuild()
      if (styleExtensions.includes(path.extname(filePath))) {
        if (instance) {
          instance.reload('*.css')
        }
      }
      if (staticExtensions.some((ext) => path.extname(filePath) === ext)) {
        if (instance) {
          instance.reload()
        }
      }
    })

  srcWatcher.on('ready', () => {
    logger.info(`Watching source files...`)
  })
}

const styleExtensions = ['.less', '.scss', '.styl', '.css', '.postcss', '.pcss']

const staticExtensions = ['.html', '.phtml', '.xml', '.csv', '.js']
