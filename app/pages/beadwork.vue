<script setup lang="ts">
import {BEADWORK_IDS, CRAFTS} from '~/helper/beads/crafts'

useSeo({
    title: 'Beadwork pattern makers: loom, peyote, kandi',
    description: 'Free pattern makers for kandi cuffs, bead loom, peyote, brick stitch, friendship bracelets and bead letters, with counts and a written row chart.',
    path: '/beadwork',
    image: '/og/beadwork.png',
    jsonLd: [
        ldItemList(BEADWORK_IDS.map(id => ({name: CRAFTS[id].title, path: `/${CRAFTS[id].slug}`}))),
        ldBreadcrumbs([{name: 'Home', path: '/'}, {name: 'Beadwork'}]),
    ],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <h1>Beadwork pattern makers</h1>
      <p class="listing-intro">Every tool turns an image into a chart for its stitch, with the right grid, a count of what to buy and a written row-by-row list.</p>
      <div class="craft-list">
        <NuxtLink v-for="id in BEADWORK_IDS" :key="id" :to="`/${CRAFTS[id].slug}`" class="craft-item">
          <span class="craft-ic"><Icon :name="CRAFTS[id].icon" /></span>
          <h2>{{ CRAFTS[id].title }}</h2>
          <p>{{ CRAFTS[id].intro }}</p>
        </NuxtLink>
        <NuxtLink to="/bead-letters" class="craft-item">
          <span class="craft-ic"><Icon name="text" /></span>
          <h2>Bead letters</h2>
          <p>Type a word and get it as a bead pattern for kandi, pegboards or friendship bracelets.</p>
        </NuxtLink>
        <NuxtLink to="/" class="craft-item">
          <span class="craft-ic"><Icon name="bead" /></span>
          <h2>Fuse bead pattern maker</h2>
          <p>Perler, Hama, Artkal, Nabbi and MARD patterns split into 29 × 29 pegboards.</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
