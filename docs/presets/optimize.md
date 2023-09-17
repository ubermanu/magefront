---
title: Optimize preset
---

# Optimize preset

An additional preset to optimize your assets.

It supports the following image formats:

- jpg
- png
- gif
- svg
- webp

## Install

    npm i magefront-preset-optimize --save-dev

## Usage

```js
import optimizePreset from 'magefront-preset-optimize'

export default {
    presets: [
        optimizePreset()
    ]
}
```

## Plugins

- [magefront-plugin-imagemin](plugins/imagemin.md)
