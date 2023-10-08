import jsTranslation from 'magefront-plugin-js-translation'
import less from 'magefront-plugin-less'
import lightningcss from 'magefront-plugin-lightningcss'
import requireJsConfig from 'magefront-plugin-requirejs-config'
import terser from 'magefront-plugin-terser'

/**
 * Return the default preset. It is meant to be compatible with the default
 * Magento themes.
 *
 * @param {import('./preset').Options} [options]
 * @returns {import('magefront').Preset}
 */
export default (options) => {
  const { minifyJs, minifyCss, mergeCss, mergeJs, bundleJs } = { ...options }

  const plugins = [
    // prettier-ignore
    less(),
    requireJsConfig(),
    jsTranslation(),
  ]

  if (minifyJs) {
    // The following files are ignore by default because they cause an issue with requireJs
    plugins.push(
      terser({
        ignore: ['**/*.min.js', 'mage/utils/main.js', 'Magento_Ui/**/*.js'],
      })
    )
  }

  if (minifyCss) {
    plugins.push(lightningcss({ minify: true }))
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
