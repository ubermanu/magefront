import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Roboto Slab Variable', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#ff2a2a',
        },
      },
    },
  },
  plugins: [typography()],
}
