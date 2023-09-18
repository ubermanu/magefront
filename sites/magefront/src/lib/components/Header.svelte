<script>
  import { Github } from 'lucide-svelte'
  import Logo from '$lib/components/Logo.svelte'

  export let container = true
</script>

<header class="p-4">
  <div class="mx-auto" class:container={container}>
    <nav class="flex items-center justify-between gap-4">
      <slot name="before-logo" />
      <Logo />
      <div class="flex items-center space-x-6">
        <slot name="links" />
        <a href="https://github.com/ubermanu/magefront" target="_blank" rel="noopener noreferrer">
          <Github class="h-6 w-6" />
        </a>
      </div>
    </nav>
  </div>
</header>
