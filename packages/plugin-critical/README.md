# magefront-plugin-critical

Generate critical CSS from your CSS files.

## Install

    npm i magefront-plugin-critical

## Usage

```js
import critical from 'magefront-plugin-critical'

export default {
  plugins: [critical({ src: ['css/styles-m.css', 'css/styles-l.css'] })],
}
```

See the [documentation](https://ubermanu.github.io/magefront/#/plugins/critical) for more information.
