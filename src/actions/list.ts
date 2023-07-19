import Table from 'cli-table'

import { getThemes } from '../magento/theme'

/** List all the themes. */
export const list = () => {
  const themeList = getThemes()
  const table = new Table({ head: ['Theme', 'Area', 'Src', 'Parent'] })

  for (const theme of themeList) {
    table.push([theme.name, theme.area, theme.src, theme.parent || ''])
  }

  console.log(table.toString())
}
