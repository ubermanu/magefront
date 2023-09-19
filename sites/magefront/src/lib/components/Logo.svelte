<script>
  import { base } from '$app/paths'
  import pkg from 'magefront/package.json'

  const { class: additionalClass } = $$restProps
</script>

<a class="logo flex items-center {additionalClass}" href="{base}/">
  <img
    src="{base}/magefront-logo.svg"
    alt=""
    class="mr-2 h-9 w-9 max-sm:h-7 max-sm:w-7"
  />
  <p class="font-serif text-2xl font-light max-sm:text-xl">Magefront</p>
  <div
    class="ml-3 rounded bg-neutral-600 px-1 py-0.5 text-center text-xs text-white shadow"
  >
    v{pkg.version}
  </div>
</a>
