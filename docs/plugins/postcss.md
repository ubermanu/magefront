---
title: PostCSS plugin
---

# PostCSS

PostCSS plugin for **magefront**.

## Install

Install the plugin and its dependencies:

```shell
npm i postcss magefront-plugin-postcss --save-dev
```

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

## Example

The following example uses [Autoprefixer](https://github.com/postcss/autoprefixer) to add vendor prefixes to CSS rules.

```js
// magefront.config.js
import postcss from 'magefront-plugin-postcss'
import autoprefixer from 'autoprefixer'

export default {
    plugins: [
        postcss({
            plugins: [
                autoprefixer()
            ]
        })
    ]
}
```
