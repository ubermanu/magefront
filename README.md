![Magefront](docs/images/magefront-logo-title.svg)

[![Build](https://github.com/ubermanu/magefront/actions/workflows/build.yml/badge.svg)](https://github.com/ubermanu/magefront/actions/workflows/build.yml) &nbsp; [![Test](https://github.com/ubermanu/magefront/actions/workflows/test.yml/badge.svg)](https://github.com/ubermanu/magefront/actions/workflows/test.yml)

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
import jsTranslation from 'magefront-plugin-js-translation'

export default {
    plugins: [
        less(),
        requireJsConfig(),
        jsTranslation()
    ]
}
```

> This is considered as the "default" configuration,
> so the original themes (blank, luma) can work without it.

For more information, check the [documentation](https://ubermanu.github.io/magefront/).

## Tests

You can test `magefront` on a Magento 2 instance by doing the following:

1. Clone this repository
2. Copy the `.env.test.dist` file to `.env.test` and fill in your Magento path
3. Install the dependencies: `pnpm install`
4. Run the tests: `pnpm test`
