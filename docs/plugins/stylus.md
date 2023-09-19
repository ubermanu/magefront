---
title: Stylus plugin
---

# Stylus

Transforms STYL files into CSS files.

## Install

Install the plugin and its dependencies:

```shell
npm i stylus magefront-plugin-stylus --save-dev
```

## Usage

```js
import stylus from 'magefront-plugin-stylus'

export default {
    plugins: [
        stylus()
    ]
}
```

## Options

### `src`

The source files to minify. Default is `**/!(_)*.styl`.

### `ignore`

A list of paths to ignore.

### `sourcemaps`

Enable sourcemaps. Default is `false`.

### `compilerOptions`

Options to pass to the stylus compiler. See [stylus docs](http://stylus-lang.com/docs/js.html#options) for more info.
