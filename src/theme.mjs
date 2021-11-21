import glob from 'fast-glob'
import { parseString } from 'xml2js'
import fs from 'fs'
import less from 'magefront-plugin-less'

// TODO: add support for the themes in the adminhtml
// TODO: add support for the themes in the vendor directory
export const getThemes = () => {
  const entries = glob.sync('app/design/frontend/*/*/theme.xml')
  console.log(entries)
}

export const getThemeSrcDir = (name) => {
  const entries = glob.sync(
    `app/design/frontend/${name.replace('_', '/')}/theme.xml`
  )
  const path = entries.map((entry) => entry.replace('/theme.xml', '')).shift()
  if (!path) {
    throw new Error(`Theme ${name} not found`)
  }
  return path
}

// TODO: return default config if not defined
// TODO: get the correct root path
// TODO: support multiple output languages
export const getThemeConfig = async (name) => {
  const src = getThemeSrcDir(name)
  const customConfig = await import(
    `${process.cwd()}/${src}/magefront.config.js`
  ).default

  const defaultConfig = {
    plugins: [less()]
  }

  const config = Object.assign({}, defaultConfig, customConfig)
  config.src = src
  config.dest = `pub/static/frontend/${name.replace('_', '/')}/en_US`

  // Get the parent name from the theme.xml file
  const themeXml = fs.readFileSync(`${src}/theme.xml`, 'utf8')
  parseString(themeXml, (err, result) => {
    if (err) {
      throw new Error(err)
    }
    config.parent = result.theme.parent[0] || false
  })

  return config
}
