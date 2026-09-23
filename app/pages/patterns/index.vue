<script setup lang="ts">
const route = useRoute()
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const filter = computed(() => ({page: page.value, page_size: 24}))
const [{data: facets}, {data}] = await Promise.all([useFacets(), usePatterns('all', filter)])

// A page past the end would repeat the last page under another URL.
if (page.value > (data.value?.num_pages ?? 1)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const ls = listingSeo(data.value?.results)
useSeo({
    title: `Free bead patterns for Perler and Hama${pageSuffix(page.value)}`,
    description: `${pagePrefix(page.value)}${data.value?.count ?? ''} free bead patterns by theme, size and difficulty. Open any in Perler, Hama, Artkal or MARD colours with counts and printable pages.`,
    path: `/patterns${pageQuery(page.value)}`,
    image: ls.image,
    jsonLd: [ls.itemList, ldBreadcrumbs([{name: 'Home', path: '/'}, {name: 'Patterns'}])],
})
</script>

<template>
  <PatternListing
    title="Free bead patterns"
    :intro="listingIntro(data?.count ?? 0, 'fuse', data?.stats)"
    :data="data"
    :page="page"
  >
    <template #filters><PatternFilters :facets="facets" /></template>
  </PatternListing>
</template>
