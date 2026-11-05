<script setup lang="ts">
import type {ArtRow} from '~/composables/useApi'

const props = withDefaults(defineProps<{
    items: ArtRow[]
    craft?: string
    level?: 2 | 3
    // German pages pass 'de'; the pattern names themselves come from the
    // shared library and stay English.
    lang?: 'en' | 'de'
}>(), {level: 3})

const meta = (a: ArtRow) => props.lang === 'de'
    ? `${a.width} × ${a.height} Perlen, ${a.colors} Farbe${a.colors > 1 ? 'n' : ''}`
    : `${a.width} × ${a.height} beads, ${a.colors} colour${a.colors > 1 ? 's' : ''}`
const alt = (a: ArtRow) => props.lang === 'de'
    ? `Bügelperlen-Vorlage ${patternName(a)}, ${a.width} mal ${a.height} Perlen`
    : `${patternName(a)} bead pattern, ${a.width} by ${a.height} beads`
</script>

<template>
  <div class="pgrid">
    <NuxtLink v-for="(a, i) in items" :key="a.id" :to="craft ? {path: `/patterns/${a.id_string}`, query: {craft}} : `/patterns/${a.id_string}`" class="pcard">
      <div class="pcard-img"><img :src="artThumb(a)" :alt="alt(a)" :loading="i < 6 ? 'eager' : 'lazy'" :fetchpriority="i < 2 ? 'high' : undefined" width="160" height="160"></div>
      <div>
        <component :is="`h${level}`" class="pcard-title">{{ patternName(a) }}</component>
        <p>{{ meta(a) }}</p>
      </div>
    </NuxtLink>
  </div>
</template>
