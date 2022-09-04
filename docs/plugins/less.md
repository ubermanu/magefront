# LESS

The LESS plugin transpiles LESS files to CSS.

> 💡 This plugin is enabled by default if no configuration is defined

### Usage

```js
// magefront.config.js
import less from 'magefront-plugin-less'

export default {
    plugins: [less()]
}
```

### Compatibility

The LESS version is `2.7.3`, so it can be compatible with the actual Magento2 codebase, without any configuration.

A `compiler` option is available if you need the latest LESS features:

```js
// magefront.config.js
import less from 'magefront-plugin-less'
import v4 from 'less'

export default {
    plugins: [less({ compiler: v4 })]
}
```
