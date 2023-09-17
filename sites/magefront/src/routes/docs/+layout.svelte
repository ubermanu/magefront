<script>
  import Pagination from '$lib/components/Pagination.svelte'
</script>

<div class="prose prose-neutral prose-invert container mx-auto max-w-3xl flex-grow py-10">
  <slot />
</div>

<hr class="container mx-auto my-5 max-w-3xl border-neutral-600 opacity-10" />

<Pagination />
