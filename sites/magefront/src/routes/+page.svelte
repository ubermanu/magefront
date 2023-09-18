<script>
  import { Github } from 'lucide-svelte'
  import Logo from '$lib/components/Logo.svelte'
</script>

<svelte:head>
  <title>Magefront - Develop themes using a stack you already know.</title>
</svelte:head>

<header class="p-4">
  <div class="container mx-auto">
    <nav class="flex items-center justify-between">
      <Logo />
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

<section class="flex flex-grow items-center py-20">
  <div class="container mx-auto max-w-4xl text-center">
    <h1 class="mb-4 text-6xl font-black">Develop themes using a stack you already know.</h1>
    <p class="mx-auto mb-4 max-w-3xl text-xl leading-relaxed text-neutral-400">
      A CLI tool for building Magento 2 themes with any modern frontend stack, including <span class="text-red-600">SASS</span>,
      <span class="text-red-600">Tailwind</span>, <span class="text-red-600">Svelte</span>, <span class="text-red-600">TypeScript</span>,
      and more.
    </p>
    <a href="/docs" class="btn btn-lg mt-4">Get Started</a>
  </div>
</section>
