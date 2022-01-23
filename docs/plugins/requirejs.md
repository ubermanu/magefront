# RequireJS

The RequireJS plugin wraps all the `requirejs-config.js` files from the project into a single file.

This is the same behavior as the Magento 2 PHP module (but in JS).

> 💡 This plugin is enabled by default

### Usage

```js
export default {
    concatRequireJs: true
}
```

or using the dedicated plugin:

```js
import requirejs from 'magefront-plugin-requirejs'

export default {
    plugins: [requirejs()]
}
```
