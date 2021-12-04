import fs from 'fs-extra'
import glob from 'fast-glob'
import path from 'path'
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

function getThemeDependencyTree(themeName, dependencyTree) {
  dependencyTree = dependencyTree ? dependencyTree : []
  dependencyTree.push(themeName)

  if (themes[themeName].parent) {
    return getThemeDependencyTree(themes[themeName].parent, dependencyTree)
  } else {
    return dependencyTree.reverse()
  }
}

// TODO: Add predefined ignores for the core themes
export const inheritance = async (name) => {
  const themeDest = path.join(tempPath, themes[name].dest)

  // Clean destination dir before generating new symlinks
  fs.removeSync(themeDest)

  // Add the Magento/base resources as a dependency for everyone
  const libSrc = path.join(projectPath, 'lib')
  generateSymlinks(libSrc, themeDest, '', [
    'internal/*',
    'web/tiny_mce_4',
    'web/extjs',
    'web/chartjs',
    'web/css/docs/*'
  ])

  // TODO: For each modules, create symlinks for the theme
  // TODO: Get the modules from the config.php file

  // Create symlinks for all the related themes
  getThemeDependencyTree(name).forEach((themeName) => {
    const theme = themes[themeName]
    const themeSrc = path.join(projectPath, theme.src)
    generateSymlinks(themeSrc, themeDest, '', theme.ignore)
  })
}
