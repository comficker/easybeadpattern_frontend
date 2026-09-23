<script setup lang="ts">
import type {ArtRow} from '~/composables/useApi'

useSeoMeta({title: 'My patterns', description: 'Your saved bead patterns.', robots: 'noindex, nofollow'})

const {user, request, signInUrl, signOut} = useAuth()
const route = useRoute()
type Mine = ArtRow & { status: string }
const items = ref<Mine[] | null>(null)
const error = ref('')

async function load() {
    if (!user.value) return
    error.value = ''
    try {
        const page = await request<{ results: Mine[] }>('/coloring/shared-pages/', {
            query: {user: user.value.username, status: 'draft,pending,public', is_tile: false, page_size: 100},
        })
        items.value = page.results
    } catch {
        error.value = 'Your patterns could not be loaded. Try again in a moment.'
    }
}

async function remove(a: Mine) {
    if (!confirm(`Delete "${a.name}"? This cannot be undone.`)) return
    await request(`/coloring/shared-pages/${a.id}/`, {method: 'DELETE'}).catch(() => { error.value = 'Delete failed.' })
    items.value = (items.value || []).filter(i => i.id !== a.id)
}

function out() {
    signOut()
    navigateTo('/')
}

const STATUS: Record<string, string> = {draft: 'Private', pending: 'In review', public: 'In the library'}
onMounted(load)
watch(user, load)
</script>

<template>
  <section class="section section-first">
    <div class="wrap">
      <ClientOnly>
        <template v-if="user">
          <div class="page-head">
            <div>
              <h1>My patterns</h1>
              <p class="listing-intro">Signed in as {{ user.username }}. Patterns you save here also show up in your SimplePixelArt account.</p>
            </div>
            <button class="btn btn-small" @click="out"><Icon name="close" />Sign out</button>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <p v-else-if="!items" class="muted">Loading…</p>
          <div v-else-if="items.length" class="pgrid">
            <div v-for="a in items" :key="a.id" class="pcard">
              <NuxtLink :to="`/designer?art=${a.id_string}`" class="pcard-img"><img :src="artThumb(a)" :alt="a.name" loading="lazy" width="160" height="160"></NuxtLink>
              <div>
                <h2 class="pcard-title">{{ a.name || 'Untitled' }}</h2>
                <p>{{ a.width }} × {{ a.height }}, <span class="status" :data-status="a.status">{{ STATUS[a.status] || a.status }}</span></p>
              </div>
              <div class="card-actions">
                <NuxtLink :to="`/designer?art=${a.id_string}`" class="btn btn-small"><Icon name="edit" />Edit</NuxtLink>
                <button class="btn btn-small btn-icon" :aria-label="`Delete ${a.name}`" title="Delete" @click="remove(a)"><Icon name="trash" /></button>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <p>No patterns yet. Make one from an image or draw one, then press Save.</p>
            <div class="dialog-actions">
              <NuxtLink to="/" class="btn btn-primary"><Icon name="upload" />From an image</NuxtLink>
              <NuxtLink to="/designer" class="btn"><Icon name="edit" />Draw one</NuxtLink>
            </div>
          </div>
        </template>
        <div v-else class="narrow-center">
          <h1>My patterns</h1>
          <p class="muted">Sign in to save patterns to your account and open them on any device.</p>
          <a :href="signInUrl(route.fullPath)" class="btn btn-primary"><Icon name="login" />Sign in with Google</a>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>
