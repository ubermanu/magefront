import path from 'path'
import gulp from 'gulp'

/**
 * A gulp wrapper for gulp plugins.
 * Set a `src` and `dest` paths and the piped plugins will be run.
 *
 * @param {{src, dest, sourcemaps, pipe}} options
 * @return {function(*): *}
 */
export default (options) => (themeConfig) => {
  const { src, dest, pipe } = options

  if (src === undefined) {
    throw new Error('The `src` option is required.')
  }

  if (dest === undefined) {
    throw new Error('The `dest` option is required.')
  }

  let chain = gulp.src(path.join(themeConfig.src, src))

  if (Array.isArray(pipe)) {
    for (const gulpPlugin of pipe) {
      chain = chain.pipe(gulpPlugin)
    }
  }

  return chain.pipe(gulp.dest(path.join(themeConfig.dest, dest)))
}
