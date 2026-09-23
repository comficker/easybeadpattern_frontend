<script setup lang="ts">
import {LEVELS, sizeLabel, type Facets, type Level} from '~/composables/useApi'

const props = defineProps<{ facets: Facets | null | undefined; tag?: string; size?: string; level?: Level }>()
const topTags = computed(() => (props.facets?.tags ?? []).filter(t => t.count >= (props.facets?.minIndex ?? 3)).slice(0, 18))
const sizes = computed(() => (props.facets?.sizes ?? []).filter(s => s.count >= (props.facets?.minIndex ?? 3)).slice(0, 12))
</script>

<template>
  <div v-if="facets" class="filters">
    <div class="tags" role="navigation" aria-label="Difficulty">
      <span class="filter-label">Difficulty</span>
      <NuxtLink
        v-for="(l, id) in LEVELS" :key="id" :to="`/patterns/level/${id}`" class="tag"
        :aria-current="level === id ? 'page' : undefined"
      >{{ l.name }}<span class="tag-count">{{ facets.levels[id] }}</span></NuxtLink>
    </div>
    <div class="tags" role="navigation" aria-label="Size">
      <span class="filter-label">Size</span>
      <NuxtLink
        v-for="s in sizes" :key="s.size" :to="`/patterns/size/${s.size}`" class="tag"
        :aria-current="size === s.size ? 'page' : undefined"
      >{{ sizeLabel(s.size) }}<span class="tag-count">{{ s.count }}</span></NuxtLink>
    </div>
    <div class="tags" role="navigation" aria-label="Themes">
      <span class="filter-label">Themes</span>
      <NuxtLink
        v-for="t in topTags" :key="t.id_string" :to="`/patterns/tag/${t.id_string}`" class="tag"
        :aria-current="tag === t.id_string ? 'page' : undefined"
      >{{ t.name }}<span class="tag-count">{{ t.count }}</span></NuxtLink>
      <NuxtLink to="/patterns/tag" class="tag">All themes</NuxtLink>
    </div>
  </div>
</template>
