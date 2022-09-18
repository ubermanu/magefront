# React

Transforms *.jsx files into *.js files using [Babel](https://babeljs.io/).

This plugin is based on [magefront-plugin-babel](plugins/babel.md).

## Install

    npm i magefront-plugin-react react @babel/core @babel/preset-react --save-dev

> 💡 `react`, `@babel/core` and `@babel/preset-react` are peer dependencies and must be installed.

## Usage

```js
import react from 'magefront-plugin-react'

export default {
    plugins: [
        react()
    ]
}
```

## Options

### `src`

The source files to transform. Default is `**/*.jsx`.

### `ignore`

A list of paths to ignore. Default is `['**/node_modules/**']`.

### `compilerOptions`

Options to pass to the [typescript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) compiler.
