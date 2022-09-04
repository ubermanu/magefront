# magefront-plugin-svelte

Transforms *.svelte files into JS files.

## Install

    npm i magefront-plugin-svelte

## Usage

```js
import svelte from 'magefront-plugin-svelte'

export default {
    plugins: [
        svelte()
    ]
}
```

## Options

### `compilerOptions`

The svelte compiler options.
