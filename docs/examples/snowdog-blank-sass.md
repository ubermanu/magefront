# Snowdog blank Sass

This theme relies on [Frontools](https://github.com/SnowdogApps/magento2-frontools) by default.

- It requires [node-sass](https://github.com/SnowdogApps/magento2-frontools#sass-compilerjson-structure) in order to compile the Sass files.
- The scss files are located in the `styles` directory.

## Configuration

```js
// magefront.config.js
import sass from 'magefront-plugin-sass'
import nodeSass from 'node-sass'

export default {
    plugins: [
        sass({ src: 'styles/!(_)*.scss', compiler: nodeSass })
    ]
}
```

## Usage

    magefront build --theme Snowdog/blank
