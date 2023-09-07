import Table from 'cli-table'
import console from 'node:console'
import type { Action } from '../types'

/** List all the themes. */
export const list: Action = (context) => {
  const table = new Table({ head: ['Theme', 'Area', 'Src', 'Parent'] })

  for (const theme of context.magento.themes) {
    table.push([theme.name, theme.area, theme.src, theme.parent?.name || ''])
  }

  console.log(table.toString())
}
