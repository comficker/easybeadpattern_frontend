<script setup lang="ts">
import {GUIDES} from '~/helper/guides'

useSeo({
    title: 'Bead pattern guides and how-tos',
    description: 'Short guides to making bead patterns: turning a photo into a pattern, reading a chart, comparing Perler, Hama and Artkal, and ironing fuse beads.',
    path: '/guides',
    image: '/og/guides.png',
    jsonLd: [
        ldItemList(GUIDES.map(g => ({name: g.title, path: `/guides/${g.slug}`}))),
        ldBreadcrumbs([{name: 'Home', path: '/'}, {name: 'Guides'}]),
    ],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <h1>Guides</h1>
      <p class="listing-intro">Short, practical help for planning and building bead patterns.</p>
      <div class="craft-list">
        <NuxtLink v-for="g in GUIDES" :key="g.slug" :to="`/guides/${g.slug}`" class="craft-item">
          <span class="craft-ic"><Icon :name="g.icon" /></span>
          <h2>{{ g.title }}</h2>
          <p>{{ g.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
