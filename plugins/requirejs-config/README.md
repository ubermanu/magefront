# magefront-plugin-requirejs-config

Merge all the `requirejs-config.js` files into one.

## Install

    npm i magefront-plugin-requirejs-config

## Usage

```js
import requireJsConfig from 'magefront-plugin-requirejs-config'

export default {
    plugins: [
        requireJsConfig()
    ]
}
```

## Note

This is a mandatory plugin if your theme uses the Magento 2 `requirejs` implementation.
