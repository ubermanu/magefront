import { Preset } from 'magefront'

/** The original options from the command line. */
interface Options {
  minifyJs?: boolean
  minifyCss?: boolean
  mergeCss?: boolean
  mergeJs?: boolean
  bundleJs?: boolean
}
/**
 * Return the default preset. It is meant to be compatible with the default
 * Magento themes.
 */
declare const _default: (options?: Options) => Preset

export { _default as default, type Options }
