# magefront-plugin-less

Transforms LESS files into CSS files.

## Install

    npm i magefront-plugin-less

## Usage

```js
import less from 'magefront-plugin-less'

export default {
    theme: 'Magento/blank',
    plugins: [
        less()
    ]
}
```

## Options

### `plugins`

A list of plugins to use. See [less docs](http://lesscss.org/usage/#plugins) for more info.

### `compiler`

The less compiler to use.<br>
The default is set on **less:2.7** for compatibility with the legacy Magento 2 themes.

### `sourcemaps`

Enable sourcemaps. Default is `false`.
