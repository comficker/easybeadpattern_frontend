<script setup lang="ts">
import type {PatternFilter} from '~/composables/useApi'

// A fixed, unpaginated strip of patterns (home page, "more like this").
const props = defineProps<{ filter?: PatternFilter; pageSize?: number; craft?: string }>()
const filter = computed(() => ({...props.filter, page_size: props.pageSize ?? 12}))
const key = Object.entries(props.filter || {}).map(([k, v]) => `${k}:${v}`).join('-') || 'latest'
const {data} = await usePatterns(`strip-${key}`, filter)
</script>

<template>
  <PatternGrid v-if="data?.results?.length" :items="data.results" :craft="craft" />
  <p v-else class="muted">No patterns here yet. Make one from an image on the <NuxtLink to="/">maker</NuxtLink>.</p>
</template>
