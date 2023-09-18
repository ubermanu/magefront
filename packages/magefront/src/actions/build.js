import path from 'node:path'
import { getThemeDependencyTree } from '../magento/theme'

/**
 * Build the theme. If a configuration file is found, it will be used.
 *
 * @type {import('types').Action}
 */
export const build = async (context) => {
  const { buildConfig, magento, locale, logger } = context

  // Filter the modules that are enabled and have a source directory.
  const modules = magento.modules.filter((m) => m.enabled && m.src)

  // Append the locale to the destination directory.
  const dest = path.join(buildConfig.dest, locale)

  /** @type {import('types').PluginContext} */
  const pluginContext = {
    theme: context.theme.name,
    locale,
    logger,
    src: buildConfig.tmp,
    dest,
    modules: modules.map((m) => m.name),
    moduleList: magento.modules,
    languageList: magento.languages,
    themeList: magento.themes,
    themeDependencyTree: getThemeDependencyTree(context.theme).map((t) => t.name),
    cwd: magento.rootPath,
  }

  for (const plugin of buildConfig.plugins) {
    try {
      await plugin.build(pluginContext)
    } catch (e) {
      // TODO: Should be critical error
      logger.error(e)
    }
  }
}
