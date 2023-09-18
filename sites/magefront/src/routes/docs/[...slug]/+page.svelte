<script>
  export let data
</script>

<svelte:head>
  <title>{data.metadata?.title} - Magefront</title>
</svelte:head>

{@html data.content}
