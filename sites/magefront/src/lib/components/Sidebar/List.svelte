<script>
  import { page } from '$app/stores'
  import { base } from '$app/paths'

  /** @type {SidebarItem[]} */
  export let items = []

  /** @param {string} slug */
  function is_current(slug) {
    return $page.url.pathname === base + '/docs/' + slug
  }

  const { class: additionalClass } = $$restProps
</script>

{#if items.length > 0}
  <ul class="space-y-1 {additionalClass}">
    {#each items as item}
      <li>
        {#if item?.slug}
          <a
            href="{base}/docs/{item.slug}"
            class="inline-block px-0.5 py-1"
            class:text-accent={is_current(item.slug)}
            aria-current={is_current(item.slug) ? 'page' : null}
          >
            {item.title}
          </a>
        {:else}
          <span class="inline-block px-0.5 py-1">{item.title}</span>
        {/if}
        {#if item?.children}
          <svelte:self
            items={item.children}
            class="ml-5 list-inside list-disc space-y-0 marker:text-neutral-600"
          />
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  a {
    @apply hover:text-accent underline-offset-4 transition-colors hover:underline;
  }
</style>
