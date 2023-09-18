<script>
  import Pagination from '$lib/components/Pagination.svelte'
  import { Github, Menu, X } from 'lucide-svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import { menu } from '$lib/stores.js'
</script>

<header class="p-4">
  <nav class="flex items-center justify-between gap-4">
    <button on:click={() => ($menu = !$menu)} class="lg:hidden">
      <Menu class="h-6 w-6" />
    </button>
    <Logo />
    <div class="flex items-center space-x-6">
      <a href="/docs/plugins">Plugins</a>
      <a href="https://github.com/ubermanu/magefront" target="_blank" rel="noopener noreferrer">
        <Github class="h-6 w-6" />
      </a>
    </div>
  </nav>
</header>

<div class="flex flex-grow">
  <aside class="sidebar mr-8 h-auto w-1/4 rounded bg-neutral-600 bg-opacity-10 p-4 max-lg:hidden">
    <Sidebar />
  </aside>

  <div
    class="fixed inset-y-0 left-0 z-10 w-11/12 -translate-x-full transform overflow-y-auto bg-neutral-900 px-4 py-6 shadow-lg transition duration-300 ease-in-out lg:hidden"
    class:translate-x-0={$menu}
    inert={!$menu}
  >
    <button class="absolute right-4 top-4 p-4 text-white" on:click={() => ($menu = false)}>
      <X class="h-6 w-6" />
    </button>
    <Logo class="mb-4 ml-4 mt-0" />
    <Sidebar />
  </div>

  <div class="max-w-3xl flex-grow">
    <div class="prose prose-neutral prose-invert py-10">
      <div>
        <slot />
      </div>
    </div>
    <hr class="my-5 border-neutral-600 opacity-10" />
    <Pagination />
  </div>
</div>
