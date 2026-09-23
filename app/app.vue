<script setup lang="ts">
// Site-wide structured data: who publishes the site and what it is.
const site = useRuntimeConfig().public.siteUrl as string
useHead({
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify([
            {'@context': 'https://schema.org', '@type': 'WebSite', name: 'EasyBeadPattern', url: site},
            {'@context': 'https://schema.org', '@type': 'Organization', name: 'EasyBeadPattern', url: site, logo: `${site}/og/logo.png`},
        ]),
    }],
})
</script>

<template>
  <SiteHeader />
  <main>
    <NuxtPage />
  </main>
  <SiteFooter />
</template>
