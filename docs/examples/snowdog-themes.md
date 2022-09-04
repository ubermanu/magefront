# Snowdog Themes

Here is a list of themes that are applicable for this example:

- [Snowdog/blank](https://github.com/SnowdogApps/magento2-theme-blank-sass)
- [Snowdog/alpaca](https://github.com/SnowdogApps/magento2-alpaca-theme)

### Prerequisites

It is possible to replicate some of [Frontools](https://github.com/SnowdogApps/magento2-frontools) features:

- Use [node-sass](https://github.com/SnowdogApps/magento2-frontools#sass-compilerjson-structure) in order to compile the Sass files.
- The scss files are located in the `styles` directory.

Install the following dependencies:

    npm install node-sass

Create the configuration file in your project:

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

### Usage

    magefront build --theme Snowdog/blank
