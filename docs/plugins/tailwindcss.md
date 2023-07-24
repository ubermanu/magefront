# Tailwind

Generates CSS with [TailwindCSS](https://tailwindcss.com/) from your template files.

## Install

    npm i magefront-plugin-tailwindcss --save-dev

## Usage

```js
import tailwindcss from 'magefront-plugin-tailwindcss'

export default {
    plugins: [
        tailwindcss({
            src: 'web/css/tailwind.css'
        })
    ]
}
```

## Options

### `src` ⭐

The CSS source file to process.

### `ignore`

A list of paths to ignore.

### `config`

The [TailwindCSS configuration](https://tailwindcss.com/docs/configuration) to use.

<br>
<small>⭐ - Required option</small>
