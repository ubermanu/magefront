import glob from 'fast-glob'
import { parseString } from 'xml2js'
import fs from 'fs'
import less from 'magefront-plugin-less'
import phpParser from 'php-parser'

/**
 * Returns all the themes with their source path.
 * @return {{path: *, name: string}[]}
 */
export const getThemes = () => {
  let themes = {}

  glob.sync('app/design/{frontend,adminhtml}/*/*/theme.xml').forEach((path) => {
    const name = path.split('/').slice(-3, -1).join('/')
    let parent = false

    const themeXml = fs.readFileSync(path, 'utf8')
    parseString(themeXml, (err, res) => {
      parent = res.theme.parent ? res.theme.parent[0] : false
    })

    themes[name] = {
      name,
      src: path.replace(/\/theme.xml$/, ''),
      parent
    }
  })

  // get the themes from the vendor directory
  const composerLock = JSON.parse(fs.readFileSync('composer.lock', 'utf8'))
  const composerThemes = composerLock.packages.filter(
    (pkg) => pkg.type === 'magento2-theme'
  )

  composerThemes.forEach((pkg) => {
    let name = pkg.name
    const src = `vendor/${pkg.name}`
    const themeXml = fs.readFileSync(`${src}/theme.xml`, 'utf8')
    let parent = false

    parseString(themeXml, (err, res) => {
      parent = res.theme.parent ? res.theme.parent[0] : false
    })

    const registration = phpParser.tokenGetAll(
      fs.readFileSync(`${src}/registration.php`, 'utf8')
    )

    registration.forEach((token) => {
      if (token[0] === 'T_CONSTANT_ENCAPSED_STRING') {
        name = token[1]
          .replace(/^['"]|['"]$/g, '')
          .replace(/^frontend\/|^adminhtml\//, '')
      }
    })

    themes[name] = {
      name,
      src,
      parent
    }
  })

  console.log(themes)

  return Object.values(themes)
}

export const getTheme = (name) => {
  const theme = getThemes().find((theme) => theme.name === name)
  if (!theme) {
    throw new Error(`Theme ${name} not found`)
  }
  return theme
}

// TODO: return default config if not defined
// TODO: get the correct root path
// TODO: support multiple output languages
export const getThemeConfig = async (name) => {
  const theme = getTheme(name)

  const customConfig = await import(
    `${process.cwd()}/${theme.src}/magefront.config.js`
  ).default

  const defaultConfig = {
    plugins: [less()]
  }

  const config = Object.assign({}, defaultConfig, customConfig)
  config.src = theme.src
  config.dest = `pub/static/frontend/${name.replace('_', '/')}/en_US`

  // Get the parent name from the theme.xml file
  // const themeXml = fs.readFileSync(`${src}/theme.xml`, 'utf8')
  // parseString(themeXml, (err, result) => {
  //   if (err) {
  //     throw new Error(err)
  //   }
  //   config.parent = result.theme.parent[0] || false
  // })

  return config
}
