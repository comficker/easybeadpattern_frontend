<script setup lang="ts">
import {AZ_LETTERS, azPath} from '~/helper/az'

const route = useRoute()
const letter = String(route.params.letter).toUpperCase()
if (!AZ_LETTERS.includes(letter)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})

const {data} = await useFetch<{
    letters: { letter: string; count: number }[]
    results: { id_string: string; name: string; width: number; height: number }[]
}>('/api/az', {query: {letter}, key: `az-${letter}`})

const items = computed(() => data.value?.results ?? [])
if (!items.value.length) throw createError({statusCode: 404, statusMessage: 'No patterns under this letter', fatal: true})
const letters = computed(() => data.value?.letters ?? [])
const label = letter === '0-9' ? 'a number' : letter

useSeo({
    title: `Bead patterns starting with ${letter}: ${items.value.length} free`,
    description: `All ${items.value.length} free bead patterns whose name starts with ${label}, with their bead grid size. Open any of them in Perler, Hama, Artkal, Nabbi or MARD colours.`,
    path: azPath(letter),
    image: '/og/patterns.png',
    jsonLd: [ldBreadcrumbs([{name: 'Patterns', path: '/patterns'}, {name: 'A to Z', path: '/patterns/a-z'}, {name: letter}])],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <p class="crumbs"><NuxtLink to="/patterns">Patterns</NuxtLink> / <NuxtLink to="/patterns/a-z">A to Z</NuxtLink> / {{ letter }}</p>
      <h1>Bead patterns starting with {{ letter }}</h1>
      <p class="listing-intro">{{ items.length }} free bead patterns, by name.</p>
      <nav class="tags" aria-label="Letters">
        <NuxtLink v-for="l in letters" :key="l.letter" :to="azPath(l.letter)" class="tag">{{ l.letter }}<span class="tag-count">{{ l.count }}</span></NuxtLink>
      </nav>
      <ul class="az-list">
        <li v-for="a in items" :key="a.id_string">
          <NuxtLink :to="`/patterns/${a.id_string}`">{{ a.name }}</NuxtLink><span class="tag-count">{{ a.width }}×{{ a.height }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
