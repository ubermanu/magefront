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

### `src`

The source files to transform. Default is `**/*.svelte`.

### `ignore`

A list of paths to ignore.

### `compilerOptions`

The svelte compiler options. See [svelte docs](https://svelte.dev/docs#svelte_compile) for more info.
