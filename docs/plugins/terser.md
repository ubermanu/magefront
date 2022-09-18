# Terser

Minify JS files with [terser](https://terser.org/).

## Install

    npm i magefront-plugin-terser --save-dev

## Usage

```js
import terser from 'magefront-plugin-terser'

export default {
    plugins: [
        terser()
    ]
}
```

## Options

### `src`

The source files to minify. Default is `**/*.js`.

### `ignore`

A list of paths to ignore.

### `terserOptions`

Options to pass to the [terser](https://terser.org/docs/api-reference#minify-options) minifier.
