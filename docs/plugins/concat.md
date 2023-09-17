---
title: Concat plugin
---

# Concat

Merge files into one.

## Install

    npm i magefront-plugin-concat --save-dev

## Usage

```js
import concat from 'magefront-plugin-concat'

export default {
    plugins: [
        concat({ src: '**/*.css', dest: 'css/all-styles.css' })
    ]
}
```

## Options

### `src` ⭐

The files to combine.

### `ignore`

A list of paths to ignore.

### `dest` ⭐

The destination file.

### `remove`

Delete the original files. Default is `true`.

<br>
<small>⭐ - Required option</small>
