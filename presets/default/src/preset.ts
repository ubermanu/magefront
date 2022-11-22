import less from 'magefront-plugin-less'
import requireJsConfig from 'magefront-plugin-requirejs-config'
import jsTranslation from 'magefront-plugin-js-translation'
// import terser from 'magefront-plugin-terser'
// import cssnano from 'magefront-plugin-cssnano'

/**
 * The original options from the command line.
 */
export interface Options {
  minifyJs?: boolean
  minifyCss?: boolean
  mergeCss?: boolean
  mergeJs?: boolean
  bundleJs?: boolean
}

/**
 * Return the default preset.
 * It is meant to be compatible with the default Magento themes.
 *
 * @param {Options} options
 * @return {import('magefront').Preset}
 */
export default (options: Options = {}) => {
  const { minifyJs, minifyCss, mergeCss, mergeJs, bundleJs } = options

  const plugins = [
    // prettier-ignore
    less(),
    requireJsConfig(),
    jsTranslation()
  ]

  if (minifyJs) {
    console.warn('The minifyJs option is not implemented yet.')
    // plugins.push(terser())
  }

  if (minifyCss) {
    console.warn('The minifyCss option is not implemented yet.')
    // plugins.push(cssnano())
  }

  if (mergeCss) {
    console.warn('The mergeCss option is not implemented yet.')
  }

  if (mergeJs) {
    console.warn('The mergeJs option is not implemented yet.')
  }

  if (bundleJs) {
    console.warn('The bundleJs option is not implemented yet.')
  }

  return { plugins }
}
