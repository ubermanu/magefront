# magefront-plugin-terser

Minify JS files with [terser](https://terser.org/).

## Install

    npm i magefront-plugin-terser

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

### `terserOptions`

Options to pass to the [terser](https://terser.org/docs/api-reference#minify-options) minifier.
