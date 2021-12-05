import path from 'path'
import gulp from 'gulp'
import babel from 'gulp-babel'

export default (options) => (themeConfig) => {
  options = options || { presets: ['@babel/env'] }
  const { src, dest } = options

  return gulp
    .src(path.join(themeConfig.src, src || '**/*/*.js'), {
      base: themeConfig.src
    })
    .pipe(babel(options))
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || '')))
}
