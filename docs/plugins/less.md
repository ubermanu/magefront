# LESS

Transforms LESS files into CSS files.

## Install

    npm i magefront-plugin-less --save-dev

## Usage

```js
import less from 'magefront-plugin-less'

export default {
    plugins: [
        less()
    ]
}
```

> 💡 This plugin is enabled by default if no configuration is defined.

## Options

### `src`

The source files to minify. Default is `**/!(_)*.less`.

### `ignore`

A list of paths to ignore.

### `compiler`

The less compiler to use.<br>
The default is set on **less:2.7** for [compatibility](#compatibility) with the legacy **Magento 2** themes.

### `sourcemaps`

Enable sourcemaps. Default is `false`.

### `plugins`

A list of plugins to use. See [less docs](http://lesscss.org/usage/#plugins) for more info.<br>

### `compilerOptions`

Options to pass to the less compiler. See [less docs](http://lesscss.org/usage/#programmatic-usage) for more info.

## Compatibility

The default LESS version is `2.7.3`, so it can be compatible with the actual **Magento 2** themes, without any configuration.

A `compiler` option is available if you need the latest LESS features:

```js
import less from 'magefront-plugin-less'
import v4 from 'less'

export default {
    plugins: [
        less({ compiler: v4 })
    ]
}
```
