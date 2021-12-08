import gulp from 'gulp'
import path from 'path'
import through from 'through2'

/**
 * Copy the content of the web dir into the correct destination.
 */
export default (options) => (themeConfig) => {
  options = options || {}
  const { src, dest } = options
  const paths = getMagentoWebPaths(themeConfig, src || '**/*')

  gulp
    .src(paths, { base: themeConfig.src, nodir: true })
    .pipe(fixMagentoDestWebPaths())
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
export const fixMagentoDestWebPaths = () => {
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

    // Remove the `web` part from the path
    // web/**/*.js --> **/*.js
    // Magento_Catalog/web/**/*.js --> Magento_Catalog/**/*.js
    file.path = file.path.replace(/web\//, '')

    cb(null, file)
  })
}
