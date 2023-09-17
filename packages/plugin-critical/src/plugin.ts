import * as critical from 'critical'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import prettyBytes from 'pretty-bytes'

export interface Options {
  src: string | string[]
  dest?: string
  viewport?: {
    width: number
    height: number
  }
}

/** Generate a critical CSS file from CSS files. */
export default (options?: Options): Plugin => {
  const { src, dest, viewport } = { ...options }

  return async (context) => {
    if (!src) {
      throw new Error('Missing "src" option')
    }

    const cssFiles = Array.isArray(src) ? src : [src]

    const { css } = await critical.generate({
      inline: false,
      html: '<html></html>',
      base: context.src,
      css: cssFiles.map((file) => path.join(context.src, file)),
      width: viewport?.width,
      height: viewport?.height,
    })

    const filePath = path.join(context.src, dest || 'css/critical.css')
    await fs.writeFile(filePath, css, 'utf-8')

    // Get the file size in bytes.
    const { size } = await fs.stat(filePath)

    context.logger.info(`Critical CSS file written to ${dest || 'css/critical.css'} (${prettyBytes(size)})`)
  }
}
