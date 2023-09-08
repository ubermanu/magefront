# magefront

**Magefront** is a tool that builds Magento 2 themes.

## Install

Install the package at the root level of your project:

    npm install magefront

## Usage

### CLI

    npx magefront [options] [locale]

Example:

    npx magefront -t Magento/blank en_US

### API

Use the `magefront` function programmatically:

```js
import magefront from 'magefront'

await magefront({
  theme: 'Magento/blank',
  locale: 'en_US',
})
```
