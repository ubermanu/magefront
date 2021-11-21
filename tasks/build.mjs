import gulp from 'gulp'
import { getThemeConfig } from '../helpers/theme.mjs'
import minimist from 'minimist'

const options = minimist(process.argv)

// TODO: get config from the theme
// TODO: Add support for multiple themes at once?
export const build = async () => {
    const themeConfig = await getThemeConfig(options.theme)
    const tasks = [];

    for (const plugin of themeConfig.plugins) {
        tasks.push(() => plugin(themeConfig))
    }

    return gulp.series(...tasks)
}
