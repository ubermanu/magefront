# Copy web folders

The web plugin just copy the content of the `web` directories of your theme and modules.

- `<path-to-your-theme>/web/`
- `<path-to-your-theme>/Magento_Catalog/web/`
- `app/code/<vendor>/<module-name>/web/`
- `vendor/magento/module-<module-name>/web/`
- ...

> 💡 This plugin is enabled by default if no configuration is defined

### Usage

```js
import copyWeb from 'magefront-plugin-web'

export default {
    plugins: [copyWeb()]
}
```
