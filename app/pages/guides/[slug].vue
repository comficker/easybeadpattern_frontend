<script setup lang="ts">
import {GUIDES, guideBySlug} from '~/helper/guides'

const route = useRoute()
const guide = guideBySlug(String(route.params.slug))
if (!guide) throw createError({statusCode: 404, statusMessage: 'Guide not found', fatal: true})
const others = GUIDES.filter(g => g.slug !== guide.slug)
const site = useRuntimeConfig().public.siteUrl as string

const image = `/og/guide-${guide.slug}.png`
useSeo({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    image,
    type: 'article',
    jsonLd: [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            image: site + image,
            mainEntityOfPage: `${site}/guides/${guide.slug}`,
            author: {'@type': 'Organization', name: 'EasyBeadPattern', url: site},
            publisher: {'@type': 'Organization', name: 'EasyBeadPattern', logo: {'@type': 'ImageObject', url: `${site}/og/logo.png`}},
        },
        ldBreadcrumbs([{name: 'Guides', path: '/guides'}, {name: guide.title}]),
    ],
})
</script>

<template>
  <article v-if="guide" class="section section-first">
    <div class="wrap">
      <p class="crumbs"><NuxtLink to="/guides">Guides</NuxtLink> / {{ guide.title }}</p>
      <div class="prose guide">
        <h1>{{ guide.title }}</h1>
        <p class="lead">{{ guide.description }}</p>
        <section v-for="s in guide.sections" :key="s.heading">
          <h2>{{ s.heading }}</h2>
          <p v-for="(p, i) in s.paragraphs" :key="i">{{ p }}</p>
          <ul v-if="s.list"><li v-for="(l, i) in s.list" :key="i">{{ l }}</li></ul>
        </section>
        <p><NuxtLink :to="guide.cta.to" class="btn btn-primary"><Icon :name="guide.icon" />{{ guide.cta.label }}</NuxtLink></p>
      </div>
      <div class="related">
        <h2>More guides</h2>
        <nav class="tags" aria-label="More guides">
          <NuxtLink v-for="g in others" :key="g.slug" :to="`/guides/${g.slug}`" class="tag"><Icon :name="g.icon" />{{ g.title }}</NuxtLink>
        </nav>
      </div>
    </div>
  </article>
</template>
