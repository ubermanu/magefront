# Configuration

The configuration is stored in the `magefront.config.js` file.

Here is a full example:

```js
import less from 'magefront-plugin-less';

export default {
    theme: 'Magento/blank',
    locales: ['en_US'],
    plugins: [less()],
    src: 'vendor/magento/theme-frontend-blank',
    dest: 'pub/static/frontend/Magento/blank',
}
```

It can also be defined as an array of configuration:

```js
export default [
    {
        theme: 'Magento/blank',
        locales: ['en_US'],
    },
    {
        theme: 'Magento/luma',
        locales: ['en_US'],
    }
]
```

> Note that the src and dest paths are automatically generated, so you don't need to specify them.
