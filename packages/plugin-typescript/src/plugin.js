import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import typescript from 'typescript'

/**
 * Transform TypeScript files to JavaScript.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'typescript',

  async build(context) {
    const { src, ignore, compilerOptions } = { ...options }

    const files = await glob(src ?? '**/*.ts', {
      ignore: ignore ?? ['**/node_modules/**', '**/*.d.ts'],
      cwd: context.cwd,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.cwd, file)
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
