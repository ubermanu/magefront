import path from 'path'
import gulp from 'gulp'
import stylus from 'gulp-stylus'

export default (options) => (themeConfig) => {
  options = options || {}
  const { src, dest } = options

  return gulp
    .src(path.join(themeConfig.src, src || 'web/css/!(_)*.styl'))
    .pipe(stylus(options))
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || 'css')))
}
