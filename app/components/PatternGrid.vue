<script setup lang="ts">
import type {ArtRow} from '~/composables/useApi'
import {LOCALES, type Locale} from '~/helper/i18n/locales'

const props = withDefaults(defineProps<{
    items: ArtRow[]
    craft?: string
    level?: 2 | 3
    // Translated pages pass their locale; the pattern names themselves come
    // from the shared library and stay English.
    locale?: Locale
}>(), {level: 3})

const ui = computed(() => (props.locale ? LOCALES[props.locale].ui : null))
const meta = (a: ArtRow) => ui.value
    ? ui.value.card(a.width, a.height, a.colors)
    : `${a.width} × ${a.height} beads, ${a.colors} colour${a.colors > 1 ? 's' : ''}`
const alt = (a: ArtRow) => ui.value
    ? ui.value.cardAlt(patternName(a), a.width, a.height)
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
