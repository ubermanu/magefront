import Table from 'cli-table'
import console from 'node:console'
import { getThemes } from '../magento/theme'

/**
 * List all the themes.
 *
 * @param {import('types').MagentoContext} magento
 * @returns {void}
 */
export const list = (magento) => {
  const table = new Table({ head: ['Theme', 'Area', 'Src', 'Parent'] })

  for (const theme of getThemes(magento)) {
    table.push([theme.name, theme.area, theme.src, theme.parent?.name || ''])
  }

  console.log(table.toString())
}
