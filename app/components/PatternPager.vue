<script setup lang="ts">
const props = defineProps<{ page: number; pages: number }>()
const route = useRoute()
const to = (p: number) => ({query: {...route.query, page: p > 1 ? p : undefined}})
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Pages">
    <NuxtLink v-if="page > 1" class="btn btn-small" :to="to(page - 1)"><Icon name="arrow-left" />Previous</NuxtLink>
    <span class="muted">Page {{ page }} of {{ pages }}</span>
    <NuxtLink v-if="page < pages" class="btn btn-small" :to="to(page + 1)">Next<Icon name="arrow-right" /></NuxtLink>
  </nav>
</template>
