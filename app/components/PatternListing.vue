<script setup lang="ts">
import type {PatternPage} from '~/composables/useApi'

// Shared layout of every pattern listing page: crumbs, heading, intro, grid, pager.
defineProps<{
    title: string
    intro?: string
    crumbs?: { to: string; label: string }[]
    data: PatternPage | null | undefined
    page: number
}>()
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <p v-if="crumbs?.length" class="crumbs">
        <template v-for="c in crumbs" :key="c.to"><NuxtLink :to="c.to">{{ c.label }}</NuxtLink> / </template>{{ title }}
      </p>
      <h1>{{ title }}</h1>
      <p v-if="intro" class="listing-intro">{{ intro }}</p>
      <slot name="filters" />
      <PatternGrid v-if="data?.results?.length" :items="data.results" :level="2" />
      <p v-else class="muted">No patterns here yet. Make one from an image on the <NuxtLink to="/">maker</NuxtLink>.</p>
      <PatternPager :page="page" :pages="data?.num_pages ?? 1" />
      <slot />
    </div>
  </section>
</template>
