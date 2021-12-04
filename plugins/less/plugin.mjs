import gulp from 'gulp'
import less from 'gulp-less'

// Generate CSS from LESS source files.
// Allow custom options to be passed in via the `options` parameter.
export default (options) => (themeConfig) => {
  return gulp
    .src(`${themeConfig.src}/web/css/*.less`)
    .pipe(less(options))
    .pipe(gulp.dest(`${themeConfig.dest}/css`))
}
