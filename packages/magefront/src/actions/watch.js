import chokidar from 'chokidar'
import k from 'kleur'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import prettyMilliseconds from 'pretty-ms'
import { instance } from './browser-sync.js'
import { build } from './build.js'
import { clean } from './clean.js'
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

  /**
   * Gather the files and deploy the theme files.
   *
   * @returns {Promise<void>}
   */
  const reindex = async () => {
    if (isBuilding) {
      return
    }
    logger.info(`[${k.gray(theme.name)}] Deploying theme...`)
    const now = performance.now()
    isBuilding = true
    await clean(context)
    await inheritance(context)
    await deploy(context)
    logger.info(
      `[${k.gray(theme.name)}] Done in ${prettyMilliseconds(
        performance.now() - now
      )}`
    )
    isBuilding = false
  }

  /**
   * Run the build plugins on the deployed files.
   *
   * @returns {Promise<void>}
   */
  const rebuild = async () => {
    if (isBuilding) {
      return
    }
    isBuilding = true
    logger.info(`[${k.gray(theme.name)}] Rebuilding theme...`)
    const now = performance.now()
    // TODO: clean pub and deploy before rebuilding to avoid dangling files
    await build(context)
    logger.info(
      `[${k.gray(theme.name)}] Done in ${prettyMilliseconds(
        performance.now() - now
      )}`
    )
    isBuilding = false
  }

  /**
   * Returns TRUE if the file path comes from a web directory.
   *
   * @param {string} filePath
   * @returns {boolean}
   */
  function isWebFile(filePath) {
    return (
      filePath.includes(`/view/${theme.area}/web/`) ||
      filePath.includes('/view/base/web/')
    )
  }

  /**
   * Queue a rebuild of the theme for a specific file.
   *
   * TODO: Only rebuild the plugins that are affected by the change
   *
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  async function rebuildFile(filePath) {
    await rebuild()
    if (
      isWebFile(filePath) &&
      styleExtensions.includes(path.extname(filePath))
    ) {
      instance?.reload('*.css')
    } else if (staticExtensions.includes(path.extname(filePath))) {
      instance?.reload()
    }
  }

  srcWatcher
    .on('add', async (filePath) => {
      logger.info(`[${k.gray(theme.name)}] File added: ${k.cyan(filePath)}`)
      await reindex()
      await rebuildFile(filePath)
    })
    .on('unlink', async (filePath) => {
      logger.info(`[${k.gray(theme.name)}] File removed: ${k.cyan(filePath)}`)
      await reindex()
      await rebuildFile(filePath)
    })
    .on('change', async (filePath) => {
      logger.info(`[${k.gray(theme.name)}] File changed: ${k.cyan(filePath)}`)
      await rebuildFile(filePath)
    })

  srcWatcher.on('ready', () => {
    logger.info(`[${k.gray(theme.name)}] Watching source files...`)
  })
}

const styleExtensions = ['.less', '.scss', '.styl', '.css', '.postcss', '.pcss']
const staticExtensions = ['.html', '.phtml', '.xml', '.csv', '.js']
