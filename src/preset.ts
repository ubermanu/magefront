import type { Plugin } from './plugin'

/**
 * The preset configuration object.
 * Contains already defined plugins (because we cannot resolve them at the module level).
 */
export interface Preset {
  plugins?: Plugin[]
}
