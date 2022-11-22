# Configuration

The configuration is handled by a `magefront.config.js` file in the root of your project.

## Defaults

If no configuration is provided, magefront will use the following defaults:

```js
export default {
    presets: [
        'magefront-preset-default'
    ]
}
```

Which is equivalent to:

```js
export default {
    plugins: [
        'magefront-plugin-less',
        'magefront-plugin-requirejs-config',
        'magefront-plugin-js-translation'
    ]
}
```

This default configuration is required for the core **Magento 2** themes.

> You can disable them by passing an empty configuration object.


## Custom

You can target a part of the configuration for a specific theme.

```js
// magefront.config.js
import sass from 'magefront-plugin-sass'

export default {
    theme: 'Custom/blank',
    plugins: [
        sass(),
        'magefront-plugin-requirejs-config',
        'magefront-plugin-js-translation'
    ]
}
```

> The previous example is the basic config for a theme that uses [sass](plugins/sass.md) instead of [less](plugins/less.md)

It can also be defined as an array of configuration:

```js
// magefront.config.js
import sass from 'magefront-plugin-sass'

export default [
    {
        theme: 'Custom/blank',
        plugins: [
            sass(),
            'magefront-plugin-requirejs-config',
            'magefront-plugin-js-translation'
        ]
    },
    {
        theme: 'Magento/blank',
        plugins: [
            'magefront-plugin-less',
            'magefront-plugin-requirejs-config',
            'magefront-plugin-js-translation'
        ],
    }
]
```
