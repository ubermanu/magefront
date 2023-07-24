# Tailwind

Generates CSS with [TailwindCSS](https://tailwindcss.com/) from your template files.

## Install

    npm i magefront-plugin-tailwindcss --save-dev

## Usage

```js
import tailwindcss from 'magefront-plugin-tailwindcss'

export default {
    plugins: [
        tailwindcss()
    ]
}
```

## Options

### `src`

The templates to process. Default is `**/*.{html,phtml}`.

### `ignore`

A list of paths to ignore.

### `config`

The [TailwindCSS configuration](https://tailwindcss.com/docs/configuration) to use. Default is `tailwind.config.js`.
