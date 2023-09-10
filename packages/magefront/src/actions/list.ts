import Table from 'cli-table'
import console from 'node:console'
import type { MagentoContext } from '../../types/magefront'
import { getThemes } from '../magento/theme'

/** List all the themes. */
export const list = (magento: MagentoContext) => {
  const table = new Table({ head: ['Theme', 'Area', 'Src', 'Parent'] })

  for (const theme of getThemes(magento)) {
    table.push([theme.name, theme.area, theme.src, theme.parent?.name || ''])
  }

  console.log(table.toString())
}
