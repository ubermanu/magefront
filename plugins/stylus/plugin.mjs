import gulp from 'magefront-plugin-gulp'
import stylus from 'gulp-stylus'
import gulpSourcemaps from 'gulp-sourcemaps'

/**
 * Transform Stylus files to CSS using Gulp.
 *
 * @param {{src?: string, dest?: string, sourcemaps?: boolean, any}} options
 * @return {(function(*): *)|*}
 */
export default (options = {}) => {
  const { src, dest, sourcemaps } = options

  const pipe = [stylus(options)]

  // Add source maps if enabled
  if (sourcemaps) {
    pipe.unshift(gulpSourcemaps.init())
    pipe.push(gulpSourcemaps.write())
  }

  return gulp({
    src: src ?? 'web/css/!(_)*.styl',
    dest: dest ?? 'css',
    pipe
  })
}
