import { getThemes } from '../main.mjs'
import Table from 'cli-table'

export const list = () => {
  const themes = getThemes()
  const table = new Table({ head: ['Theme', 'Area', 'Src', 'Parent'] })

  for (let t of Object.values(themes)) {
    table.push([t.name, t.area, t.src, t.parent || ''])
  }

  console.log(table.toString())
}
