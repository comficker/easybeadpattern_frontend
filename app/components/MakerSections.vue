<script setup lang="ts">
import {BEADWORK_IDS, CRAFTS} from '~/helper/beads/crafts'
</script>

<template>
  <section class="section">
    <div class="wrap">
      <h2>From photo to pegboard</h2>
      <ol class="steps">
        <li><h3>Add an image</h3><p>Drop a photo, a drawing or pixel art. It is converted in your browser and never uploaded.</p></li>
        <li><h3>Pick size and colours</h3><p>Choose how many pegboards to fill and how many colours to buy. Every colour is a real bead you can order.</p></li>
        <li><h3>Tidy the colours</h3><p>Click a colour in the list to see where it sits, then swap it for another bead or remove it.</p></li>
        <li><h3>Print and build</h3><p>The PDF has one page per pegboard with a numbered colour in every peg, and the full list of beads to buy.</p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Ready-made patterns</h2>
      <PatternGallery :page-size="12" />
      <p class="stack-top"><NuxtLink to="/patterns" class="btn">See all patterns<Icon name="arrow-right" /></NuxtLink></p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Beadwork tools</h2>
      <nav class="tags" aria-label="Beadwork tools">
        <NuxtLink v-for="id in BEADWORK_IDS" :key="id" :to="`/${CRAFTS[id].slug}`" class="tag"><Icon :name="CRAFTS[id].icon" />{{ CRAFTS[id].title }}</NuxtLink>
        <NuxtLink to="/bead-letters" class="tag"><Icon name="text" />Bead letters</NuxtLink>
      </nav>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Frequently asked questions</h2>
      <div class="faq">
        <details v-for="f in CRAFTS.fuse.faq" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
