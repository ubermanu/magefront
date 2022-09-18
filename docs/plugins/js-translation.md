# JS Translation

Merge all the translations into the `js-translation.json` file.

## Install

    npm i magefront-plugin-js-translation --save-dev

## Usage

```js
import jsTranslation from 'magefront-plugin-js-translation'

export default {
    plugins: [
        jsTranslation()
    ]
}
```

> 💡 This plugin is enabled by default if no configuration is defined.

## Note

This is a mandatory plugin if you want to use [mage/translate](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/translations/translate_theory.html) in your JS files.
