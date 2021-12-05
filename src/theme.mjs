import glob from 'fast-glob'
import fs from 'fs'
import less from '../plugins/less/plugin.mjs'

/**
 * Returns all the themes with their source path.
 * @return {{[key: string]: object}}
 */
export const getThemes = () => {
  let themes = {}

  glob.sync('app/design/{frontend,adminhtml}/*/*/theme.xml').forEach((path) => {
    const name = path.split('/').slice(3, -1).join('/')
    let parent = false

    const themeXml = fs.readFileSync(path, 'utf8')
    themeXml.match(/<parent>(.*)<\/parent>/g)?.forEach((match) => {
      parent = match.replace(/<parent>|<\/parent>/g, '')
    })

    themes[name] = {
      name,
      src: path.replace(/\/theme.xml$/, ''),
      dest: `pub/static/${path.split('/').slice(2, -1).join('/')}`,
      area: path.split('/')[2],
      parent
    }
  })

  // get the themes from the vendor directory
  const composerLock = JSON.parse(fs.readFileSync('composer.lock', 'utf8'))
  const composerThemes = composerLock.packages.filter(
    (pkg) => pkg.type === 'magento2-theme'
  )

  composerThemes.forEach((pkg) => {
    const src = `vendor/${pkg.name}`
    let parent = false

    const themeXml = fs.readFileSync(`${src}/theme.xml`, 'utf8')
    themeXml.match(/<parent>(.*)<\/parent>/g)?.forEach((match) => {
      parent = match.replace(/<parent>|<\/parent>/g, '')
    })

    const registration = fs.readFileSync(`${src}/registration.php`, 'utf8')
    registration
      .match(/'(frontend|adminhtml)\/([\w\/]+)'/g)
      .forEach((match) => {
        match = match.replace(/'/g, '')
        const name = match.split('/').slice(1).join('/')
        const area = match.split('/')[0]
        themes[name] = {
          name,
          src,
          dest: `pub/static/${area}/${name}`,
          area,
          parent
        }
      })
  })

  return themes
}

// TODO: return default config if not defined
// TODO: get the correct root path
export const getThemeBuildConfig = async (name) => {
  const theme = getThemes()[name]
  let customConfig = {}

  const customConfigFile = `${process.cwd()}/${theme.src}/magefront.config.js`
  if (fs.existsSync(customConfigFile)) {
    const { default: defaults } = await import(customConfigFile)
    customConfig = defaults
  }

  const defaultConfig = {
    locales: ['en_US'],
    plugins: [less()]
  }

  const config = Object.assign({}, defaultConfig, customConfig)
  config.src = `var/view_preprocessed/magefront/${theme.dest}`
  config.dest = `pub/static/frontend/${name.replace('_', '/')}`

  return config
}
