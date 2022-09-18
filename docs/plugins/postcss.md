# PostCSS

PostCSS plugin for **magefront**.

## Install

    npm i magefront-plugin-postcss

## Usage

```js
import postcss from 'magefront-plugin-postcss'

export default {
    plugins: [
        postcss()
    ]
}
```

## Options

### `src`

The CSS files to process. Default is `**/!(_)*.css`.

### `ignore`

A list of paths to ignore.

### `plugins`

A list of PostCSS plugins to use. See [PostCSS plugins repository](https://www.postcss.parts/) for more info.
