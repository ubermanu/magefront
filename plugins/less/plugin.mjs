import gulp from 'magefront-plugin-gulp'
import gulpSourcemaps from 'gulp-sourcemaps'
import gulpLess from './pluginGulp.mjs'
import magentoImport from './lib/magento-import-preprocessor.mjs'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 * Allow custom options to be passed in via the `options` parameter.
 * https://github.com/gulp-community/gulp-less#options
 *
 * @param {{src?: string, dest?: string, sourcemaps?: boolean, compiler?: any, plugins?: [], any:*}} options
 * @return {(function(*): void)|*}
 */
export default (options = {}) => {
  const { src, dest, sourcemaps } = options

  return (themeConfig) => {
    // Add the default magento import plugin
    // TODO: Use a configurable option to enable/disable this
    options.plugins ??= []
    options.plugins.unshift(magentoImport(themeConfig.modules))

    const pipe = [gulpLess(options)]

    // Add sourcemaps if enabled
    if (sourcemaps) {
      pipe.unshift(gulpSourcemaps.init())
      pipe.push(gulpSourcemaps.write())
    }

    const fn = gulp({
      src: src ?? 'web/css/!(_)*.less',
      dest: dest ?? 'css',
      pipe
    })

    // Call the gulp plugin function
    return fn(themeConfig)
  }
}
