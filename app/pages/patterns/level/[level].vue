<script setup lang="ts">
const route = useRoute()
const level = String(route.params.level)
if (!isLevel(level)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const filter = computed(() => ({level, page: page.value, page_size: 24, sort: 'small' as const}))
const [{data: facets}, {data}] = await Promise.all([useFacets(), usePatterns(`level-${level}`, filter)])
const info = LEVELS[level]
const subject = `${info.name.toLowerCase()}`

// A page past the end would repeat the last page under another URL.
if (page.value > (data.value?.num_pages ?? 1)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const ls = listingSeo(data.value?.results)
const levelCount = facets.value?.levels[level] ?? 0
useSeo({
    title: `${info.name} bead patterns: ${levelCount} free${pageSuffix(page.value)}`,
    description: `${pagePrefix(page.value)}${levelCount} free ${subject} bead patterns (${info.blurb}) for Perler, Hama, Artkal, Nabbi and MARD beads, with printable pegboard pages.`,
    path: `/patterns/level/${level}${pageQuery(page.value)}`,
    noindex: levelCount < (facets.value?.minIndex ?? 3),
    image: ls.image,
    jsonLd: [ls.itemList, ldBreadcrumbs([{name: 'Patterns', path: '/patterns'}, {name: `${info.name} bead patterns`}])],
})
</script>

<template>
  <PatternListing
    :title="`${info.name} bead patterns`"
    :intro="`${info.name} here means ${info.blurb}. ${listingIntro(data?.count ?? 0, subject, data?.stats, {easyNote: false})}`"
    :crumbs="[{to: '/patterns', label: 'Patterns'}]"
    :data="data"
    :page="page"
  >
    <template #filters><PatternFilters :facets="facets" :level="level" /></template>
  </PatternListing>
</template>
