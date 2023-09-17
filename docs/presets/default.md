---
title: Default preset
---

# Default preset

Includes a set of plugins that are mandatory for Magento 2 themes.

## Install

    npm i magefront-preset-default --save-dev

## Usage

```js
import defaultPreset from 'magefront-preset-default'

export default {
    presets: [
        defaultPreset()
    ]
}
```

## Plugins

- [magefront-plugin-less](../plugins/less.md)
- [magefront-plugin-requirejs-config](../plugins/requirejs-config.md)
- [magefront-plugin-js-translation](../plugins/js-translation.md)

The following ones are included but not enabled by default:

- [magefront-plugin-terser](../plugins/terser.md)
- [magefront-plugin-postcss](../plugins/postcss.md)


## Options

### `minifyCss`

Minify the CSS files, using [cssnano](https://cssnano.co/) and the [postcss](../plugins/postcss.md) plugin.

### `minifyJs`

Minify the JS files, using the [terser](../plugins/terser.md) plugin.

### `mergeCss`

> ⚠️ Not yet implemented.

### `mergeJs`

> ⚠️ Not yet implemented.

### `bundleJs`

> ⚠️ Not yet implemented.
