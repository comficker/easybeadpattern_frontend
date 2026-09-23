<script setup lang="ts">
const route = useRoute()
const size = String(route.params.size).toLowerCase()
if (!/^\d+x\d+$/.test(size)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const filter = computed(() => ({size, page: page.value, page_size: 24}))
const [{data: facets}, {data}] = await Promise.all([useFacets(), usePatterns(`size-${size}`, filter)])

const entry = facets.value?.sizes.find(s => s.size === size)
if (!entry) throw createError({statusCode: 404, statusMessage: 'No patterns in this size', fatal: true})
const label = sizeLabel(size)
const fits = Math.max(entry.width, entry.height) <= 29
// Sizes either side of this one, for moving up or down.
const nearby = computed(() => (facets.value?.sizes ?? [])
    .filter(s => s.size !== size && s.count >= facets.value!.minIndex)
    .sort((a, b) => Math.abs(a.width - entry.width) - Math.abs(b.width - entry.width))
    .slice(0, 6)
    .sort((a, b) => a.width - b.width))

// A page past the end would repeat the last page under another URL.
if (page.value > (data.value?.num_pages ?? 1)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const ls = listingSeo(data.value?.results)
useSeo({
    title: `${label} bead patterns: ${entry.count} free${pageSuffix(page.value)}`,
    description: `${pagePrefix(page.value)}${entry.count} free ${label} bead patterns${fits ? ' that fit on one 29 × 29 pegboard' : ''}, in Perler, Hama, Artkal, Nabbi or MARD colours with counts and printable pages.`,
    path: `/patterns/size/${size}${pageQuery(page.value)}`,
    noindex: entry.count < (facets.value?.minIndex ?? 3),
    image: ls.image,
    jsonLd: [ls.itemList, ldBreadcrumbs([{name: 'Patterns', path: '/patterns'}, {name: `${label} bead patterns`}])],
})
</script>

<template>
  <PatternListing
    :title="`${label} bead patterns`"
    :intro="`${listingIntro(data?.count ?? 0, label, data?.stats)} ${fits ? `At ${label} they fit on a single 29 × 29 pegboard, about ${(entry.width / 2).toFixed(1)} × ${(entry.height / 2).toFixed(1)} cm with 5 mm beads.` : ''}`"
    :crumbs="[{to: '/patterns', label: 'Patterns'}]"
    :data="data"
    :page="page"
  >
    <template #filters><PatternFilters :facets="facets" :size="size" /></template>
    <div v-if="nearby.length" class="related">
      <h2>Other sizes</h2>
      <nav class="tags" aria-label="Other sizes">
        <NuxtLink v-for="s in nearby" :key="s.size" :to="`/patterns/size/${s.size}`" class="tag">{{ sizeLabel(s.size) }}<span class="tag-count">{{ s.count }}</span></NuxtLink>
      </nav>
    </div>
  </PatternListing>
</template>
