# PNGQuant

Optimize PNG files with [pngquant](https://pngquant.org/).

## Install

    npm i magefront-plugin-pngquant --save-dev

## Usage

```js
import pngquant from 'magefront-plugin-pngquant'

export default {
    plugins: [
        pngquant()
    ]
}
```

## Options

### `src`

The PNG files to optimize. Default is `**/*.png`.

### `ignore`

A list of paths to ignore.

### `args`

The arguments to pass to `pngquant`. See the list of [pngquant options](https://pngquant.org/#options).
