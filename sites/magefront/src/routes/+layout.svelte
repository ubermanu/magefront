<script>
  import '@fontsource-variable/roboto-slab'
  import '../app.pcss'
  import { menu } from '$lib/stores'
  import { afterNavigate } from '$app/navigation'

  afterNavigate(() => {
    menu.set(false)
  })
</script>

<svelte:head>
  <meta
    name="description"
    content="A CLI tool for building Magento 2 themes with any modern frontend stack, including SASS, Tailwind, Svelte, TypeScript, and more."
  />
</svelte:head>

<div class="h-screen" class:overflow-hidden={$menu}>
  <main class="flex min-h-screen flex-col px-4 font-sans text-white md:px-8">
    <slot />
  </main>
</div>
