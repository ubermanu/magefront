---
title: RequireJS config plugin
---

# RequireJS

Merge all the `requirejs-config.js` files into one.

## Install

```shell
npm i magefront-plugin-requirejs-config --save-dev
```

## Usage

```js
import requireJsConfig from 'magefront-plugin-requirejs-config'

export default {
    plugins: [
        requireJsConfig()
    ]
}
```

> 💡 This plugin is enabled by default if no configuration is defined.

## Note

This is a mandatory plugin if your theme uses the **Magento 2** [RequireJS](https://developer.adobe.com/commerce/frontend-core/javascript/requirejs/) implementation.
