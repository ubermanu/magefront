---
title: Svelte plugin
---

# Svelte

Compile *.svelte files into JS files.

## Install

Install the plugin and its dependencies:

```shell
npm i svelte magefront-plugin-svelte --save-dev
```

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
