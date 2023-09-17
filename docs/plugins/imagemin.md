---
title: Imagemin plugin
---

# Imagemin

A plugin to optimize your images.

## Install

```shell
npm i magefront-plugin-imagemin --save-dev
```

## Usage

```js
import imagemin from 'magefront-plugin-imagemin'

export default {
    plugins: [
        imagemin()
    ]
}
```

## Options

### `src`

The source images to minify. Default is `**/*.{jpg,jpeg,png,gif,svg}`.

### `ignore`

A list of paths to ignore.

### `plugins`

A list of plugins to use.
