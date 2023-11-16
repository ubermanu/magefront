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

  /**
   * When files are created, updated or deleted, rebuild the theme.
   *
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  const rebuild = async (filePath) => {
    if (isBuilding) {
      return
    }

    // TODO: Only rerun the plugins that are affected by the change
    //  Maybe add a watcher config that defines what files should trigger a rebuild
    // This is actually wrong because the translations are generated using *.phtml files as well
    if (
      !isWebFile(filePath) &&
      !isRequireJsConfigFile(filePath) &&
      !isTranslationFile(filePath)
    ) {
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

  const APP_CODE_WEB_REGEX =
    theme.area === 'adminhtml'
      ? /^app\/code\/\w+\/\w+\/view\/(base|adminhtml)\/web\//
      : /^app\/code\/\w+\/\w+\/view\/(base|frontend)\/web\//

  const APP_DESIGN_WEB_REGEX = /^app\/design\/\w+\/\w+\/\w+\/(\w+\/?)web\//

  /**
   * Check if the file is in the `web` directory, and therefore should trigger a
   * reload of the browser.
   *
   * TODO: Add unit tests for this function
   *
   * @param {string} filePath
   * @returns {boolean}
   */
  function isWebFile(filePath) {
    return [APP_CODE_WEB_REGEX, APP_DESIGN_WEB_REGEX].some((regex) =>
      regex.test(filePath)
    )
  }

  /**
   * @param {string} filePath
   * @returns {boolean}
   */
  function isRequireJsConfigFile(filePath) {
    return path.basename(filePath) === 'requirejs-config.js'
  }

  const APP_I18N_REGEX = /^app\/i18n\/\w+\/\w+\/(\w+\/?)web\//
  const APP_CODE_I18N_REGEX = /^app\/code\/\w+\/\w+\/i18n\//
  const APP_DESIGN_I18N_REGEX = /^app\/design\/\w+\/\w+\/\w+\/i18n\//

  /**
   * @param {string} filePath
   * @returns {boolean}
   */
  function isTranslationFile(filePath) {
    return [APP_I18N_REGEX, APP_CODE_I18N_REGEX, APP_DESIGN_I18N_REGEX].some(
      (regex) => regex.test(filePath)
    )
  }

  // TODO: Only build the plugins that are affected by the change
  srcWatcher
    .on('add', rebuild)
    .on('addDir', rebuild)
    .on('unlink', rebuild)
    .on('unlinkDir', rebuild)
    .on('change', async (filePath) => {
      logger.info(`[${k.gray(theme.name)}] File changed: ${k.cyan(filePath)}`)
      if (rebuildExtensions.includes(path.extname(filePath))) {
        await rebuild(filePath)
      }
      if (styleExtensions.includes(path.extname(filePath))) {
        instance?.reload('*.css')
      } else if (reloadExtensions.includes(path.extname(filePath))) {
        instance?.reload()
      }
    })

  srcWatcher.on('ready', () => {
    logger.info(`[${k.gray(theme.name)}] Watching source files...`)
  })
}

const styleExtensions = ['.less', '.scss', '.styl', '.css', '.postcss', '.pcss']
const reloadExtensions = ['.phtml', '.xml', '.csv', '.html', '.js']
const rebuildExtensions = ['.html', '.js', ...styleExtensions]
