---
title: Typescript plugin
---

# Typescript

Transforms *.ts files into JS files.

## Install

```shell
npm i magefront-plugin-typescript --save-dev
```

## Usage

```js
import typescript from 'magefront-plugin-typescript'

export default {
    plugins: [
        typescript()
    ]
}
```

## Options

### `src`

The source files to transform. Default is `**/*.ts`.

### `ignore`

A list of paths to ignore. Default is `['**/node_modules/**', '**/*.d.ts']`.

### `compilerOptions`

Options to pass to the [typescript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) compiler.
