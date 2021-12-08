# RequireJS

The RequireJS plugin wraps all the `requirejs-config.js` files from the project into a single file.

This is the same behavior as the Magento 2 PHP module (but in JS).

> 💡 This plugin is enabled by default if no configuration is defined

### Usage

```js
import requirejs from 'magefront-plugin-requirejs'

export default {
    plugins: [requirejs()]
}
```
