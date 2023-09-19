---
title: Less plugin
---

# Less

Transforms Less files into CSS files.

## Install

Install the plugin and its dependencies:

```shell
npm i less@3 magefront-plugin-less --save-dev
```

> See the [compatibility](#compatibility) section for more info.

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

### `sourcemaps`

Enable sourcemaps. Default is `false`.

### `plugins`

A list of plugins to use. See [less docs](http://lesscss.org/usage/#plugins) for more info.

### `magentoImport`

Enable the [magento import](#magento-imports) feature. Default is `true`.

### `compilerOptions`

Options to pass to the **Less** compiler. See [less docs](http://lesscss.org/usage/#programmatic-usage) for more info.

## Compatibility

The preferred **Less** version is `3.x`, so it can be compatible with the actual **Magento 2** themes, without any configuration.

If you need the latest **Less** features, you can install the latest version of the compiler and pass it to the plugin:

```shell
npm i less@latest --save-dev
```

## Magento imports

A preprocessor is automatically shipped with this plugin to handle the `@magento_import` directive.

You can find this kind of imports into the `styles-m.less` file, for example:

```less
//@magento_import 'source/_module.less';
```

This will be transformed into:

```less
/* ... */
@import '../Magento_AdvancedSearch/css/source/_module.less';
@import '../Magento_Bundle/css/source/_module.less';
@import '../Magento_Captcha/css/source/_module.less';
@import '../Magento_Catalog/css/source/_module.less';
@import '../Magento_CatalogSearch/css/source/_module.less';
/* ... */
```

> The order of the imports is related to the one from your `config.php` file.
