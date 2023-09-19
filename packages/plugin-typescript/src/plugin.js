import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import typescript from 'typescript'

/**
 * Transform TypeScript files to JavaScript.
 *
 * @param {import('types').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'typescript',

  async build(context) {
    const { src, ignore, compilerOptions } = { ...options }

    const files = await glob(src ?? '**/*.ts', {
      ignore: ignore ?? ['**/node_modules/**', '**/*.d.ts'],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath)
        const output = typescript.transpile(
          fileContent.toString(),
          compilerOptions ?? {}
        )

        return fs.writeFile(filePath.replace(/\.ts$/, '.js'), output)
      })
    )
  },
})
