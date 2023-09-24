import { Preset } from 'magefront'

export interface Options {
  minifyJs?: boolean
  minifyCss?: boolean
  mergeCss?: boolean
  mergeJs?: boolean
  bundleJs?: boolean
}

export default function (options?: Options): Preset
