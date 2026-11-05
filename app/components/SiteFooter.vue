<script setup lang="ts">
import type {BrandId} from '~/helper/beads/brands'
import {BRAND_IDS, CHART_IDS, getBrand} from '~/helper/beads/brands'
import type {LocalePage} from '~/helper/i18n/pages'
import {BEADWORK_IDS, CRAFTS} from '~/helper/beads/crafts'
import {LOCALES, LOCALE_CODES, englishParts, isLocale} from '~/helper/i18n/locales'
import {PAGES, localePath} from '~/helper/i18n/pages'
import {GUIDES} from '~/helper/guides'

// On a translated page the footer is in that language. The tools themselves
// are English, so it names them in this language and the line under the
// columns says where the untranslated ones live -- the same bargain the
// header already makes. Guides and the beadwork crafts are long-form English,
// so they are left to that line instead of sitting under a translated heading.
const route = useRoute()
const locale = computed(() => {
    const seg = route.path.split('/')[1]
    return isLocale(seg) ? seg : null
})
const ui = computed(() => (locale.value ? LOCALES[locale.value].ui : null))
const english = computed(() => (ui.value ? englishParts(ui.value) : null))

// A brand or the gallery leads to its translated page where there is one, and
// to the English tool where there is not. Listing both would put the same name
// in the footer twice under two different links.
function localeHref(want: (p: LocalePage) => boolean, fallback: string) {
    const l = locale.value
    if (!l) return fallback
    const p = PAGES[l].find(want)
    return p ? localePath(l, p) : fallback
}
const homeHref = computed(() => localeHref(p => p.kind === 'maker' && !p.brand, '/'))
const galleryHref = computed(() => localeHref(p => p.kind === 'gallery', '/patterns'))
const brandHref = (id: BrandId) => localeHref(p => p.brand === id, `/${getBrand(id).slug}`)
</script>

<template>
  <footer class="site-footer">
    <div class="wrap">
      <div v-if="locale && ui" class="cols">
        <div>
          <h2 class="footer-title">{{ ui.footer.makers }}</h2>
          <ul>
            <li><NuxtLink :to="homeHref">{{ ui.nav.home }}</NuxtLink></li>
            <li v-for="id in BRAND_IDS" :key="id"><NuxtLink :to="brandHref(id)">{{ ui.footer.maker(getBrand(id).name) }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">{{ ui.footer.charts }}</h2>
          <ul>
            <li v-for="id in CHART_IDS" :key="id"><NuxtLink :to="`/colors/${id}`">{{ ui.footer.chart(getBrand(id).name) }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">{{ ui.footer.patterns }}</h2>
          <ul>
            <li><NuxtLink :to="galleryHref">{{ ui.footer.all }}</NuxtLink></li>
            <li><NuxtLink to="/patterns/tag">{{ ui.footer.themes }}</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/easy">{{ ui.footer.easy }}</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/medium">{{ ui.footer.medium }}</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/hard">{{ ui.footer.hard }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">{{ ui.footer.tools }}</h2>
          <ul>
            <li><a href="https://simplepixelart.com">SimplePixelArt</a></li>
            <li><a href="https://www.squarecoloring.com/">SquareColoring</a></li>
            <li><a href="https://freegraphpaper.net">FreeGraphPaper</a></li>
          </ul>
        </div>
      </div>

      <div v-else class="cols">
        <div>
          <h2 class="footer-title">Pattern makers</h2>
          <ul>
            <li v-for="id in BRAND_IDS" :key="id"><NuxtLink :to="`/${getBrand(id).slug}`">{{ getBrand(id).name }} bead pattern maker</NuxtLink></li>
            <li><NuxtLink :to="`/${CRAFTS.cross.slug}`">{{ CRAFTS.cross.title }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Beadwork</h2>
          <ul>
            <li v-for="id in BEADWORK_IDS" :key="id"><NuxtLink :to="`/${CRAFTS[id].slug}`">{{ CRAFTS[id].title }}</NuxtLink></li>
            <li><NuxtLink to="/bead-letters">Bead letters</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Colour charts</h2>
          <ul>
            <li v-for="id in CHART_IDS" :key="id"><NuxtLink :to="`/colors/${id}`">{{ getBrand(id).name }} colour chart</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Patterns</h2>
          <ul>
            <li><NuxtLink to="/patterns">All bead patterns</NuxtLink></li>
            <li><NuxtLink to="/patterns/tag">Themes A to Z</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/easy">Easy bead patterns</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/medium">Medium bead patterns</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/hard">Hard bead patterns</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Guides</h2>
          <ul>
            <li v-for="g in GUIDES" :key="g.slug"><NuxtLink :to="`/guides/${g.slug}`">{{ g.title }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">More tools</h2>
          <ul>
            <li><a href="https://simplepixelart.com">SimplePixelArt</a></li>
            <li><a href="https://www.squarecoloring.com/">SquareColoring</a></li>
            <li><a href="https://freegraphpaper.net">FreeGraphPaper</a></li>
          </ul>
        </div>
      </div>

      <p v-if="ui && english" class="footer-english">{{ english.before }}<NuxtLink to="/">{{ ui.englishLink }}</NuxtLink>{{ english.after }}</p>

      <nav class="footer-langs" :aria-label="ui ? ui.footer.languages : 'Language'">
        <h2 class="footer-title"><Icon name="global" />{{ ui ? ui.footer.languages : 'Language' }}</h2>
        <ul>
          <li><NuxtLink to="/" :class="{on: !locale}">English</NuxtLink></li>
          <li v-for="c in LOCALE_CODES" :key="c">
            <NuxtLink :to="localePath(c, PAGES[c][0]!)" :class="{on: locale === c}">{{ LOCALES[c].name }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <p class="credit">Bead colours from <a href="https://github.com/maxcleme/beadcolors">beadcolors</a> (MIT). DMC floss numbers from our own reference table. Perler, Hama, Artkal, Nabbi, MARD, DMC, Miyuki and Toho are trademarks of their owners; this site is not affiliated with them.</p>
    </div>
  </footer>
</template>
