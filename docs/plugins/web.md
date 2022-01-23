# Copy web folders

The web plugin just copy the content of the `web` directories of your theme and modules.

- `<path-to-your-theme>/web/`
- `<path-to-your-theme>/Magento_Catalog/web/`
- `app/code/<vendor>/<module-name>/web/`
- `vendor/magento/module-<module-name>/web/`
- ...

> 💡 This plugin is enabled by default

### Usage

```js
export default {
    copyWebDir: true
}
```

or using the dedicated plugin:

```js
import copyWeb from 'magefront-plugin-web'

export default {
    plugins: [copyWeb()]
}
```
