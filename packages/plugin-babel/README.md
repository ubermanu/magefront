# magefront-plugin-babel

Transpile JS files with [Babel](https://babeljs.io/).

## Install

    npm i magefront-plugin-babel @babel/core @babel/preset-env

## Usage

```js
import babel from 'magefront-plugin-babel'

export default {
  plugins: [
    babel({
      src: 'js/source/**/*.js',
      compilerOptions: { presets: ['@babel/preset-env'] },
    }),
  ],
}
```

See the [documentation](https://ubermanu.github.io/magefront/#/plugins/babel) for more information.
