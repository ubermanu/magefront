import k from 'kleur'
import path from 'node:path'
import { getThemeDependencyTree } from '../magento/theme.js'

/**
 * Process the files in both the temporary and destination directories. This is
 * the final step in the build process.
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
    dest: path.join(buildConfig.dest, locale),
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
