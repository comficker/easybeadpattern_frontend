<script setup lang="ts">
import {isCraftId} from '~/helper/beads/crafts'
import {gridFromMapNumbers} from '~/helper/beads/pattern'
import type {ArtDetail, ArtRow} from '~/composables/useApi'

const route = useRoute()
const id = String(route.params.id)
const [{data: entry}, {data: art, error}] = await Promise.all([
    useFetch<ArtRow & { tagCounts: Record<string, number> }>(`/api/patterns/${id}`, {key: `entry-${id}`}),
    useFetch<ArtDetail>(`/coloring/shared-pages/${id}/`, {
        baseURL: apiBase(),
        key: `pattern-${id}`,
        // Keep only what this page reads. The detail payload carries more (the
        // user object includes account meta), and it would all land in the HTML.
        transform: (d: any): ArtDetail => ({
            id: d.id, id_string: d.id_string, name: d.name, desc: d.desc, width: d.width, height: d.height,
            updated: d.updated, colors: d.colors, map_numbers: d.map_numbers,
            taxonomies: (d.taxonomies || []).map((t: any) => ({id_string: t.id_string, name: t.name})),
            user: d.user ? {username: d.user.username} : null,
        }),
    }),
])
if (error.value || !art.value || !entry.value) throw createError({statusCode: 404, statusMessage: 'Pattern not found', fatal: true})

// ?craft=kandi opens the pattern as that craft (links from the beadwork tools).
// The canonical URL stays the plain pattern page.
const initialCraft = isCraftId(route.query.craft) ? route.query.craft : 'fuse'
const source = computed(() => art.value && gridFromMapNumbers(art.value.width, art.value.height, art.value.colors || [], art.value.map_numbers || {}))
const a = art.value!
const e = entry.value!
const size = `${e.width}x${e.height}`
const level = LEVELS[e.level]
const tags = computed(() => a.taxonomies.map(t => ({...t, count: e.tagCounts?.[t.id_string]})))
const site = useRuntimeConfig().public.siteUrl as string

// Size in the title keeps same-named patterns apart and matches "16x16" searches.
const seoTitle = `${a.name} bead pattern, ${a.width}×${a.height}`
useSeo({
    title: seoTitle,
    description: `Free ${a.name} bead pattern: ${a.width} × ${a.height}, ${e.beads} beads in ${e.colors} colours, ${level.name.toLowerCase()}. Open it in Perler, Hama or Artkal and print it.`,
    path: `/patterns/${a.id_string}`,
    image: artThumb(a, 'art-social'),
    imageAlt: `${a.name} bead pattern, ${a.width} by ${a.height} beads`,
    type: 'article',
    jsonLd: [
        {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: `${a.name} bead pattern`,
            description: a.desc || undefined,
            image: artThumb(a, 'art-social'),
            url: `${site}/patterns/${a.id_string}`,
            keywords: [...a.taxonomies.map(t => t.name), 'bead pattern', 'perler beads'].join(', '),
            author: a.user?.username ? {'@type': 'Person', name: a.user.username} : undefined,
            dateModified: a.updated,
            isAccessibleForFree: true,
        },
        ldBreadcrumbs([
            {name: 'Patterns', path: '/patterns'},
            ...(a.taxonomies[0] ? [{name: `${a.taxonomies[0].name} bead patterns`, path: `/patterns/tag/${a.taxonomies[0].id_string}`}] : []),
            {name: a.name},
        ]),
    ],
})
</script>

<template>
  <div v-if="art">
    <section class="hero">
      <div class="wrap">
        <p class="crumbs">
          <NuxtLink to="/patterns">Patterns</NuxtLink> /
          <template v-if="art.taxonomies[0]"><NuxtLink :to="`/patterns/tag/${art.taxonomies[0].id_string}`">{{ art.taxonomies[0].name }}</NuxtLink> / </template>
          {{ art.name }}
        </p>
        <h1>{{ art.name }} bead pattern</h1>
        <p>
          <NuxtLink :to="`/patterns/size/${size}`">{{ sizeLabel(size) }} beads</NuxtLink>,
          {{ e.beads }} beads in {{ e.colors }} colour{{ e.colors > 1 ? 's' : '' }},
          <NuxtLink :to="`/patterns/level/${e.level}`">{{ level.name.toLowerCase() }}</NuxtLink>.
          Pick your bead brand, then download the PDF.
        </p>
      </div>
    </section>
    <div class="wrap">
      <PatternWorkbench :source="source" :title="art.name" craft-switch :initial-craft="initialCraft" />
    </div>
    <section class="section">
      <div class="wrap"><div class="prose">
        <p v-if="art.desc">{{ art.desc }}</p>
        <p v-if="art.user?.username" class="muted">
          Pixel art by {{ art.user.username }} on
          <a :href="`https://simplepixelart.com/art/${art.id_string}`">SimplePixelArt</a>.
        </p>
        <div v-if="tags.length" class="stack-top">
          <TagChips :tags="tags" label="Themes of this pattern" />
        </div>
      </div></div>
    </section>
    <section class="section section-flush">
      <div class="wrap">
        <h2>Similar bead patterns</h2>
        <PatternGallery :filter="{related: art.id_string}" :page-size="12" />
      </div>
    </section>
  </div>
</template>
