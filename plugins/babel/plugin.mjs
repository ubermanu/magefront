import path from 'path'
import gulp from 'gulp'
// import babel from 'gulp-babel'

// TODO: The file is not properly copied when an error occurred
export default (options) => (themeConfig) => {
  options = options || { presets: ['@babel/env'] }
  const { src, dest } = options

  // Remove the `web` part from the path
  // web/**/*.js --> **/*.js
  // Magento_Catalog/web/**/*.js --> Magento_Catalog/**/*.js
  const relPath = src || 'web/**/*.js'
  const relBase = relPath.indexOf('**') !== -1 ? relPath.split('**').shift() : ''

  gulp
    .src(path.join(themeConfig.src, relPath), { base: path.join(themeConfig.src, relBase), nodir: true })
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || '')))

  themeConfig.modules.forEach((moduleName) => {
    const modulePath = path.join(themeConfig.src, moduleName)
    const moduleDest = path.join(themeConfig.dest, moduleName)

    gulp
      .src(path.join(modulePath, relPath), { base: path.join(modulePath, relBase), nodir: true })
      .pipe(gulp.dest(path.join(moduleDest, dest || '')))
  })
}
