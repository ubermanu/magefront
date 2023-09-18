<script>
  import { page } from '$app/stores'
  import List from './Sidebar/List.svelte'

  $: sidebar = $page.data.sidebar
</script>

<div class="px-2 text-neutral-300">
  <List items={sidebar?.children ?? []} />
</div>
