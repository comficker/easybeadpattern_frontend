<script setup lang="ts">
import {LOCALES, isLocale} from '~/helper/i18n/locales'
import {PAGES, localePath} from '~/helper/i18n/pages'
const {user, signInUrl} = useAuth()
const route = useRoute()
const EN = [
    {to: '/', label: 'Fuse beads', icon: 'bead'},
    {to: '/designer', label: 'Designer', icon: 'edit'},
    {to: '/beadwork', label: 'Beadwork', icon: 'beadwork'},
    {to: '/bead-letters', label: 'Letters', icon: 'text'},
    {to: '/patterns', label: 'Patterns', icon: 'patterns'},
    {to: '/colors', label: 'Colours', icon: 'palette'},
]
// On a translated page the nav is in that language, and the two entries that
// have a translated page point at it. The rest still lead to the English tools.
const localeOf = computed(() => {
    const seg = route.path.split('/')[1]
    return isLocale(seg) ? seg : null
})
const LINKS = computed(() => {
    const l = localeOf.value
    if (!l) return EN
    const ui = LOCALES[l].ui
    const pages = PAGES[l]
    const home = pages[0]!
    const gallery = pages.find(p => p.kind === 'gallery') ?? home
    return [
        {to: localePath(l, home), label: ui.nav.home, icon: 'bead'},
        {to: '/designer', label: ui.nav.designer, icon: 'edit'},
        {to: '/beadwork', label: ui.nav.beadwork, icon: 'beadwork'},
        {to: '/bead-letters', label: ui.nav.letters, icon: 'text'},
        {to: localePath(l, gallery), label: ui.nav.patterns, icon: 'patterns'},
        {to: '/colors', label: ui.nav.colors, icon: 'palette'},
    ]
})
</script>

<template>
  <header class="site-header">
    <div class="wrap">
      <NuxtLink to="/" class="logo" aria-label="EasyBeadPattern home">
        <span class="logo-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>EasyBeadPattern</span>
      </NuxtLink>
      <nav class="nav" aria-label="Main">
        <NuxtLink v-for="l in LINKS" :key="l.to" :to="l.to" :title="l.label" :aria-label="l.label"><Icon :name="l.icon" /><span>{{ l.label }}</span></NuxtLink>
      </nav>
      <ClientOnly>
        <NuxtLink v-if="user" to="/my-patterns" class="account" :title="`My patterns (${user.username})`" aria-label="My patterns"><Icon name="user" /></NuxtLink>
        <a v-else :href="signInUrl(route.fullPath)" class="account" title="Sign in" aria-label="Sign in"><Icon name="login" /></a>
      </ClientOnly>
    </div>
  </header>
</template>
