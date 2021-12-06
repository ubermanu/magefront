import path from 'path'
import gulp from 'gulp'
import less from 'gulp-less'
import magentoImport from './lib/magento-import-preprocessor.mjs'
import less23Compat from './lib/less-23-compat-preprocessor.mjs'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 * TODO: Add some feedback to the user.
 *
 * @param options
 * @return {(function(*): void)|*}
 */
export default (options) => (themeConfig) => {
  // Allow custom options to be passed in via the `options` parameter.
  // Get the modules list from the themeConfig
  // https://github.com/gulp-community/gulp-less#options
  options = options || {
    plugins: [magentoImport(themeConfig.modules), less23Compat()]
  }

  const { src, dest } = options

  return gulp
    .src(path.join(themeConfig.src, src || 'web/css/!(_)*.less'))
    .pipe(less(options))
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || 'css')))
}
