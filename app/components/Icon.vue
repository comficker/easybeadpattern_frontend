<script setup lang="ts">
// Iconsax (iconsax.io) "linear" glyphs, served as static SVGs from public/icons/
// and painted with a CSS mask so they take `currentColor`. Decorative: the
// control that holds one carries the accessible name.
defineProps<{ name: string }>()
</script>

<template>
  <span class="ic" aria-hidden="true" :style="{'--src': `url(/icons/${name}.svg)`}" />
</template>
