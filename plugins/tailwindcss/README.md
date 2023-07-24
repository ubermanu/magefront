# magefront-plugin-tailwindcss

Generates CSS with [TailwindCSS](https://tailwindcss.com/) from your template files.

## Install

    npm i magefront-plugin-tailwindcss

## Usage

```js
import tailwindcss from 'magefront-plugin-tailwindcss'

export default {
    plugins: [
        tailwindcss({
            src: 'web/css/tailwind.css'
        })
    ]
}
```

See the [documentation](https://ubermanu.github.io/magefront/#/plugins/tailwindcss) for more information.
