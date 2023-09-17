<script>
  import Pagination from '$lib/components/Pagination.svelte'
</script>

<div class="prose prose-neutral prose-invert max-w-none flex-grow py-10">
  <div class="container mx-auto">
    <slot />
  </div>
</div>

<Pagination />
