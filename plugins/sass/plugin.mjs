import gulp from 'magefront-plugin-gulp'
import gulpSass from 'gulp-sass'
import gulpSourcemaps from 'gulp-sourcemaps'
import dartSass from 'sass'

/**
 * Compile SCSS files to CSS using Gulp and dart-sass.
 * You can use the `compiler` option to specify the sass compiler to use. (e.g. node-sass)
 *
 * @param {{src?: string, dest?: string, sourcemaps?: boolean, compiler?: any, any}} options
 * @return {(function(*): *)|*}
 */
export default (options = {}) => {
  const { src, dest, sourcemaps, compiler } = options

  // Instantiate the plugin with the dart port of sass by default
  const sass = gulpSass(compiler ?? dartSass)

  const pipe = [sass.sync(options).on('error', sass.logError)]

  // Add source maps if enabled
  if (sourcemaps) {
    pipe.unshift(gulpSourcemaps.init())
    pipe.push(gulpSourcemaps.write())
  }

  return gulp({
    src: src ?? 'web/css/!(_)*.scss',
    dest: dest ?? 'css',
    pipe
  })
}
