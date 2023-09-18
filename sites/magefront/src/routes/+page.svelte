<script>
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
</script>

<svelte:head>
  <title>Magefront - Develop themes using a stack you already know.</title>
</svelte:head>

<Header>
  <svelte:fragment slot="links">
    <a href="/docs">Docs</a>
    <a href="/docs/plugins">Plugins</a>
  </svelte:fragment>
</Header>

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

<Footer />
