/**
 * The original options from the command line.
 * TODO: Implement mergeCss and mergeJs options.
 */
export interface Options {
  minifyJs?: boolean
  minifyCss?: boolean
}

/**
 * Return the default preset.
 * It is meant to be compatible with the default Magento themes.
 *
 * @param {Options} options
 * @return {import('magefront').PresetThemeConfig}
 */
export default (options: Options = {}) => {
  const { minifyJs, minifyCss } = options

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

  return { plugins }
}
