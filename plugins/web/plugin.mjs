import gulp from 'gulp'
import path from 'path'
import through from 'through2'

/**
 * Copy the content of the web dir into the correct destination.
 * TODO: Use glob format for ignores, and convert them to regex.
 */
export default (options) => (themeConfig) => {
  options = options || {
    ignore: [/^(\w+_\w+\/)?web\/css\/source\/.*/i]
  }

  const { src, dest, ignore } = options
  const paths = getMagentoWebPaths(themeConfig, src || '**/*')

  gulp
    .src(paths, { base: themeConfig.src, nodir: true })
    .pipe(fixMagentoDestWebPaths({ ignore }))
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || '')))
}

/**
 * Return an array of web paths in the Magento project.
 * Usable in other plugins, e.g. for transpiling JS files.
 *
 * @param themeConfig
 * @param src
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
  const { ignore } = options
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
