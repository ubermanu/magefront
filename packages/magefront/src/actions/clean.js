import fs from 'node:fs'

/**
 * Clean the build and deploy folders.
 *
 * @type {import('types').Action}
 */
export const clean = async (context) => {
  await Promise.all([cleanTmp(context), cleanPub(context)])
}

/** @type {import('types').Action} */
export const cleanTmp = async (context) => {
  const { buildConfig } = context

  // Cleanup the `var/view_preprocessed` folder
  if (fs.existsSync(buildConfig.tmp)) {
    await fs.promises.rm(buildConfig.tmp, { recursive: true })
  }
}

/** @type {import('types').Action} */
export const cleanPub = async (context) => {
  const { buildConfig } = context

  // Clean up the `pub/static` folder
  if (fs.existsSync(buildConfig.dest)) {
    await fs.promises.rm(buildConfig.dest, { recursive: true })
  }
}
