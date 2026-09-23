<script setup lang="ts">
import {BOARD} from '~/helper/beads/brands'
import {CRAFTS, isCraftId, type CraftId} from '~/helper/beads/crafts'
import {gridFromMapNumbers, type SourceGrid} from '~/helper/beads/pattern'

const seoDesc = 'Draw your own fuse bead, kandi, loom or peyote pattern bead by bead on a blank board, with real bead colours, counts and a printable PDF. Free.'
useSeo({
    title: 'Bead pattern designer: draw your own',
    description: seoDesc,
    path: '/designer',
    image: '/og/designer.png',
    jsonLd: [ldTool('Bead pattern designer', seoDesc, '/designer'), ldFaq(CRAFTS.fuse.faq)],
})

const SIZES = [
    {label: '1 board', w: BOARD, h: BOARD},
    {label: '2 × 1', w: BOARD * 2, h: BOARD},
    {label: '2 × 2', w: BOARD * 2, h: BOARD * 2},
    {label: 'Cuff 30 × 9', w: 30, h: 9},
    {label: 'Bracelet 14 × 60', w: 14, h: 60},
]
const KEY = 'bap:designer:size'

const width = ref(BOARD)
const height = ref(BOARD)
const clamp = (n: number) => Math.max(2, Math.min(150, Math.round(n) || 2))

// ?art=<id_string> opens one of your saved patterns; Save then updates it.
const route = useRoute()
const {request} = useAuth()
const art = shallowRef<SourceGrid | null>(null)
const artName = ref('')
const artCraft = ref<CraftId>('fuse')
const loadError = ref('')
const benchKey = ref(0)

async function openArt(id: string) {
    try {
        const d = await request<any>(`/coloring/shared-pages/${id}/`)
        art.value = gridFromMapNumbers(d.width, d.height, d.colors || [], d.map_numbers || {})
        artName.value = d.name || 'My bead design'
        artCraft.value = isCraftId(d.meta?.bead?.craft) ? d.meta.bead.craft : 'fuse'
        localStorage.setItem('bap:saved:bap:designer', JSON.stringify({
            id: d.id, id_string: d.id_string, name: d.name, desc: d.desc || '',
            tags: (d.taxonomies || []).map((t: any) => t.name).join(', '), share: d.status !== 'draft',
        }))
        benchKey.value++
    } catch {
        loadError.value = 'That pattern could not be opened. It may be private to another account.'
    }
}

function newDrawing() {
    art.value = null
    try { localStorage.removeItem('bap:saved:bap:designer') } catch { /* blocked */ }
    benchKey.value++
}

onMounted(() => {
    if (route.query.art) openArt(String(route.query.art))
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || 'null')
        if (s?.w && s?.h) { width.value = clamp(s.w); height.value = clamp(s.h) }
    } catch { /* first visit */ }
})
watch([width, height], ([w, h]) => {
    if (art.value && (w !== art.value.width || h !== art.value.height)) newDrawing()
    try { localStorage.setItem(KEY, JSON.stringify({w, h})) } catch { /* private mode */ }
})

// A blank board: every cell empty. The workbench keeps what you draw as edits.
const source = computed<SourceGrid>(() => art.value ?? ({
    width: clamp(width.value),
    height: clamp(height.value),
    cells: new Array(clamp(width.value) * clamp(height.value)).fill(null),
}))
watch(art, a => { if (a) { width.value = a.width; height.value = a.height } })
</script>

<template>
  <div>
    <section class="hero">
      <div class="wrap">
        <h1>Bead pattern designer</h1>
        <p>Draw your own pattern bead by bead on a blank board. Pick a craft and a bead range, then use the brush, fill and eraser. Your drawing is kept in this browser.</p>
      </div>
    </section>
    <div class="wrap">
      <div class="designer-size">
        <div class="seg" role="group" aria-label="Board size">
          <button v-for="s in SIZES" :key="s.label" :aria-pressed="width === s.w && height === s.h" @click="width = s.w; height = s.h">{{ s.label }}</button>
        </div>
        <label class="size-input">W <input v-model.number="width" type="number" min="2" max="150" aria-label="Width in beads"></label>
        <label class="size-input">H <input v-model.number="height" type="number" min="2" max="150" aria-label="Height in beads"></label>
        <span class="muted small">Changing the size starts a new drawing.</span>
        <button v-if="art" class="btn btn-small" @click="newDrawing"><Icon name="add" />New drawing</button>
      </div>
      <p v-if="loadError" class="error">{{ loadError }}</p>
      <PatternWorkbench
        :key="benchKey"
        :source="source"
        craft-switch
        :initial-craft="art ? artCraft : undefined"
        :initial-tool="art ? 'select' : 'brush'"
        storage-key="bap:designer"
        :title="art ? artName : 'My bead design'"
      />
    </div>
    <MakerSections />
  </div>
</template>
