# CSSNano

Compress CSS files.

This plugin is based on [magefront-plugin-postcss](plugins/postcss.md).

## Install

    npm i magefront-plugin-cssnano --save-dev

## Usage

```js
import cssnano from 'magefront-plugin-cssnano'

export default {
    plugins: [
        cssnano()
    ]
}
```

## Options

### `src`

The CSS files to minify. Default is `**/!(_)*.css`.

### `ignore`

A list of paths to ignore.

### `preset`

The preset to use. Default is `default`.

### `plugins`

A list of PostCSS plugins to use. See the [CSSNano docs](https://cssnano.co/docs/config-file/#use-individual-plugins) for more info.
