<script setup lang="ts">
import {pageWindow} from '~/helper/pager'

export interface PagerLabels { prev: string; next: string; of: (page: number, pages: number) => string }
const props = defineProps<{
    page: number
    pages: number
    // Translated pages pass their own wording; English is the default.
    labels?: PagerLabels
}>()
const l = computed<PagerLabels>(() => props.labels ?? {prev: 'Previous', next: 'Next', of: (p, n) => `Page ${p} of ${n}`})
const route = useRoute()
const to = (p: number) => ({query: {...route.query, page: p > 1 ? p : undefined}})
// Pages differ by query only, and vue-router matches active links on the path
// alone, so every pager link counts as the exact active route. Left alone,
// NuxtLink would mark all of them aria-current="page" -- and the current-page
// style with it. The value is set per link instead.
const current = (p: number) => (p === props.page ? 'page' : 'false')
// Prev/Next alone put page 40 forty crawls from the hub, which is how most of
// the library stayed unknown to Google. Numbers make every page two clicks
// away: first, last, and a window around the current one.
const nums = computed(() => pageWindow(props.page, props.pages))
</script>

<template>
  <nav v-if="pages > 1" class="pager" :aria-label="l.of(page, pages)">
    <NuxtLink v-if="page > 1" class="btn btn-small" :to="to(page - 1)" rel="prev" aria-current-value="false"><Icon name="arrow-left" />{{ l.prev }}</NuxtLink>
    <template v-for="p in nums" :key="p">
      <span v-if="p === 0" class="pager-gap">…</span>
      <NuxtLink v-else class="pager-n" :to="to(p)" :aria-current-value="current(p)">{{ p }}</NuxtLink>
    </template>
    <NuxtLink v-if="page < pages" class="btn btn-small" :to="to(page + 1)" rel="next" aria-current-value="false">{{ l.next }}<Icon name="arrow-right" /></NuxtLink>
  </nav>
</template>
