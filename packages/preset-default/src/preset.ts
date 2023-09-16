import cssnano from 'cssnano'
import cssnanoPresetDefault from 'cssnano-preset-default'
import type { Preset } from 'magefront'
import jsTranslation from 'magefront-plugin-js-translation'
import less from 'magefront-plugin-less'
import postcss from 'magefront-plugin-postcss'
import requireJsConfig from 'magefront-plugin-requirejs-config'
import terser from 'magefront-plugin-terser'

/** The original options from the command line. */
export interface Options {
  minifyJs?: boolean
  minifyCss?: boolean
  mergeCss?: boolean
  mergeJs?: boolean
  bundleJs?: boolean
}

/** Return the default preset. It is meant to be compatible with the default Magento themes. */
export default (options?: Options): Preset => {
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
    plugins.push(
      postcss({
        src: '**/*.css',
        plugins: [cssnano({ preset: cssnanoPresetDefault })],
      })
    )
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
