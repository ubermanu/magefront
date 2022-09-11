import fs from 'fs-extra'
import glob from 'fast-glob'
import path from 'path'

import { getModules } from '../magento/module'
import { getThemes } from '../magento/theme'
import { rootPath, tempPath } from '../env'

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

function createCopy(srcPath, destPath) {
  fs.removeSync(destPath)
  fs.copySync(srcPath, destPath)
}

function generateCopies(src, dest, replacePattern, ignore = []) {
  glob
    .sync([src + '/**'].concat(ignore.map((pattern) => '!**/' + pattern)), {
      nodir: true
    })
    .forEach((srcPath) => {
      createCopy(srcPath, path.join(dest, srcPath.toString()).replace(src + '/', replacePattern + '/'))
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
export const inheritance = async (themeName) => {
  const themeDest = path.join(rootPath, tempPath, findTheme(themeName).dest)

  // Clean destination dir before generating new symlinks
  fs.removeSync(themeDest)

  // Add the Magento/base resources as a dependency for everyone
  // TODO: Might have too many ignores here (for backend theme)
  const libSrc = path.join(rootPath, 'lib')
  generateCopies(libSrc, themeDest, '', ['internal/*', 'web/css/docs'])

  // For each enabled modules, create symlinks into the theme
  const modules = getModules().filter((m) => m.enabled && m.src)
  const area = findTheme(themeName).area
  const ignore = ['page_layout', 'layout', 'templates']

  modules.forEach((m) => {
    // Resolve the "base" area as well (common to frontend and adminhtml)
    generateCopies(path.join(rootPath, m.src, 'view', 'base'), path.join(themeDest, m.name), '', ignore)
    generateCopies(path.join(rootPath, m.src, 'view', area), path.join(themeDest, m.name), '', ignore)
  })

  // Create symlinks for all the related themes
  getThemeDependencyTree(themeName).forEach((themeName) => {
    const theme = findTheme(themeName)
    const themeSrc = path.join(rootPath, theme.src)
    generateCopies(themeSrc, themeDest, '', theme.ignore)
  })
}
