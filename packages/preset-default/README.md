# magefront-preset-default

Regroup a collection of plugins to build a Magento 2 theme.

- less (v3.13.1)
- requirejs-config
- js-translation

And these plugins are included, if configured:

- cssnano
- terser

## Install

    npm i magefront-preset-default

## Usage

```js
import defaultPreset from 'magefront-preset-default'

export default {
  presets: [defaultPreset()],
}
```

See the [documentation](https://ubermanu.github.io/magefront/#/presets/default) for more information.
