<script setup lang="ts">
const {user, signInUrl} = useAuth()
const route = useRoute()
const LINKS = [
    {to: '/', label: 'Fuse beads', icon: 'bead'},
    {to: '/designer', label: 'Designer', icon: 'edit'},
    {to: '/beadwork', label: 'Beadwork', icon: 'beadwork'},
    {to: '/bead-letters', label: 'Letters', icon: 'text'},
    {to: '/patterns', label: 'Patterns', icon: 'patterns'},
    {to: '/colors', label: 'Colours', icon: 'palette'},
]
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
