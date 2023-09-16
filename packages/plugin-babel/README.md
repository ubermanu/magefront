# magefront-plugin-babel

Transpile JS files with [Babel](https://babeljs.io/).

## Install

    npm i magefront-plugin-babel

## Usage

```js
import babel from 'magefront-plugin-babel'

export default {
  plugins: [babel({ src: 'js/source/**/*.js' })],
}
```

See the [documentation](https://ubermanu.github.io/magefront/#/plugins/babel) for more information.
