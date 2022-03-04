import gulp from 'gulp'
import path from 'path'
import filter from 'gulp-filter'
import replace from './gulpReplaceRelative.mjs'

/**
 * Copy the content of the web dir into the correct destination.
 * Uses glob format for ignores.
 */
export default (options = {}) => {
  options.ignore ??= ['**/node_modules/**', '**/*.{less,scss,sass,styl,ts,tsx}']
  return gulpWeb(options)
}

/**
 * A different approach for the gulp plugin, that supports
 * the public content in the web dirs.
 *
 * 1. Fetch the paths from all the modules + current theme
 * 2. Filter ignored files
 * 3. Execute piped actions
 * 4. Fix paths to the pub/static/ dir
 *
 * @param {{src?: string, dest?: string, pipe?: [], ignore?: []}} options
 * @return {function}
 */
export const gulpWeb = (options = {}) => {
  const { src, dest } = options
  options.pipe ??= []
  options.ignore ??= []

  return (themeConfig) => {
    const paths = getMagentoWebPaths(themeConfig, src || '**/*')
    const filters = ['**', ...options.ignore.map((ignore) => '!' + ignore)]

    let chain = gulp.src(paths, { base: themeConfig.src, nodir: true })

    // Remove ignored files
    chain = chain.pipe(filter(filters))

    for (const gulpPlugin of options.pipe) {
      chain = chain.pipe(gulpPlugin)
    }

    // Fix the paths
    chain = chain.pipe(fixMagentoDestWebPaths())
    return chain.pipe(gulp.dest(path.join(themeConfig.dest, dest || '')))
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
export const fixMagentoDestWebPaths = () => {
  // Remove the `web` part from the paths
  // web/**/*.* --> **/*.*
  // Magento_Catalog/web/**/*.* --> Magento_Catalog/**/*.*
  return replace(/^(\w+_\w+\/)?(web\/)/, '$1')
}
