<script setup lang="ts">
import {azPath} from '~/helper/az'

// Patterns used to hang off the gallery's pager alone: half the library sat
// more than ten "Next" clicks from any hub, so Google never saw those URLs
// ("unknown to Google" on most of /patterns/* in the 18/11 index report).
// This index gives each one a link two clicks from every page of the site.
const {data} = await useFetch<{ letters: { letter: string; count: number }[]; total: number }>('/api/az', {key: 'az-index'})
const letters = computed(() => data.value?.letters ?? [])
const total = computed(() => data.value?.total ?? 0)

useSeo({
    title: `All ${total.value} bead patterns, A to Z`,
    description: `Every free bead pattern on EasyBeadPattern listed by name, A to Z. Open any of them in Perler, Hama, Artkal, Nabbi or MARD colours with bead counts and printable pages.`,
    path: '/patterns/a-z',
    image: '/og/patterns.png',
    jsonLd: [ldBreadcrumbs([{name: 'Patterns', path: '/patterns'}, {name: 'A to Z'}])],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <p class="crumbs"><NuxtLink to="/patterns">Patterns</NuxtLink> / A to Z</p>
      <h1>All bead patterns, A to Z</h1>
      <p class="listing-intro">{{ total }} free bead patterns listed by name. Pick a letter, or browse the gallery <NuxtLink to="/patterns">by theme, size and difficulty</NuxtLink>.</p>
      <nav class="tags" aria-label="Letters">
        <NuxtLink v-for="l in letters" :key="l.letter" :to="azPath(l.letter)" class="tag">{{ l.letter }}<span class="tag-count">{{ l.count }}</span></NuxtLink>
      </nav>
      <p v-if="!letters.length" class="muted">No patterns yet.</p>
      <p class="stack-top muted">0-9 holds the names that start with a number.</p>
    </div>
  </section>
</template>
