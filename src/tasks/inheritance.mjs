import fs from 'fs-extra'
import glob from 'fast-glob'
import path from 'path'
// TODO: Implement the inheritance of the themes
import { getThemes } from '../theme.mjs'

const themes = getThemes()

const projectPath = process.cwd()
const tempPath = projectPath + '/var/view_preprocessed/magefront/'

function createSymlink(srcPath, destPath) {
  fs.removeSync(destPath)
  fs.ensureSymlinkSync(srcPath, destPath)
}

function generateSymlinks(src, dest, replacePattern, ignore = []) {
  glob
    .sync([src + '/**'].concat(ignore.map((pattern) => '!**/' + pattern)), {
      nodir: true
    })
    .forEach((srcPath) => {
      createSymlink(
        srcPath,
        path.join(dest, srcPath).replace(src + '/', replacePattern + '/')
      )
    })
}

function themeDependencyTree(themeName, tree, dependencyTree) {
  dependencyTree = dependencyTree ? dependencyTree : []
  dependencyTree.push(themeName)

  if (!tree) {
    return dependencyTree
  }

  if (themes[themeName].parent) {
    return themeDependencyTree(themes[themeName].parent, tree, dependencyTree)
  } else {
    return dependencyTree.reverse()
  }
}

// TODO: Add the Magento/base theme as a dependency for everyone
export const inheritance = async (name) => {
  // const themeConfig = await getThemeConfig(theme)

  return new Promise((resolve) => {
    themeDependencyTree(name, true).forEach((themeName) => {
      const theme = themes[themeName]
      const themeSrc = path.join(projectPath, theme.src)
      const themeDest = path.join(tempPath, theme.dest)

      // Clean destination dir before generating new symlinks
      fs.removeSync(themeDest)

      // Create symlinks for parent theme
      if (theme.parent) {
        const parentSrc = path.join(tempPath, themes[theme.parent].dest)
        generateSymlinks(parentSrc, themeDest, '', themes[theme.parent].ignore)
      }

      // TODO: For each modules, create symlinks for the theme
      // TODO: Get the modules from the config.php file

      // Create symlinks to all files in this theme. Will overwrite parent symlinks if exist.
      generateSymlinks(themeSrc, themeDest, '', theme.ignore)
    })

    resolve()
  })

  // for (const plugin of themeConfig.plugins) {
  //   tasks.push(() => plugin(themeConfig))
  // }

  // return gulp.series(...tasks)()
}
