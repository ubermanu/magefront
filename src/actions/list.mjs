import Table from 'cli-table'

import { getThemes } from '../magento/theme.mjs'

/**
 * List all the themes.
 */
export const list = () => {
  const themes = getThemes()
  const table = new Table({ head: ['Theme', 'Area', 'Src', 'Parent'] })

  for (let t of Object.values(themes)) {
    table.push([t.name, t.area, t.src, t.parent || ''])
  }

  console.log(table.toString())
}
