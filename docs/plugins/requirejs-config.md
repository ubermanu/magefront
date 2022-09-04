# RequireJS

The RequireJS plugin wraps all the `requirejs-config.js` files from the project into a single file.

This is the same behavior as the Magento 2 PHP module (but in JS).

> 💡 This plugin is enabled by default

### Usage

```js
// magefront.config.js
import requireJsConfig from 'magefront-plugin-requirejs-config'

export default {
    plugins: [requireJsConfig()]
}
```
