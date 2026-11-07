<script setup lang="ts">
import type {Brand} from '~/helper/beads/brands'

// The one block that works in any language: beads, a count and real codes.
// Everything in it is either a colour or a number, so the only words it needs
// are the count and the link, both of which the caller passes in already
// translated.
const props = defineProps<{ brand: Brand; countLabel: string; chartLabel: string }>()

const regular = computed(() => props.brand.beads.filter(b => !b.special))
// Enough to show the range at a glance without becoming a second chart.
const shown = computed(() => regular.value.slice(0, 48))
const codes = computed(() => props.brand.beads.slice(0, 3).map(b => b.code).join(', '))
</script>

<template>
  <div class="palette-strip">
    <ul class="palette-dots" :aria-label="countLabel">
      <li v-for="b in shown" :key="b.code"><span class="bead-dot" :style="{background: b.hex}" :title="`${b.code} ${b.name}`" /></li>
    </ul>
    <p class="muted small">{{ countLabel }} &middot; {{ codes }} &hellip;</p>
    <p><NuxtLink :to="`/colors/${brand.id}`" class="btn btn-small"><Icon name="swatch" />{{ chartLabel }}</NuxtLink></p>
  </div>
</template>
