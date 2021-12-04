import fs from 'fs'
import PhpParser from 'php-parser'
import glob from 'fast-glob'
import { parseString } from 'xml2js'

const parser = new PhpParser({
  parser: {
    extractDoc: false,
    php7: true
  },
  ast: {
    withPositions: false
  }
})

/**
 * Read the config file and return a list of enabled modules.
 *
 * @return {*}
 */
export function getModules() {
  const ast = parser.tokenGetAll(
    fs.readFileSync(`${process.cwd()}/app/etc/config.php`)
  )
  const modules = {}
  let moduleName = ''

  ast.forEach((node) => {
    if (Array.isArray(node)) {
      if (node[0] === 'T_CONSTANT_ENCAPSED_STRING') {
        moduleName = node[1].replace(/'/g, '')
      }
      if (node[0] === 'T_LNUMBER' && node[1] === '1') {
        modules[moduleName] = { name: moduleName, enabled: true, src: null }
        moduleName = ''
      }
      if (node[0] === 'T_LNUMBER' && node[1] === '0') {
        modules[moduleName] = { name: moduleName, enabled: false, src: null }
        moduleName = ''
      }
    }
  })

  glob.sync('app/code/*/*/registration.php').forEach((path) => {
    const name = path.split('/').slice(2, -1).join('_')
    modules[name].src = path.split('/').slice(0, -1).join('/')
  })

  const composerLock = JSON.parse(fs.readFileSync('composer.lock', 'utf8'))
  const composerModules = composerLock.packages.filter(
    (pkg) => pkg.type === 'magento2-module'
  )

  composerModules.forEach((pkg) => {
    let name = ''

    const moduleXml = fs.readFileSync(
      `${process.cwd()}/vendor/${pkg.name}/etc/module.xml`,
      'utf8'
    )
    parseString(moduleXml, (err, res) => {
      name = res.config.module[0]['$']['name']
    })

    if (name) {
      modules[name].src = `vendor/${pkg.name}`
    }
  })

  return modules
}
