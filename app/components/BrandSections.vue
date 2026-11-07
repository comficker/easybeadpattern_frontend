<script setup lang="ts">
import type {Brand} from '~/helper/beads/brands'
import {brandFaq, brandSections, paletteFacts} from '~/helper/beads/brandCopy'
import {BEADWORK_IDS, CRAFTS} from '~/helper/beads/crafts'

// What used to sit here was MakerSections -- the same four blocks the home
// page carries. Five brand pages repeating the home page made each of them a
// near-copy of the others, and none of it answered the question someone
// typing "hama bead pattern maker" is asking. This says what is different
// about this brand instead, from the palette data.
const props = defineProps<{ brand: Brand }>()
const facts = computed(() => paletteFacts(props.brand))
const sections = computed(() => brandSections(props.brand, facts.value))
const faq = computed(() => brandFaq(props.brand, facts.value))
</script>

<template>
  <section class="section">
    <div class="wrap">
      <h2>{{ sections[0]!.heading }}</h2>
      <BrandPalette
        :brand="brand"
        :count-label="`${facts.regular} colours`"
        :chart-label="`See the ${brand.name} colour chart`"
      />
      <p v-for="p in sections[0]!.paragraphs" :key="p">{{ p }}</p>
    </div>
  </section>

  <section v-for="s in sections.slice(1)" :key="s.heading" class="section">
    <div class="wrap">
      <h2>{{ s.heading }}</h2>
      <p v-for="p in s.paragraphs" :key="p">{{ p }}</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Other brands and crafts</h2>
      <nav class="tags" aria-label="Other brands and crafts">
        <NuxtLink v-for="id in BEADWORK_IDS" :key="id" :to="`/${CRAFTS[id].slug}`" class="tag"><Icon :name="CRAFTS[id].icon" />{{ CRAFTS[id].title }}</NuxtLink>
        <NuxtLink :to="`/${CRAFTS.cross.slug}`" class="tag"><Icon :name="CRAFTS.cross.icon" />{{ CRAFTS.cross.title }}</NuxtLink>
      </nav>
      <p class="stack-top"><NuxtLink to="/patterns" class="btn">Ready-made patterns<Icon name="arrow-right" /></NuxtLink></p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>{{ brand.name }} questions</h2>
      <div class="faq">
        <details v-for="f in faq" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
