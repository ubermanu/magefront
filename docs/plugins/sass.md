---
title: SASS plugin
---

# SASS

Transforms SCSS files into CSS files.

## Install

```shell
npm i magefront-plugin-sass --save-dev
```

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

### `compilerOptions`

Options to pass to the sass compiler. See [sass docs](https://sass-lang.com/documentation/js-api) for more info.
