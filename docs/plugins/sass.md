# SASS

The SASS plugin transpiles SCSS files to CSS.

### Usage

```js
// magefront.config.js
import sass from 'magefront-plugin-sass'

export default {
    plugins: [sass()]
}
```

### Node Sass

The plugin uses the dart port of sass by default. If you want to use the node-sass implementation, you can pass the compiler as an option:

```js
// magefront.config.js
import sass from 'magefront-plugin-sass'
import nodeSass from 'node-sass'

export default {
    plugins: [
        sass({ compiler: nodeSass })
    ]
}
```
