<script setup lang="ts">
import {DE_PAGES, dePath, type DePage} from '~/helper/de'

const props = defineProps<{ page: DePage }>()
const others = computed(() => DE_PAGES.filter(p => p.slug !== props.page.slug))
</script>

<template>
  <section v-if="page.steps?.length" class="section">
    <div class="wrap">
      <h2>Vom Foto zur Stiftplatte</h2>
      <ol class="steps">
        <li v-for="s in page.steps" :key="s.title"><h3>{{ s.title }}</h3><p>{{ s.text }}</p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Weitere Seiten auf Deutsch</h2>
      <nav class="tags" aria-label="Deutsche Seiten">
        <NuxtLink v-for="p in others" :key="p.slug" :to="dePath(p)" class="tag">{{ p.h1 }}</NuxtLink>
      </nav>
      <p class="stack-top muted">Alle Werkzeuge — Kandi, Webrahmen, Peyote, Kreuzstich — gibt es auf <NuxtLink :to="page.en">der englischen Seite</NuxtLink>.</p>
    </div>
  </section>

  <section v-if="page.faq?.length" class="section">
    <div class="wrap">
      <h2>Häufige Fragen</h2>
      <div class="faq">
        <details v-for="f in page.faq" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
