import through from 'through2'
import path from 'path'

/**
 * A gulp plugin that replaces the relative path for files in the stream.
 *
 * @param {string|RegExp} search
 * @param {string} replace
 * @return {*}
 */
export default (search, replace) => {
  return through.obj((file, enc, cb) => {
    if (file.isNull()) {
      cb()
      return
    }

    if (file.isStream()) {
      this.emit('error', new Error('Streaming not supported'))
      cb()
      return
    }

    const relPath = file.relative.replace(search, replace)
    file.path = path.join(file.base, relPath)

    cb(null, file)
  })
}
