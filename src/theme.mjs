import glob from 'fast-glob'
import { parseString } from 'xml2js'
import fs from 'fs'
import less from 'magefront-plugin-less'
import phpParser from 'php-parser'

/**
 * Returns all the themes with their source path.
 * @return {{[key: string]: object}}
 */
// TODO: Maybe create a magento module to output these data instead of parsing PHP files with JS
export const getThemes = () => {
  let themes = {}

  glob.sync('app/design/{frontend,adminhtml}/*/*/theme.xml').forEach((path) => {
    const name = path.split('/').slice(3, -1).join('/')
    let parent = false

    const themeXml = fs.readFileSync(path, 'utf8')
    parseString(themeXml, (err, res) => {
      parent = res.theme.parent ? res.theme.parent[0] : false
    })

    themes[name] = {
      name,
      src: path.replace(/\/theme.xml$/, ''),
      dest: `pub/static/${path.split('/').slice(2, -1).join('/')}`,
      parent
    }
  })

  // get the themes from the vendor directory
  const composerLock = JSON.parse(fs.readFileSync('composer.lock', 'utf8'))
  const composerThemes = composerLock.packages.filter(
    (pkg) => pkg.type === 'magento2-theme'
  )

  composerThemes.forEach((pkg) => {
    let fullName = pkg.name
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
        fullName = token[1].replace(/^['"]|['"]$/g, '')
      }
    })

    const name = fullName.split('/').slice(1).join('/')
    themes[name] = {
      name,
      src,
      dest: `pub/static/${fullName}`,
      parent
    }
  })

  console.log(themes)

  return themes
}

// TODO: return default config if not defined
// TODO: get the correct root path
// TODO: support multiple output languages
export const getThemeBuildConfig = async (name) => {
  const theme = getThemes()[name]

  // const customConfig = await import(
  //   `${process.cwd()}/${theme.src}/magefront.config.js`
  // ).default

  const customConfig = {}

  const defaultConfig = {
    plugins: [less()]
  }

  const config = Object.assign({}, defaultConfig, customConfig)
  config.src = process.cwd() + '/var/view_preprocessed/magefront/' + theme.dest
  config.dest = `pub/static/frontend/${name.replace('_', '/')}/en_US`

  // console.log(config)

  return config
}
