import fs from 'fs'
import glob from 'fast-glob'
import { parseString } from 'xml2js'

/**
 * Read the config file and return a list of enabled modules.
 *
 * @return {*}
 */
export function getModules() {
  const modules = {}

  const config = fs.readFileSync(`${process.cwd()}/app/etc/config.php`, 'utf8')
  config.match(/'(\w+_\w+)'\s*=>\s*(\d)/g).forEach((match) => {
    const [, module, enabled] = match.match(/'(\w+_\w+)'\s*=>\s*(\d)/)
    modules[module] = { name: module, enabled: enabled === 1, src: null }
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
