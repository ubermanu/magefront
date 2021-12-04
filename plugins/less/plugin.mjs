import gulp from 'gulp'
import less from 'gulp-less'
import magentoImport from './lib/magento-import-preprocessor.mjs'
import less23Compat from './lib/less-23-compat-preprocessor.mjs'

export default (options) => (themeConfig) => {
  // Allow custom options to be passed in via the `options` parameter.
  // Get the modules list from the themeConfig
  // https://github.com/gulp-community/gulp-less#options
  options = options || {
    plugins: [magentoImport(themeConfig.modules), less23Compat()]
  }

  return gulp
    .src(`${themeConfig.src}/web/css/*.less`)
    .pipe(less(options))
    .pipe(gulp.dest(`${themeConfig.dest}/css`))
}
