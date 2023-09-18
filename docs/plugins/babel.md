---
title: Babel plugin
---

# Babel

Transpile JS files with [Babel](https://babeljs.io/).

## Install

```shell
npm i magefront-plugin-babel --save-dev
```

## Usage

```js
import babel from 'magefront-plugin-babel'

export default {
    plugins: [
        babel({ src: 'js/source/**/*.js' })
    ]
}
```

## Options

### `src` ⭐

The source files to transform.<br>
This is not targeted to all the `.js` files by default because the Magento 2 JS files are kind of *messy*.<br>
If you want to still give it a go, you can use `src: '**/*.js'`.

### `ignore`

A list of paths to ignore.

### `compilerOptions`

Options to pass to the [babel compiler](https://babeljs.io/docs/en/options).

<br>
<small>⭐ - Required option</small>
