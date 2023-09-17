<script>
  import '@fontsource-variable/roboto-slab'
  import '../app.pcss'
</script>

<main class="text-white min-h-screen flex flex-col font-sans px-4 md:px-8">
  <slot />
  <footer class="py-8">
    <div class="container mx-auto text-center">
      <p class="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} Magefront. Licensed under MIT.</p>
    </div>
  </footer>
</main>
