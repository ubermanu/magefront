# magefront-plugin-sass

Transforms SCSS files into CSS files.

## Install

    npm i magefront-plugin-sass

## Usage

```js
import sass from 'magefront-plugin-sass'

export default {
    theme: 'Magento/blank',
    plugins: [
        sass()
    ]
}
```

## Options

### `compiler`

The sass compiler to use.<br>
The default is set on **dart-sass** (the most maintained version of the engine).

Example:

```js
import sass from 'magefront-plugin-sass'
import nodeSass from 'node-sass'

export default {
    theme: 'Magento/blank',
    plugins: [
        sass({ compiler: nodeSass })
    ]
}
```

### `sourcemaps`

Enable sourcemaps. Default is `false`.
