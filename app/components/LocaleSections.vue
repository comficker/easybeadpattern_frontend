<script setup lang="ts">
import {LOCALES, englishParts, type Locale} from '~/helper/i18n/locales'
import {PAGES, localePath, type LocalePage} from '~/helper/i18n/pages'

// `steps` is off on a brand page: the steps are the same in every page of a
// language, so repeating them there is what made the two maker pages copies.
const props = withDefaults(defineProps<{ locale: Locale; page: LocalePage; steps?: boolean }>(), {steps: true})
const ui = computed(() => LOCALES[props.locale].ui)
const english = computed(() => englishParts(ui.value))
const others = computed(() => PAGES[props.locale].filter(p => p.slug !== props.page.slug))
</script>

<template>
  <section v-if="steps && page.steps?.length" class="section">
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
      <p class="stack-top muted">{{ english.before }}<NuxtLink :to="page.en">{{ ui.englishLink }}</NuxtLink>{{ english.after }}</p>
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
