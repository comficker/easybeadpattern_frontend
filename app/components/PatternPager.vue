<script setup lang="ts">
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
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Pages">
    <NuxtLink v-if="page > 1" class="btn btn-small" :to="to(page - 1)"><Icon name="arrow-left" />{{ l.prev }}</NuxtLink>
    <span class="muted">{{ l.of(page, pages) }}</span>
    <NuxtLink v-if="page < pages" class="btn btn-small" :to="to(page + 1)">{{ l.next }}<Icon name="arrow-right" /></NuxtLink>
  </nav>
</template>
