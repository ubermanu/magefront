import chokidar from 'chokidar'
import k from 'kleur'
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

  /** @type {import('types').MagentoModule[]} */
  const modules = magento.modules.filter((m) => m.src && m.enabled)
  const sources = [theme.src]

  // Add modules source directories to theme source paths array
  // Ignore the sources of modules that are in the vendor directory
  modules
    .filter((m) => !m.src.startsWith('vendor'))
    .forEach((m) => {
      sources.push(m.src)
    })

  // Initialize watcher
  const srcWatcher = chokidar.watch(sources, {
    ignoreInitial: true,
    cwd: rootPath,
    awaitWriteFinish: {
      stabilityThreshold: 100,
    },
    ignored: [
      '**/.git/**',
      '**/.idea/**',
      '**/.vscode/**',
      '**/node_modules/**',
      '**/vendor/**',
    ],
  })

  let isBuilding = false

  // When files are created, updated or deleted, rebuild the theme
  const rebuild = async () => {
    if (isBuilding) {
      return
    }
    isBuilding = true
    logger.info(`[${k.gray(theme.name)}] Rebuilding theme...`)
    const now = performance.now()
    await inheritance(context)
    await build(context)
    await deploy(context)
    logger.info(
      `[${k.gray(theme.name)}] Done in ${prettyMilliseconds(
        performance.now() - now
      )}`
    )
    isBuilding = false
  }

  // TODO: Only build the plugins that are affected by the change
  srcWatcher
    .on('add', rebuild)
    .on('addDir', rebuild)
    .on('unlink', rebuild)
    .on('unlinkDir', rebuild)
    .on('change', async (filePath) => {
      logger.info(`[${k.gray(theme.name)}] File changed: ${k.cyan(filePath)}`)
      await rebuild()
      if (styleExtensions.includes(path.extname(filePath))) {
        instance?.reload('*.css')
      } else if (staticExtensions.includes(path.extname(filePath))) {
        instance?.reload()
      }
    })

  srcWatcher.on('ready', () => {
    logger.info(`[${k.gray(theme.name)}] Watching source files...`)
  })
}

const styleExtensions = ['.less', '.scss', '.styl', '.css', '.postcss', '.pcss']

const staticExtensions = ['.html', '.phtml', '.xml', '.csv', '.js']
