<script setup lang="ts">
defineProps<{ tags: { id_string: string; name: string; count?: number }[]; label: string }>()
</script>

<template>
  <nav v-if="tags.length" class="tags" :aria-label="label">
    <NuxtLink v-for="t in tags" :key="t.id_string" :to="`/patterns/tag/${t.id_string}`" class="tag">
      {{ t.name }}<span v-if="t.count" class="tag-count">{{ t.count }}</span>
    </NuxtLink>
  </nav>
</template>
