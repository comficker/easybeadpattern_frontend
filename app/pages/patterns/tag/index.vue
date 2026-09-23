<script setup lang="ts">
const {data: facets} = await useFacets()

// Themes with enough patterns to have an indexed page, A to Z by first letter.
const groups = computed(() => {
    const min = facets.value?.minIndex ?? 3
    const tags = (facets.value?.tags ?? []).filter(t => t.count >= min).sort((a, b) => a.name.localeCompare(b.name))
    const out = new Map<string, typeof tags>()
    for (const t of tags) {
        const k = /[a-z]/i.test(t.name[0]!) ? t.name[0]!.toUpperCase() : '#'
        out.set(k, [...(out.get(k) || []), t])
    }
    return [...out]
})

useSeo({
    title: 'Bead pattern themes A to Z',
    description: 'Browse free bead patterns by theme: animals, food, characters and more. Every pattern opens in Perler, Hama, Artkal, Nabbi or MARD colours.',
    path: '/patterns/tag',
    image: '/og/patterns.png',
    jsonLd: [ldBreadcrumbs([{name: 'Patterns', path: '/patterns'}, {name: 'Themes'}])],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <p class="crumbs"><NuxtLink to="/patterns">Patterns</NuxtLink> / Themes</p>
      <h1>Bead pattern themes</h1>
      <p class="listing-intro">Every theme with at least {{ facets?.minIndex ?? 3 }} patterns, A to Z.</p>
      <div class="az">
        <div v-for="[letter, tags] in groups" :key="letter">
          <h2>{{ letter }}</h2>
          <ul>
            <li v-for="t in tags" :key="t.id_string">
              <NuxtLink :to="`/patterns/tag/${t.id_string}`">{{ t.name }}</NuxtLink><span class="tag-count">{{ t.count }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
