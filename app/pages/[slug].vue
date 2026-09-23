<script setup lang="ts">
import {brandBySlug} from '~/helper/beads/brands'
import {CRAFTS, craftBySlug} from '~/helper/beads/crafts'

const route = useRoute()
const slug = String(route.params.slug)
// One route serves the fuse brand makers and the beadwork makers.
const brand = brandBySlug(slug)
const craft = brand ? null : craftBySlug(slug)
if (!brand && !craft) throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})

if (brand) {
    const description = `Turn any image into a ${brand.line} pattern matched to ${brand.beads.length} real ${brand.name} colours, with a bead count and a page for every pegboard. Free.`
    useSeo({
        title: `Free ${brand.name} bead pattern maker`,
        description,
        path: `/${brand.slug}`,
        image: `/og/brand-${brand.id}.png`,
        jsonLd: [
            ldTool(`${brand.name} bead pattern maker`, description, `/${brand.slug}`),
            ldFaq(CRAFTS.fuse.faq),
            ldBreadcrumbs([{name: 'Bead pattern maker', path: '/'}, {name: `${brand.name} bead pattern maker`}]),
        ],
    })
} else if (craft) {
    useSeo({
        title: craft.metaTitle,
        description: craft.metaDescription,
        path: `/${craft.slug}`,
        image: `/og/craft-${craft.id}.png`,
        jsonLd: [
            ldTool(craft.title, craft.metaDescription, `/${craft.slug}`),
            ldFaq(craft.faq),
            ldBreadcrumbs([{name: 'Beadwork', path: '/beadwork'}, {name: craft.title}]),
        ],
    })
}
</script>

<template>
  <div v-if="brand">
    <section class="hero">
      <div class="wrap">
        <h1>{{ brand.name }} bead pattern maker</h1>
        <p>{{ brand.blurb }} {{ brand.beads.length }} colours to match against. <NuxtLink :to="`/colors/${brand.id}`">See the {{ brand.name }} colour chart</NuxtLink>.</p>
      </div>
    </section>
    <div class="wrap">
      <PatternWorkbench :initial-brand="brand.id" storage-key="bap:maker" :title="`My ${brand.name} pattern`" />
    </div>
    <MakerSections />
  </div>
  <div v-else-if="craft">
    <section class="hero">
      <div class="wrap">
        <p class="crumbs"><NuxtLink to="/beadwork">Beadwork</NuxtLink> / {{ craft.name }}</p>
        <h1>{{ craft.title }}</h1>
        <p>{{ craft.intro }}</p>
      </div>
    </section>
    <div class="wrap">
      <PatternWorkbench :initial-craft="craft.id" :storage-key="`bap:${craft.id}`" :title="`My ${craft.name.toLowerCase()} pattern`" />
    </div>
    <CraftSections :craft="craft" />
  </div>
</template>
