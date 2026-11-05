<script setup lang="ts">
import {LOCALES, type Locale} from '~/helper/i18n/locales'
import {PAGES, localePath, type LocalePage} from '~/helper/i18n/pages'

const props = defineProps<{ locale: Locale; page: LocalePage }>()
const ui = computed(() => LOCALES[props.locale].ui)
const others = computed(() => PAGES[props.locale].filter(p => p.slug !== props.page.slug))
</script>

<template>
  <section v-if="page.steps?.length" class="section">
    <div class="wrap">
      <h2>{{ ui.steps }}</h2>
      <ol class="steps">
        <li v-for="s in page.steps" :key="s.title"><h3>{{ s.title }}</h3><p>{{ s.text }}</p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>{{ ui.more }}</h2>
      <nav class="tags" :aria-label="ui.more">
        <NuxtLink v-for="p in others" :key="p.slug" :to="localePath(locale, p)" class="tag">{{ p.h1 }}</NuxtLink>
      </nav>
      <p class="stack-top muted">{{ ui.englishNote }} <NuxtLink :to="page.en">{{ ui.englishLink }}</NuxtLink>.</p>
    </div>
  </section>

  <section v-if="page.faq?.length" class="section">
    <div class="wrap">
      <h2>{{ ui.faq }}</h2>
      <div class="faq">
        <details v-for="f in page.faq" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
