# Svelte

Compile *.svelte files into JS files.

## Install


    npm i magefront-plugin-svelte svelte --save-dev

> 💡 `svelte` is a peer dependency and must be installed.

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

The svelte compiler options. Check the [Svelte docs](https://svelte.dev/docs#svelte_compile) for more info.
