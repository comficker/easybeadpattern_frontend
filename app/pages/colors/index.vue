<script setup lang="ts">
import {CHART_IDS, getBrand} from '~/helper/beads/brands'

useSeo({
    title: 'Bead colour charts: Perler, Hama, Artkal',
    description: 'Colour charts for Perler, Hama, Artkal, Nabbi and MARD fuse beads and DMC embroidery floss, with every colour code, name and hex value.',
    path: '/colors',
    image: '/og/colors.png',
    jsonLd: [
        ldItemList(CHART_IDS.map(id => ({name: `${getBrand(id).name} colour chart`, path: `/colors/${id}`}))),
        ldBreadcrumbs([{name: 'Home', path: '/'}, {name: 'Colour charts'}]),
    ],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <h1>Colour charts</h1>
      <p class="listing-intro">Every colour code and name for each brand the maker supports.</p>
      <div class="pgrid chart-cards">
        <NuxtLink v-for="id in CHART_IDS" :key="id" :to="`/colors/${id}`" class="pcard">
          <div class="pcard-img">
            <span v-for="b in getBrand(id).beads.filter(x => !x.special).slice(0, 36)" :key="b.code" class="bead-dot" :style="{background: b.hex}" />
          </div>
          <div>
            <h2 class="pcard-title">{{ getBrand(id).name }}</h2>
            <p>{{ getBrand(id).beads.length }} colours</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
