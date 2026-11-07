<script setup lang="ts">
import {getBrand} from '~/helper/beads/brands'
import {LOCALES, isLocale} from '~/helper/i18n/locales'
import {alternatesFor, localePath, pageIn} from '~/helper/i18n/pages'

const route = useRoute()
const lang = String(route.params.lang)
const page = isLocale(lang) ? pageIn(lang, String(route.params.slug)) : null
if (!isLocale(lang) || !page) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})

const locale = lang
const meta = LOCALES[locale]
const ui = meta.ui

// The gallery shares the English catalogue; only the chrome is translated.
const pageNum = computed(() => Math.max(1, Number(route.query.page) || 1))
const {data} = page.kind === 'gallery'
    ? await usePatterns('all', computed(() => ({page: pageNum.value, page_size: 24})))
    : {data: ref(null)}
if (page.kind === 'gallery' && pageNum.value > (data.value?.num_pages ?? 1)) {
    throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
}

// Both maker pages of a language shared the same translated steps and FAQ,
// which left them near-copies of each other with only the heading and intro
// telling them apart. A brand page shows its own palette instead -- beads,
// a count and real codes, which need no translating -- and leaves the shared
// steps to the language's head page.
const brand = computed(() => (page.brand ? getBrand(page.brand) : null))

const path = localePath(locale, page) + (page.kind === 'gallery' ? pageQuery(pageNum.value) : '')
useSeo({
    title: page.metaTitle + (page.kind === 'gallery' ? pageSuffix(pageNum.value) : ''),
    description: page.metaDescription,
    path,
    lang: meta.hreflang,
    // Page 2 and on are their own series, not a translation pair.
    alternates: pageNum.value === 1 ? alternatesFor(page.en) : undefined,
    image: page.brand ? `/og/brand-${page.brand}.png` : '/og/default.png',
    jsonLd: [
        ...(page.kind === 'maker' ? [ldTool(page.h1, page.metaDescription, path)] : []),
        ...(page.faq?.length ? [ldFaq(page.faq)] : []),
        ldBreadcrumbs([{name: ui.nav.home, path: localePath(locale, PAGES_HOME(locale))}, {name: page.h1}]),
    ],
})
</script>

<script lang="ts">
import {PAGES} from '~/helper/i18n/pages'
// The first page of a language is its home: the maker on the head term.
const PAGES_HOME = (l: keyof typeof PAGES) => PAGES[l][0]!
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
      <PatternWorkbench :initial-brand="page.brand" storage-key="bap:maker" :title="ui.patternTitle" />
      <BrandPalette
        v-if="brand"
        :brand="brand"
        :count-label="ui.colours(brand.beads.filter(b => !b.special).length)"
        :chart-label="ui.footer.chart(brand.name)"
      />
    </div>
    <LocaleSections :locale="locale" :page="page" :steps="!brand" />
  </div>
  <div v-else>
    <PatternListing
      :title="page.h1"
      :intro="page.intro"
      :data="data"
      :page="pageNum"
      :locale="locale"
      :empty="ui.empty"
      :pager-labels="ui.pager"
    />
    <LocaleSections :locale="locale" :page="page" />
  </div>
</template>
