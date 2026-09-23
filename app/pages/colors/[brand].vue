<script setup lang="ts">
import {CHART_IDS, getBrand, type PaletteId} from '~/helper/beads/brands'

const route = useRoute()
const id = String(route.params.brand)
if (!CHART_IDS.includes(id as PaletteId)) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
const brand = getBrand(id as PaletteId)
// Fuse brands have their own maker; DMC floss is for friendship bracelets.
const maker = brand.slug ? {to: `/${brand.slug}`, label: `Make a ${brand.name} pattern from an image`} : {to: '/friendship-bracelet-pattern-maker', label: 'Make a friendship bracelet pattern'}
const noun = brand.unit === 'knot' ? 'floss' : 'bead'
// Tap colours to build "My colours", used by the makers.
const picking = ref(false)
const {owned, codes, toggle} = useInventory(computed(() => brand.id))
const regular = brand.beads.filter(b => !b.special)
const special = brand.beads.filter(b => b.special)

useSeo({
    title: `${brand.name} ${noun} colour chart with codes`,
    description: `All ${brand.beads.length} ${brand.line} colours with code, name and hex value. Mark the ones you own, then turn an image into a ${brand.name} pattern.`,
    path: `/colors/${id}`,
    image: `/og/chart-${id}.png`,
    jsonLd: [ldBreadcrumbs([{name: 'Colour charts', path: '/colors'}, {name: `${brand.name} ${noun} colour chart`}])],
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <p class="crumbs"><NuxtLink to="/colors">Colour charts</NuxtLink> / {{ brand.name }}</p>
      <h1>{{ brand.name }} {{ noun }} colour chart</h1>
      <p class="listing-intro">
        {{ brand.beads.length }} {{ brand.line }} colours. Screen colours are close, not exact: check the real thing before a big order.
      </p>
      <div class="chart-cta">
        <NuxtLink :to="maker.to" class="btn btn-primary"><Icon name="magic" />{{ maker.label }}</NuxtLink>
        <button class="btn" :aria-pressed="picking" @click="picking = !picking">
          <Icon :name="picking ? 'tick' : 'swatch'" />
          <ClientOnly>{{ picking ? `Done (${codes.length} picked)` : codes.length ? `My colours (${codes.length})` : 'Mark the colours I have' }}<template #fallback>Mark the colours I have</template></ClientOnly>
        </button>
      </div>
      <p v-if="picking" class="muted small chart-hint">Tap every colour you own. The pattern makers can then use only these.</p>

      <div class="chart">
        <component
          :is="picking ? 'button' : 'div'"
          v-for="b in regular" :key="b.code" class="chart-item"
          :aria-pressed="picking ? owned.has(b.code) : undefined"
          @click="picking && toggle(b.code)"
        >
          <span class="bead-dot" :style="{background: b.hex}" />
          <span class="chart-text" :title="`${b.code} ${b.name}`"><strong>{{ b.code }}</strong> {{ b.name }}<small>{{ b.hex }}</small></span>
          <Icon v-if="owned.has(b.code)" name="tick" class="chart-tick" />
        </component>
      </div>

      <template v-if="special.length">
        <h2 class="chart-sub">Clear, glitter, glow and neon</h2>
        <p class="listing-intro">These are left out of automatic matching unless you allow them.</p>
        <div class="chart">
          <component
            :is="picking ? 'button' : 'div'"
            v-for="b in special" :key="b.code" class="chart-item"
            :aria-pressed="picking ? owned.has(b.code) : undefined"
            @click="picking && toggle(b.code)"
          >
            <span class="bead-dot" :style="{background: b.hex}" />
            <span class="chart-text" :title="`${b.code} ${b.name}`"><strong>{{ b.code }}</strong> {{ b.name }}<small>{{ b.hex }}</small></span>
            <Icon v-if="owned.has(b.code)" name="tick" class="chart-tick" />
          </component>
        </div>
      </template>
    </div>
  </section>
</template>
