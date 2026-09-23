<script setup lang="ts">
useSeoMeta({title: 'Signing in', description: 'Signing in to EasyBeadPattern.', robots: 'noindex, nofollow'})

const route = useRoute()
const {token, refresh, loadUser} = useAuth()
const error = ref('')

onMounted(async () => {
    const access = String(route.query.access_token || '')
    const ref_ = String(route.query.refresh_token || '')
    if (route.query.auth_error || !access || !ref_) {
        error.value = route.query.auth_error === 'EMAIL_LINKED_TO_OTHER_AUTH'
            ? 'This email is already linked to another sign-in method.'
            : 'Sign in did not finish. Try again.'
        return
    }
    token.value = access
    refresh.value = ref_
    await loadUser()
    const next = String(route.query.next || '/')
    // Only same-site paths: never bounce the tokens anywhere else.
    await navigateTo(next.startsWith('/') && !next.startsWith('//') ? next : '/', {replace: true})
})
</script>

<template>
  <section class="section section-first">
    <div class="wrap narrow-center">
      <h1>{{ error ? 'Sign in failed' : 'Signing you in' }}</h1>
      <p class="muted">{{ error || 'One moment.' }}</p>
      <NuxtLink v-if="error" to="/" class="btn stack-top">Back to the maker</NuxtLink>
    </div>
  </section>
</template>
