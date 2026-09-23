<script setup lang="ts">
// Save a pattern to the shared library as the signed-in user. The first save
// creates an art; later saves from the same bench update it. Sharing asks the
// backend to publish, which sends it to review for anyone but staff.
import type {Brand} from '~/helper/beads/brands'
import type {Craft} from '~/helper/beads/crafts'
import type {BeadGrid} from '~/helper/beads/pattern'
import {gridToArt} from '~/helper/beads/share'

const props = defineProps<{ grid: BeadGrid; brand: Brand; craft: Craft; title: string; saveKey?: string }>()
const open = defineModel<boolean>('open', {default: false})
const dlg = ref<HTMLDialogElement>()
const {user, request, signInUrl} = useAuth()
const route = useRoute()

const name = ref(props.title)
const desc = ref('')
const tags = ref('')
const share = ref(false)
const busy = ref(false)
const error = ref('')
const result = ref<{ id_string: string; status: string } | null>(null)

const KEY = computed(() => (props.saveKey ? `bap:saved:${props.saveKey}` : ''))
function savedRef(): { id: number; name?: string; desc?: string; tags?: string; share?: boolean } | null {
    try { return KEY.value ? JSON.parse(localStorage.getItem(KEY.value) || 'null') : null } catch { return null }
}

watch(open, v => {
    if (v) {
        // Saving again: keep what was typed last time.
        const prev = savedRef()
        name.value = prev?.name ?? props.title
        desc.value = prev?.desc ?? ''
        tags.value = prev?.tags ?? ''
        share.value = !!prev?.share
        result.value = null
        error.value = ''
        dlg.value?.showModal()
    } else dlg.value?.close()
})

async function save() {
    if (!name.value.trim()) { error.value = 'Give the pattern a name.'; return }
    busy.value = true
    error.value = ''
    const body = {
        ...gridToArt(props.grid, props.brand),
        name: name.value.trim().slice(0, 120),
        desc: desc.value.trim(),
        meta: {origin: 'easybeadpattern', bead: {craft: props.craft.id, palette: props.brand.id}},
    }
    const tagList = tags.value.split(',').map(t => t.trim()).filter(Boolean).slice(0, 8)
    try {
        let art: any = null
        const prev = savedRef()
        if (prev?.id) {
            art = await request(`/coloring/shared-pages/${prev.id}/`, {method: 'PATCH', body}).catch((e: any) => {
                if (e?.statusCode === 404 || e?.statusCode === 403) return null
                throw e
            })
        }
        if (!art) art = await request('/coloring/shared-pages/', {method: 'POST', body: {...body, is_template: true}})
        // Tags and visibility go through the update path.
        const patch: Record<string, unknown> = {}
        if (tagList.length) patch.tags = tagList
        if (share.value) patch.status = 'public'
        if (Object.keys(patch).length) art = await request(`/coloring/shared-pages/${art.id}/`, {method: 'PATCH', body: patch})
        if (KEY.value) {
            localStorage.setItem(KEY.value, JSON.stringify({
                id: art.id, id_string: art.id_string, name: name.value, desc: desc.value, tags: tags.value, share: share.value,
            }))
        }
        result.value = {id_string: art.id_string, status: art.status}
    } catch (e: any) {
        error.value = e?.statusCode === 401 ? 'Your session ended. Sign in again.' : 'Saving failed. Try again in a moment.'
    } finally {
        busy.value = false
    }
}

const statusText: Record<string, string> = {
    draft: 'Saved to your patterns. Only you can see it.',
    pending: 'Saved and sent for review. It appears in the library once approved.',
    public: 'Saved and published in the library.',
}
</script>

<template>
  <dialog ref="dlg" class="dialog dialog-narrow" aria-label="Save pattern" @close="open = false">
    <header class="dialog-head">
      <h2>Save pattern</h2>
      <button class="btn btn-small btn-icon" aria-label="Close" title="Close" @click="open = false"><Icon name="close" /></button>
    </header>

    <div v-if="!user" class="dialog-body">
      <p>Sign in to keep your patterns in your account, open them on any device and share them in the library.</p>
      <p class="muted small">Your work here is kept in this browser while you sign in.</p>
      <a :href="signInUrl(route.fullPath)" class="btn btn-primary"><Icon name="login" />Sign in with Google</a>
    </div>

    <div v-else-if="result" class="dialog-body">
      <p><Icon name="tick" class="ok-ic" /> {{ statusText[result.status] || 'Saved.' }}</p>
      <div class="dialog-actions">
        <NuxtLink to="/my-patterns" class="btn btn-primary" @click="open = false"><Icon name="user" />My patterns</NuxtLink>
        <button class="btn" @click="open = false">Keep editing</button>
      </div>
    </div>

    <form v-else class="dialog-body" @submit.prevent="save">
      <div class="field">
        <label for="sv-name">Name</label>
        <input id="sv-name" v-model="name" maxlength="120" required>
      </div>
      <div class="field">
        <label for="sv-desc">Description <output>optional</output></label>
        <textarea id="sv-desc" v-model="desc" rows="2" maxlength="500" />
      </div>
      <div class="field">
        <label for="sv-tags">Tags <output>comma separated</output></label>
        <input id="sv-tags" v-model="tags" placeholder="cat, cute, animal">
      </div>
      <label class="check"><input v-model="share" type="checkbox"> Share in the pattern library (reviewed before it appears)</label>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="dialog-actions">
        <button class="btn btn-primary" type="submit" :disabled="busy"><Icon name="save" />{{ busy ? 'Saving…' : 'Save' }}</button>
        <span class="muted small">Signed in as {{ user.username }}</span>
      </div>
    </form>
  </dialog>
</template>
