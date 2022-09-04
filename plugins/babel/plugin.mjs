import path from 'path'
import gulp from 'gulp'

export default (options) => (themeConfig) => {
  options = options || { presets: ['@babel/env'] }
  const { src, dest } = options

  // Get the paths to the public JS files
  const paths = getMagentoWebPaths(themeConfig, src || '**/*.js')

  gulp
    .src(paths, { base: themeConfig.src, nodir: true })
    .pipe(babel(options))
    .on('error', (err) => {
      // Limit the error message length
      console.error(err.message.slice(0, 2000))
      this.emit('end')
    })
    .pipe(fixMagentoDestWebPaths())
    .pipe(gulp.dest(path.join(themeConfig.dest, dest || '')))
}
