<script>
  import { Github } from "lucide-svelte";
</script>

<header class="p-4">
  <div class="container mx-auto">
    <nav class="flex justify-between items-center">
      <div class="flex items-center">
        <img src="/magefront-logo.svg" alt="" class="logo w-9 h-9 mr-2" />
        <p class="font-serif text-2xl font-light">Magefront</p>
      </div>
      <div class="space-x-4 flex items-center">
        <a href="/docs">Docs</a>
        <a href="/docs/plugins">Plugins</a>
        <a href="https://github.com/ubermanu/magefront" target="_blank" rel="noopener noreferrer">
          <Github class="w-6 h-6" />
        </a>
      </div>
    </nav>
  </div>
</header>

<section class="py-20 flex flex-grow items-center">
  <div class="container mx-auto text-center max-w-4xl">
    <h1 class="text-6xl font-black mb-4">Develop themes using a stack you already know.</h1>
    <p class="text-xl mb-4 max-w-3xl mx-auto text-neutral-400 leading-relaxed">
      A CLI tool for building Magento 2 themes with any modern frontend stack, including <span class="text-red-600">SASS</span>,
      <span class="text-red-600">Tailwind</span>, <span class="text-red-600">Svelte</span>, <span class="text-red-600">TypeScript</span>,
      and more.
    </p>
    <a href="/docs" class="btn btn-lg mt-4">Get Started</a>
  </div>
</section>

<footer class="py-8">
  <div class="container mx-auto text-center">
    <p class="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} Magefront. Licensed under MIT.</p>
  </div>
</footer>
