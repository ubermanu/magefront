<script>
  import pkg from 'magefront/package.json'

  const { class: additionalClass } = $$restProps
</script>

<a class="logo flex items-center {additionalClass}" href="/">
  <img src="/magefront-logo.svg" alt="" class="mr-2 h-9 w-9" />
  <p class="font-serif text-2xl font-light">Magefront</p>
  <div class="bg-neutral-600 ml-3 rounded px-1 py-0.5 text-center text-xs text-white shadow">
    v{pkg.version}
  </div>
</a>
