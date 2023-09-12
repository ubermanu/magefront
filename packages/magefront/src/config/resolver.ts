import defaultPreset from 'magefront-preset-default'
import type { Plugin, Preset } from '../../types/magefront'

/** Return a map of all the built-in plugins (from the default preset). */
function getBuiltInPluginModules(): Map<string, Plugin> {
  const plugins = defaultPreset().plugins || []
  const map = new Map<string, Plugin>()
  plugins.forEach((plugin) => map.set('magefront-plugin-' + plugin.name, plugin))
  return map
}

/** Import the plugin and return the default export. If the plugin is not found, fallback to the built-in plugins from the default preset. */
async function importPluginWithFallback(identifier: string, options?: any): Promise<Plugin> {
  try {
    const { default: pluginModule } = await import(identifier)
    return pluginModule(options)
  } catch (e) {
    const builtin = getBuiltInPluginModules()
    if (builtin.has(identifier)) {
      return builtin.get(identifier)!
    } else {
      throw e
    }
  }
}

/** Transform the plugin to a function if it is not already. If passed a string, import the plugin and return the default export. */
export async function transformPluginDefinition(definition: any): Promise<Plugin> {
  if (typeof definition === 'object' && typeof definition.build === 'function') {
    return definition
  }

  if (typeof definition === 'string') {
    return await importPluginWithFallback(definition)
  }

  if (Array.isArray(definition)) {
    const [pluginName, options] = definition
    return await importPluginWithFallback(pluginName, options)
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}

/** Transform the preset to a function if it is not already. If passed a string, import the preset and return the default export. */
export async function transformPresetDefinition(definition: any): Promise<Preset> {
  if (typeof definition === 'string') {
    const { default: presetModule } = await import(definition)
    return presetModule()
  }

  if (Array.isArray(definition)) {
    const [presetName, options] = definition
    const { default: presetModule } = await import(presetName)
    return presetModule(options)
  }

  if (typeof definition === 'object') {
    return definition
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}
