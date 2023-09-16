import imageminGifsicle from 'imagemin-gifsicle'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import type { Preset } from 'magefront'
import imagemin from 'magefront-plugin-imagemin'

/** Return the optimize preset. Targets all the supported file types by default. */
export default (): Preset => {
  const plugins = []

  // Add image optimization plugins
  plugins.push(
    imagemin({
      plugins: [imageminPngquant(), imageminJpegtran(), imageminGifsicle(), imageminSvgo()],
    })
  )

  return { plugins }
}
