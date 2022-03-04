# Plugins

Plugins can be defined through multiple ways.

Here is a list of the shipped plugins:

- [magefront-plugin-gulp](plugins/gulp.md)
- [magefront-plugin-less](plugins/less.md)
- magefront-plugin-sass
- magefront-plugin-stylus
- magefront-plugin-babel
- [magefront-plugin-web](plugins/web.md)
- [magefront-plugin-requirejs](plugins/requirejs.md)


## Function

A callable with the current themeConfig object as param.

#### Example

```js
// magefront.config.js
export default {
    plugins: [
        function plugin(themeConfig) {
            // ...
        }
    ]
}
```

## String

The ES module name of a **magefront** plugin.

#### Example

```js
// magefront.config.js
export default {
    plugins: [
        'magefront-plugin-less'
    ]
}
```

## Object

A configuration object for the `magefront-plugin-gulp` plugin.

#### Example

```js
// magefront.config.js
import gulpLess from 'gulp-less'
import sourcemaps from 'gulp-sourcemaps'

export default {
    plugins: [
        {
            src: '**/*.scss',
            dest: 'css',
            pipe: [
                sourcemaps.init(),
                gulpLess(),
                sourcemaps.write()
            ]
        }
    ]
}
```
