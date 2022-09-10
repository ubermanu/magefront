# magefront-plugin-sass

Transforms SCSS files into CSS files.

## Install

    npm i magefront-plugin-sass

## Usage

```js
import sass from 'magefront-plugin-sass'

export default {
    plugins: [
        sass()
    ]
}
```

## Options

### `src`

The source files to minify. Default is `**/!(_)*.scss`.

### `ignore`

A list of paths to ignore.

### `sourcemaps`

Enable sourcemaps. Default is `false`.

### `compiler`

The sass compiler to use.<br>
The default is set on **dart-sass** (the most maintained version of the engine).

Example:

```js
import sass from 'magefront-plugin-sass'
import nodeSass from 'node-sass'

export default {
    theme: 'Snowdog/blank',
    plugins: [
        sass({ compiler: nodeSass })
    ]
}
```

### `compilerOptions`

Options to pass to the sass compiler. See [sass docs](https://sass-lang.com/documentation/js-api) for more info.
