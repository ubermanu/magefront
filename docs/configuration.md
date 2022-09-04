# Configuration

The configuration is stored in the `magefront.config.js` file.

Here is a full example:

```js
export default {
    theme: 'Magento/blank',
    plugins: ['magefront-plugin-less'],
    src: 'vendor/magento/theme-frontend-blank',
    dest: 'pub/static/frontend/Magento/blank',
}
```

It can also be defined as an array of configuration:

```js
export default [
    {
        theme: 'Magento/blank',
        plugins: ['magefront-plugin-less'],
    },
    {
        theme: 'Custom/blank',
        plugins: ['magefront-plugin-sass'],
    }
]
```

> Note that the src and dest paths are automatically generated, so you don't need to specify them.
