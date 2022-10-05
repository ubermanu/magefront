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
 * @return {import('magefront').PresetThemeConfig}
 */
export default (options: Options = {}) => {
  const { minifyJs, minifyCss, mergeCss, mergeJs, bundleJs } = options

  const plugins = [
    // prettier-ignore
    'magefront-plugin-less',
    'magefront-plugin-requirejs-config',
    'magefront-plugin-js-translation'
  ]

  if (minifyJs) {
    plugins.push('magefront-plugin-terser')
  }

  if (minifyCss) {
    plugins.push('magefront-plugin-cssnano')
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
