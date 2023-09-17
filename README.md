![npm](https://img.shields.io/npm/v/magefront) ![build](https://img.shields.io/github/actions/workflow/status/ubermanu/magefront/build.yml?branch=main) ![tests](https://img.shields.io/github/actions/workflow/status/ubermanu/magefront/ci.yml?branch=main&label=tests)

<br>
<p align="center">
    <img src="identity/magefront-logo.svg" alt width="200">
</p>
<br>

**Magefront** is a tool that gives you the choice of which technology your themes rely on.

For example, it can be `less`, `sass`, `stylus`, or whatever you want! 🚀

You can see a list of the available plugins [here](https://ubermanu.github.io/magefront/#/plugins).

## Install

Install the package at the root level of your project:

    npm install magefront

## Usage

    npx magefront [options] [locale]

Example:

    npx magefront -t Magento/blank en_US

## Configuration

The `magefront.config.js` file should be located in the root directory of your project.

```js
// magefront.config.js
export default {
  presets: ['magefront-preset-default'],
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
