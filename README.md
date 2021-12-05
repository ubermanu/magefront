![Magefront](docs/images/magefront-logo-title.svg)

This project is a frontend tool for Magento 2.

It gives the themes the ability to choose which technology they rely on, based on the `magefront.config.js` file.

## Install

Install the package at the root level of your website:

    npm install magefront

## Usage

    npx magefront build --theme Magento/blank

**Note**: If no configuration file is present in the theme, it will use the default plugins: LESS and Babel

## Configuration

The configuration file should be located in the root directory of the theme.

It accepts a series of plugins, see the following example:

```js
// magefront.config.js
import less from 'magefront-plugin-less';

module.exports = {
    plugins: [
        less()
    ]
};
```
