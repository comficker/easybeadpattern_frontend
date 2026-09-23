<script setup lang="ts">
import {BEADWORK_IDS, CRAFTS, type Craft} from '~/helper/beads/crafts'

const props = defineProps<{ craft: Craft }>()
const others = computed(() => BEADWORK_IDS.filter(id => id !== props.craft.id).map(id => CRAFTS[id]))
</script>

<template>
  <section class="section">
    <div class="wrap">
      <h2>How it works</h2>
      <ol class="steps">
        <li v-for="s in craft.steps" :key="s.title"><h3>{{ s.title }}</h3><p>{{ s.text }}</p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Start from a ready-made pattern</h2>
      <PatternGallery :page-size="12" :craft="craft.id" />
      <p class="stack-top"><NuxtLink to="/patterns" class="btn">See all patterns<Icon name="arrow-right" /></NuxtLink></p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Frequently asked questions</h2>
      <div class="faq">
        <details v-for="f in craft.faq" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>

  <section class="section section-flush">
    <div class="wrap">
      <h2>More beadwork tools</h2>
      <nav class="tags" aria-label="Beadwork tools">
        <NuxtLink v-for="c in others" :key="c.id" :to="`/${c.slug}`" class="tag"><Icon :name="c.icon" />{{ c.title }}</NuxtLink>
        <NuxtLink to="/bead-letters" class="tag"><Icon name="text" />Bead letters</NuxtLink>
        <NuxtLink to="/" class="tag"><Icon name="bead" />Fuse bead pattern maker</NuxtLink>
      </nav>
    </div>
  </section>
</template>
