<script>
  import '@fontsource-variable/roboto-slab'
  import '../app.pcss'
  import { Github } from 'lucide-svelte'
</script>

<svelte:head>
  <meta
    name="description"
    content="A CLI tool for building Magento 2 themes with any modern frontend stack, including SASS, Tailwind, Svelte, TypeScript, and more."
  />
</svelte:head>

<main class="flex min-h-screen flex-col px-4 font-sans text-white md:px-8">
  <header class="p-4">
    <div class="container mx-auto">
      <nav class="flex items-center justify-between">
        <a class="logo flex items-center" href="/">
          <img src="/magefront-logo.svg" alt="" class=" mr-2 h-9 w-9" />
          <p class="font-serif text-2xl font-light">Magefront</p>
        </a>
        <div class="flex items-center space-x-6">
          <a href="/docs">Docs</a>
          <a href="/docs/plugins">Plugins</a>
          <a href="https://github.com/ubermanu/magefront" target="_blank" rel="noopener noreferrer">
            <Github class="h-6 w-6" />
          </a>
        </div>
      </nav>
    </div>
  </header>

  <slot />

  <footer class="py-8">
    <div class="container mx-auto text-center">
      <p class="text-sm text-neutral-400">&copy; {new Date().getFullYear()} Magefront and its contributors. Licensed under MIT.</p>
    </div>
  </footer>
</main>
