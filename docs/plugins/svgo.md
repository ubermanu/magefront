# SVGO

Optimize SVG files with [SVGO](https://github.com/svg/svgo).

## Install

    npm i magefront-plugin-svgo --save-dev

## Usage

```js
import svgo from 'magefront-plugin-svgo'

export default {
    plugins: [
        svgo()
    ]
}
```

## Options

### `src`

The SVG files to optimize. Default is `**/*.svg`.

### `ignore`

A list of paths to ignore.

### `optimizeOptions`

Configuration to pass to SVGO. Check the [docs](https://github.com/svg/svgo#configuration) for more information.
