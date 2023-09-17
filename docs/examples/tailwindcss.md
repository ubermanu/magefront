---
title: Tailwind CSS example
---

# Tailwind CSS

The following example uses [Tailwind CSS](https://tailwindcss.com/) to generate a CSS file.

Install these packages:

```sh
npm i magefront-plugin-postcss tailwindcss autoprefixer --save-dev
```

Add the following to your `magefront.config.js` file:

```js
// magefront.config.js
import postcss from 'magefront-plugin-postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
    plugins: [
        postcss({
            src: 'css/tailwind.pcss',
            plugins: [
                tailwindcss({
                    content: ['app/design/frontend/**/*.{html,phtml}']
                }),
                autoprefixer()
            ]
        })
    ]
}
```

Create a file named `tailwind.pcss` in the `web/css` directory of your theme:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
