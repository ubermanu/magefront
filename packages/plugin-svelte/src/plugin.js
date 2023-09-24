import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import { compile } from 'svelte/compiler'

/**
 * Transform `*.svelte` files to `*.js` files.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'svelte',

  async build(context) {
    const { src, ignore, compilerOptions } = { ...options }

    const files = await glob(src ?? '**/*.svelte', {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const output = compile(fileContent.toString(), compilerOptions ?? {})

        return fs.promises.writeFile(
          filePath.replace(/\.svelte$/, '.js'),
          output.js.code
        )
      })
    )
  },
})
