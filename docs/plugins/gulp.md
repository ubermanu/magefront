# Gulp

The Gulp plugin is a wrapper for *actual* Gulp plugins.

> 💡 This plugin is used internally by some of magefront plugins.

### Usage

```js
// magefront.config.js
import gulp from 'magefront-plugin-gulp'
import terser from 'gulp-terser'

export default {
    plugins: [
        gulp({
            src: '**/*.js',
            dest: '',
            pipe: [
                terser()
            ]
        })
    ]
}
```

or

```js
// magefront.config.js
import terser from 'gulp-terser'

export default {
    plugins: [
        {
            src: '**/*.js',
            dest: '',
            pipe: [
                terser()
            ]
        },
    ]
}
```

> 💡 If a plugin is defined as an object, it will be used as a configuration for the `magefront-plugin-gulp` plugin.
