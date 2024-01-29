<script>
  import { base } from '$app/paths'
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'

  // This is a hack to get around the fact that SvelteKit doesn't
  // insert the base path into the href attribute of the main button ???
  const weird = base
</script>

<svelte:head>
  <title>Magefront - Develop themes using a stack you already know.</title>
</svelte:head>

<Header>
  <svelte:fragment slot="links">
    <a href="{base}/docs/getting-started">Docs</a>
    <a href="{base}/docs/plugins">Plugins</a>
  </svelte:fragment>
</Header>

<section class="flex flex-grow items-center py-10 md:py-20">
  <div class="container mx-auto max-w-4xl text-center">
    <h1 class="mb-8 text-4xl font-black leading-tight md:text-5xl xl:text-6xl">
      Develop themes using a stack you already know.
    </h1>
    <p class="mx-auto mb-4 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-400">
      A CLI tool for building Magento 2 themes with any modern frontend stack, including <span class="text-red-600">SASS</span>,
      <span class="text-red-600">Tailwind</span>, <span class="text-red-600">Svelte</span>, <span class="text-red-600">TypeScript</span>,
      and more.
    </p>
    <a href="{weird}/docs/getting-started" class="btn btn-lg mt-4">Get Started</a>
  </div>
</section>

<Footer />
