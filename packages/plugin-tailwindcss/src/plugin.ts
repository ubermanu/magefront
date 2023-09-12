import type { Plugin } from 'magefront'
import postcss, { type Options as PostcssOptions } from 'magefront-plugin-postcss'
import path from 'node:path'
import tailwind, { type Config } from 'tailwindcss'

export interface Options extends Omit<PostcssOptions, 'plugins'> {
  config?: Omit<Config, 'content'>
}

export default (options?: Options): Plugin => {
  const { src, ignore, config } = { ...options }

  if (!src) {
    throw new Error('Missing required option: src')
  }

  return {
    name: 'tailwindcss',
    async build(context) {
      // TODO: Target the phtml files (from the module sources, might target overridden files)
      // TODO: Target the layout files (from the module sources, might target overridden files)
      const modulePaths = context.modules.map((mod) => path.join(context.src, mod, '/**/*.html'))

      // TODO: Let the user target its content files
      const content = [
        // prettier-ignore
        ...modulePaths,
      ]

      const plugin = postcss({
        src,
        ignore,
        plugins: [
          // @ts-ignore
          tailwind({ ...config, content }),
        ],
      })

      await plugin.build(context)
    },
  }
}
