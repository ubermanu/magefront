import fs from 'node:fs'
import type { Action } from '../../types/magefront'

export const clean: Action = async (context) => {
  const { buildConfig } = context

  // Cleanup the `var/view_preprocessed` folder
  if (fs.existsSync(buildConfig.tmp)) {
    await fs.promises.rm(buildConfig.tmp, { recursive: true })
  }

  // Clean up the `pub/static` folder
  if (fs.existsSync(buildConfig.dest)) {
    await fs.promises.rm(buildConfig.dest, { recursive: true })
  }
}
