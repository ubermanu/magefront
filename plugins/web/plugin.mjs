import gulp from 'gulp'
import path from 'path'
import through from 'through2'
import globToRegExp from 'glob-to-regexp'

/**
 * Copy the content of the web dir into the correct destination.
 * Uses glob format for ignores.
 */
export default (options = {}) => {
  const { src, dest } = options
  options.ignore ??= ['**/node_modules/**', '**/*.{less,scss,sass,styl,ts,tsx}']

  return (themeConfig) => {
    const paths = getMagentoWebPaths(themeConfig, src || '**/*')

    gulp
      .src(paths, { base: themeConfig.src, nodir: true })
      .pipe(fixMagentoDestWebPaths({ ignore: options.ignore }))
      .pipe(gulp.dest(path.join(themeConfig.dest, dest || '')))
  }
}

/**
 * Return an array of web paths in the Magento project.
 * Usable in other plugins, e.g. for transpiling JS files.
 *
 * @param {{src: string, modules: string[]}} themeConfig
 * @param {string} src
 * @return {string[]}
 */
export const getMagentoWebPaths = (themeConfig, src = '') => {
  const paths = [path.join(themeConfig.src, 'web', src)]
  themeConfig.modules.forEach((moduleName) => {
    paths.push(path.join(themeConfig.src, moduleName, 'web', src))
  })
  return paths
}

/**
 * Gulp processor to rename properly the files from the web directories.
 * Usable in other plugins, e.g. for transpiling JS files.
 *
 * @return {*}
 */
export const fixMagentoDestWebPaths = (options = {}) => {
  // Transform the glob patterns to regex
  // So we can test them against relative file paths
  const ignore = (options.ignore ?? []).map((pattern) => globToRegExp(pattern, { extended: true }))

  return through.obj((file, enc, cb) => {
    if (file.isNull()) {
      cb()
      return
    }

    if (file.isStream()) {
      this.emit('error', new Error('Streaming not supported'))
      cb()
      return
    }

    // Ignore some files
    if (ignore && ignore.some((regex) => regex.test(file.relative))) {
      cb()
      return
    }

    // Remove the `web` part from the path
    // web/**/*.js --> **/*.js
    // Magento_Catalog/web/**/*.js --> Magento_Catalog/**/*.js
    const relPath = file.relative.replace(/^(\w+_\w+\/)?(web\/)/, '$1')
    file.path = path.join(file.base, relPath)

    cb(null, file)
  })
}
