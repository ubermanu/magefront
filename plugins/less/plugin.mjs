import gulp from 'gulp'
import less from 'gulp-less'
import magentoImport from './lib/magento-import-preprocessor.mjs'

// TODO: Allow custom options to be passed in via the `options` parameter.
// TODO: Get the modules list from the themeConfig
export default (options) => (themeConfig) => {
  return gulp
    .src(`${themeConfig.src}/web/css/test.less`)
    .pipe(less({ plugins: [magentoImport(themeConfig.modules)] }))
    .pipe(gulp.dest(`${themeConfig.dest}/css`))
}
