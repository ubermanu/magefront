<script>
  import { page } from '$app/stores'
  import { ChevronLeft, ChevronRight } from 'lucide-svelte'
  import { beforeNavigate, invalidate } from '$app/navigation'

  const { previous, next } = $page.data.pagination

  beforeNavigate(() => {
    invalidate('pagination')
  })
</script>

<div class="container mx-auto flex items-center justify-between text-neutral-300">
  {#if previous}
    <a class="mr-auto flex items-center p-2 pl-0" href="/docs/{previous.slug}" rel="prev">
      <ChevronLeft class="mr-2 h-6 w-6" />
      {previous.metadata?.title}
    </a>
  {/if}
  {#if next}
    <a class="ml-auto flex items-center p-4 pr-0" href="/docs/{next.slug}" rel="next">
      {next.metadata?.title}
      <ChevronRight class="ml-2 h-6 w-6" />
    </a>
  {/if}
</div>
