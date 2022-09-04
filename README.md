![Magefront](docs/images/magefront-logo-title.svg)

[![Test](https://github.com/ubermanu/magefront/actions/workflows/test.yml/badge.svg)](https://github.com/ubermanu/magefront/actions/workflows/test.yml)

**Magefront** is a tool that gives you the choice of which technology your themes rely on.

For example, it can be `less`, `sass`, `stylus`, or whatever you want! 🚀

You can see a list of the available plugins [here](plugins).

## Install

Install the package at the root level of your website:

    npm install magefront

## Usage

    npx magefront build -t Magento/blank en_US

## Configuration

The `magefront.config.js` file should be located in the root directory of your project.

```js
// magefront.config.js
import less from 'magefront-plugin-less'
import requireJsConfig from 'magefront-plugin-requirejs-config'

export default {
    plugins: [
        less(),
        requireJsConfig()
    ]
}
```

> This is considered as the "default" configuration,
> so the original themes (blank, luma) can work without it.

For more information, check the [documentation](https://ubermanu.github.io/magefront/).
