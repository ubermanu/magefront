# SASS

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

The sass compiler to use.

### `compilerOptions`

Options to pass to the sass compiler. See [sass docs](https://sass-lang.com/documentation/js-api) for more info.

## Node Sass

The plugin uses the dart port of sass by default.\
If you want to use the node-sass implementation, you can pass the compiler as an option:

```js
import sass from 'magefront-plugin-sass'
import nodeSass from 'node-sass'

export default {
    plugins: [
        sass({ compiler: nodeSass })
    ]
}
```
