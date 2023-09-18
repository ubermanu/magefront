<script>
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { ChevronLeft, ChevronRight } from 'lucide-svelte'

  $: previous = $page.data.pagination?.previous
  $: next = $page.data.pagination?.next
</script>

<div class="flex items-center justify-between text-neutral-300">
  {#if previous}
    <a class="mr-auto flex flex-col items-start p-2 pl-0" href="{base}/docs/{previous.slug}" rel="prev">
      <div class="flex items-center text-xs uppercase leading-loose text-neutral-600">
        <ChevronLeft class="mr-1 h-3 w-3" /> Previous
      </div>
      <div class="text-lg">{previous.metadata?.title}</div>
    </a>
  {/if}
  {#if next}
    <a class="ml-auto flex flex-col items-end p-2 pr-0" href="{base}/docs/{next.slug}" rel="next">
      <div class="flex items-center text-xs uppercase leading-loose text-neutral-600">
        Next <ChevronRight class="ml-1 h-3 w-3" />
      </div>
      <div class="text-lg">{next.metadata?.title}</div>
    </a>
  {/if}
</div>
