# magefront-plugin-babel

Transpile JS files with babel.

## Install

    npm i magefront-plugin-babel

## Usage

```js
import babel from 'magefront-plugin-babel'

export default {
    plugins: [
        babel({ src: 'web/js/source/**/*.js' })
    ]
}
```

## Options

The options are the same as the [babel options](https://babeljs.io/docs/en/options).

### `src`

The source files to transpile.<br>
This is not targeted to all the `.js` files by default because the Magento 2 JS files are kind of *messy*.<br>
If you want to still give it a go, you can use `src: '**/*.js'`.

