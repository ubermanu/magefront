# magefront-plugin-concat

Merge files into one.

## Install

    npm i magefront-plugin-concat

## Usage

```js
import concat from 'magefront-plugin-concat'

export default {
  plugins: [concat({ src: '**/*.css', dest: 'css/all-styles.css' })],
}
```

See the [documentation](https://ubermanu.github.io/magefront/#/plugins/concat) for more information.
