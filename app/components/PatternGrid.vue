<script setup lang="ts">
import type {ArtRow} from '~/composables/useApi'

withDefaults(defineProps<{ items: ArtRow[]; craft?: string; level?: 2 | 3 }>(), {level: 3})
</script>

<template>
  <div class="pgrid">
    <NuxtLink v-for="(a, i) in items" :key="a.id" :to="craft ? {path: `/patterns/${a.id_string}`, query: {craft}} : `/patterns/${a.id_string}`" class="pcard">
      <div class="pcard-img"><img :src="artThumb(a)" :alt="`${a.name} bead pattern, ${a.width} by ${a.height} beads`" :loading="i < 6 ? 'eager' : 'lazy'" :fetchpriority="i < 2 ? 'high' : undefined" width="160" height="160"></div>
      <div>
        <component :is="`h${level}`" class="pcard-title">{{ a.name }}</component>
        <p>{{ a.width }} × {{ a.height }} beads, {{ a.colors }} colour{{ a.colors > 1 ? 's' : '' }}</p>
      </div>
    </NuxtLink>
  </div>
</template>
