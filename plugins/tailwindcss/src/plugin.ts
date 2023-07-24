import type { Plugin } from 'magefront'
import postcss, { type Options as PostcssOptions } from 'magefront-plugin-postcss'
import tailwind, { type Config } from 'tailwindcss'

export interface Options extends Omit<PostcssOptions, 'plugins'> {
  config?: Config
}

export default (options?: Options): Plugin => {
  const { src, ignore, config } = { ...options }

  return postcss({
    src: src ?? '**/*.{html,phtml}',
    ignore,
    plugins: [
      // @ts-ignore
      tailwind(config),
    ],
  })
}
