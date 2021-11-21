import gulp from 'gulp'
import less from 'gulp-less'

// Generate CSS from LESS source files.
// Allow custom options to be passed in via the `options` parameter.
// TODO: Add custom paths to get LESS files from parent theme (to be tested)
// TODO: Add custom path to get LESS files from node_modules
export default (options) => (themeConfig) => {
    return gulp
        .src(`${themeConfig.src}/web/css/*.less`)
        .pipe(less(options))
        .pipe(gulp.dest(`${themeConfig.dest}/css`))
}
