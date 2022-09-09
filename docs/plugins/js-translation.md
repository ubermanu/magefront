# JS Translation

The JsTranslation plugin wraps all the locale `*.csv` files and output it as a JSON file.

This is the same behavior as the Magento 2 PHP module (but in JS).

> 💡 This plugin is enabled by default

### Usage

```js
// magefront.config.js
import jsTranslation from 'magefront-plugin-js-translation'

export default {
    plugins: [jsTranslation()]
}
```
