import type { Plugin } from './plugin'

/**
 * The configuration object.
 */
export interface PresetThemeConfig {
  plugins?: Array<string | Plugin>
}
