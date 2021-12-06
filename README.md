![Magefront](docs/images/magefront-logo-title.svg)

This project is a frontend tool for Magento 2.

It gives the themes the ability to choose which technology they rely on, based on the `magefront.config.js` file.

## Install

Install the package at the root level of your website:

    npm install magefront

## Usage

    npx magefront build --theme Magento/blank

## Configuration

The `magefront.config.js` file should be located in the root directory of your project.

```js
// magefront.config.js
import less from 'magefront-plugin-less';

// This is considered as the "default" configuration,
// so the original themes (blank, luma) can work without it.
export default {
    locales: ['en_US'],
    plugins: [
        less()
    ]
};
```

For more information, check the [documentation](https://ubermanu.github.io/magefront/).
