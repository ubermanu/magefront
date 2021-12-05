import path from 'path'
import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'

export default (options) => (themeConfig) => {
  options = options || {}
  const { src, dest, compiler } = options

  // Instantiate the plugin with the dart port of sass by default
  const sass = gulpSass(compiler || dartSass)

  return gulp
    .src(path.join(themeConfig.src, src || 'web/css/!(_)*.scss'))
    .pipe(sass.sync(options).on('error', sass.logError))
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || 'css')))
}
