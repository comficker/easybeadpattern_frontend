<script setup lang="ts">
import {DE_BY_SLUG, deAlternates, dePath} from '~/helper/de'

const route = useRoute()
const page = DE_BY_SLUG(String(route.params.slug))
if (!page) throw createError({statusCode: 404, statusMessage: 'Seite nicht gefunden', fatal: true})

// The gallery page shares the English catalogue; only the chrome is German.
const pageNum = computed(() => Math.max(1, Number(route.query.page) || 1))
const {data} = page.kind === 'gallery'
    ? await usePatterns('all', computed(() => ({page: pageNum.value, page_size: 24})))
    : {data: ref(null)}
if (page.kind === 'gallery' && pageNum.value > (data.value?.num_pages ?? 1)) {
    throw createError({statusCode: 404, statusMessage: 'Seite nicht gefunden', fatal: true})
}

const path = dePath(page) + (page.kind === 'gallery' ? pageQuery(pageNum.value) : '')
useSeo({
    title: page.metaTitle + (page.kind === 'gallery' ? pageSuffix(pageNum.value) : ''),
    description: page.metaDescription,
    path,
    lang: 'de',
    // Paged listings are one page in a series, so only page 1 claims the pair.
    alternates: pageNum.value === 1 ? deAlternates(page) : undefined,
    image: page.brand ? `/og/brand-${page.brand}.png` : '/og/default.png',
    jsonLd: [
        ...(page.kind === 'maker' ? [ldTool(page.h1, page.metaDescription, path)] : []),
        ...(page.faq?.length ? [ldFaq(page.faq)] : []),
        ldBreadcrumbs([{name: 'Bügelperlen Vorlagen', path: '/de/buegelperlen-vorlagen'}, {name: page.h1}]),
    ],
})
</script>

<template>
  <div v-if="page.kind === 'maker'">
    <section class="hero">
      <div class="wrap">
        <h1>{{ page.h1 }}</h1>
        <p>{{ page.intro }}</p>
      </div>
    </section>
    <div class="wrap">
      <PatternWorkbench :initial-brand="page.brand" storage-key="bap:maker" title="Meine Vorlage" />
    </div>
    <DeSections :page="page" />
  </div>
  <div v-else>
    <PatternListing
      :title="page.h1"
      :intro="page.intro"
      :data="data"
      :page="pageNum"
      lang="de"
      empty="Hier gibt es noch keine Vorlagen."
      :pager-labels="{prev: 'Zurück', next: 'Weiter', of: (p: number, n: number) => `Seite ${p} von ${n}`}"
    />
    <DeSections :page="page" />
  </div>
</template>
