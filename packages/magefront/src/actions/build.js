import k from 'kleur'
import { getThemeDependencyTree } from '../magento/theme.js'

/**
 * Build the theme. If a configuration file is found, it will be used.
 *
 * @type {import('types').Action}
 */
export const build = async (context) => {
  const { buildConfig, magento, locale, logger } = context

  // Filter the modules that are enabled and have a source directory.
  const modules = magento.modules.filter((m) => m.enabled && m.src)

  /** @type {import('types').PluginContext} */
  const pluginContext = {
    theme: context.theme,
    themeDependencyTree: getThemeDependencyTree(context.theme),
    cwd: buildConfig.tmp,
    locale,
    magento: {
      modules,
      languages: magento.languages,
      themes: magento.themes,
      rootPath: magento.rootPath,
    },
    logger,
  }

  for (const plugin of buildConfig.plugins) {
    try {
      await plugin.build(pluginContext)
    } catch (e) {
      logger.error(k.red(`${e}`))
    }
  }
}
