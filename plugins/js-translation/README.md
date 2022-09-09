# magefront-plugin-translation

Merge all the translations into the `js-translation.json` file.

## Install

    npm i magefront-plugin-js-translation

## Usage

```js
import jsTranslation from 'magefront-plugin-js-translation'

export default {
    plugins: [
        jsTranslation()
    ]
}
```

## Note

This is a mandatory plugin if you [disabled the static content deploy process](https://github.com/ubermanu/magento2-deploy-disabled/).
