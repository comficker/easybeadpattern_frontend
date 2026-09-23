<script setup lang="ts">
const route = useRoute()
const id = String(route.params.tag)
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const filter = computed(() => ({tag: id, page: page.value, page_size: 24}))
const [{data: theme, error}, {data}] = await Promise.all([
    useFetch<{ tag: { id_string: string; name: string; count: number }; related: { id_string: string; name: string; count: number }[]; minIndex: number }>(`/api/tags/${id}`, {key: `theme-${id}`}),
    usePatterns(`tag-${id}`, filter),
])

const tag = theme.value?.tag
if (error.value || !tag) throw createError({statusCode: 404, statusMessage: 'Theme not found', fatal: true})
const name = tag.name
const lower = name.toLowerCase()
const related = computed(() => theme.value?.related ?? [])

// A page past the end would repeat the last page under another URL.
if (page.value > (data.value?.num_pages ?? 1)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const ls = listingSeo(data.value?.results)
useSeo({
    title: `${name} bead patterns: ${tag.count} free${pageSuffix(page.value)}`,
    description: `${pagePrefix(page.value)}${tag.count} free ${lower} bead patterns for Perler, Hama, Artkal, Nabbi and MARD beads, each with a bead count and printable pegboard pages.`,
    path: `/patterns/tag/${id}${pageQuery(page.value)}`,
    noindex: tag.count < (theme.value?.minIndex ?? 3),
    image: ls.image,
    jsonLd: [ls.itemList, ldBreadcrumbs([{name: 'Patterns', path: '/patterns'}, {name: 'Themes', path: '/patterns/tag'}, {name: `${name} bead patterns`}])],
})
</script>

<template>
  <PatternListing
    :title="`${name} bead patterns`"
    :intro="listingIntro(data?.count ?? 0, lower, data?.stats)"
    :crumbs="[{to: '/patterns', label: 'Patterns'}, {to: '/patterns/tag', label: 'Themes'}]"
    :data="data"
    :page="page"
  >
    <div v-if="related.length" class="related">
      <h2>Related themes</h2>
      <TagChips :tags="related" label="Related themes" />
    </div>
  </PatternListing>
</template>
