import fs from 'fs-extra'
import glob from 'fast-glob'
import path from 'path'
import { getModules, getThemes } from '../main.mjs'
import { projectPath, tempPath } from '../config.mjs'

const themes = getThemes()

function findTheme(name) {
  return themes.find((theme) => theme.name === name)
}

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
      createSymlink(srcPath, path.join(dest, srcPath.toString()).replace(src + '/', replacePattern + '/'))
    })
}

function getThemeDependencyTree(themeName, dependencyTree) {
  dependencyTree = dependencyTree ? dependencyTree : []
  dependencyTree.push(themeName)

  if (findTheme(themeName).parent) {
    return getThemeDependencyTree(findTheme(themeName).parent, dependencyTree)
  } else {
    return dependencyTree.reverse()
  }
}

// TODO: Add predefined ignores for the core themes
export const inheritance = async (name) => {
  const themeDest = path.join(tempPath, findTheme(name).dest)

  // Clean destination dir before generating new symlinks
  fs.removeSync(themeDest)

  // Add the Magento/base resources as a dependency for everyone
  // TODO: Might have too many ignores here (for backend theme)
  const libSrc = path.join(projectPath, 'lib')
  generateSymlinks(libSrc, themeDest, '', ['internal/*', 'web/css/docs'])

  // For each enabled modules, create symlinks into the theme
  const modules = Object.values(getModules()).filter((m) => m.enabled && m.src)
  const area = findTheme(name).area
  const ignore = ['page_layout', 'layout', 'templates']

  modules.forEach((m) => {
    // Resolve the "base" area as well (common to frontend and adminhtml)
    generateSymlinks(path.join(projectPath, m.src, 'view', 'base'), path.join(themeDest, m.name), '', ignore)
    generateSymlinks(path.join(projectPath, m.src, 'view', area), path.join(themeDest, m.name), '', ignore)
  })

  // Create symlinks for all the related themes
  getThemeDependencyTree(name).forEach((themeName) => {
    const theme = findTheme(themeName)
    const themeSrc = path.join(projectPath, theme.src)
    generateSymlinks(themeSrc, themeDest, '', theme.ignore)
  })
}
