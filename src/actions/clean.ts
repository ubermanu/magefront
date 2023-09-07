import fs from 'node:fs'
import { Action } from '../types'

export const clean: Action = async (context) => {
  const { buildConfig } = context

  // Cleanup the `temp` folder
  if (fs.existsSync(buildConfig.src)) {
    await fs.promises.rm(buildConfig.src, { recursive: true })
  }

  // Clean up the `pub/static` folder
  if (fs.existsSync(buildConfig.dest)) {
    await fs.promises.rm(buildConfig.dest, { recursive: true })
  }
}
