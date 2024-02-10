import imageminGifsicle from 'imagemin-gifsicle'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imagemin from 'magefront-plugin-imagemin'

/**
 * Return the optimize preset. Targets all the supported file types by default.
 *
 * @returns {import('magefront').Preset}
 */
export default () => {
  /** @type {import('magefront').Plugin[]} */
  const plugins = []

  // Add image optimization plugins
  plugins.push(
    imagemin({
      plugins: [
        imageminPngquant(),
        imageminJpegtran(),
        imageminGifsicle(),
        imageminSvgo(),
      ],
    })
  )

  return { plugins }
}
