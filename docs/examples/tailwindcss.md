# Tailwind CSS

The following example uses [Tailwind CSS](https://tailwindcss.com/) to generate a CSS file.

Install these packages, and initialize Tailwind CSS configuration:

```sh
npm i magefront-plugin-postcss tailwindcss autoprefixer --save-dev
npx tailwindcss init -p
```

Add the following to your `magefront.config.js` file:

```js
// magefront.config.js
import postcss from 'magefront-plugin-postcss'
import tailwindcss from 'tailwindcss'

export default {
    plugins: [
        postcss({
            src: 'tailwind.postcss',
            dest: 'tailwind.css',
            plugins: [tailwindcss()]
        })
    ]
}
```

Add the following to your `tailwind.postcss` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add the paths to all your templates in your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./**/*.{html,phtml}']
};
```
