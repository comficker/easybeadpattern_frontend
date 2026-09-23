<script setup lang="ts">
import {BOARD, getBrand, isPaletteId, type Brand, type PaletteId} from '~/helper/beads/brands'
import {CRAFTS, CRAFT_IDS, cellAspect, isCraftId, type CraftId} from '~/helper/beads/crafts'
import type {Tool, ViewMode} from '~/helper/beads/draw'
import {sizeLine} from '~/helper/beads/info'
import {applyEdits, applySwaps, countBeads, matchToBeads, type Edits, type SourceGrid} from '~/helper/beads/pattern'

const props = defineProps<{
    // A ready grid (a pattern from the library). Without it the bench is an
    // image converter.
    source?: SourceGrid | null
    initialBrand?: PaletteId
    initialCraft?: CraftId
    // Show the craft picker (library patterns and letters can be made in any craft).
    craftSwitch?: boolean
    title?: string
    // localStorage key for the converter's autosave.
    storageKey?: string
    initialTool?: Tool
}>()
const emit = defineEmits<{ palette: [brand: Brand] }>()

const isImage = computed(() => !props.source)
const craftId = ref<CraftId>(props.initialCraft ?? 'fuse')
const craft = computed(() => CRAFTS[craftId.value])
const aspect = computed(() => cellAspect(craft.value))
const brandId = ref<PaletteId>(props.initialBrand ?? craft.value.palettes[0]!)
const brand = computed(() => getBrand(brandId.value))
watch(brand, b => emit('palette', b), {immediate: true})

const settings = reactive({
    width: craft.value.defaultWidth,
    maxColors: craft.value.defaultColors,
    dither: false,
    removeBg: false,
    special: false,
    // Match only to the colours in "My colours".
    mine: false,
    brightness: 0,
    contrast: 0,
    saturation: 0,
})
const mode = ref<ViewMode>('beads')
const focus = ref<number | null>(null)
const hover = ref<{ x: number; y: number; bead: number } | null>(null)
// Colour swaps, bead index → bead index (-1 = no bead). Indices belong to one
// brand, so a brand change clears them.
const swaps = ref<Record<number, number>>({})

// Brush and eraser. Edits are colours per cell (see applyEdits), with an
// undo stack of whole snapshots: patterns are small, so a copy per stroke is cheap.
const tool = ref<Tool>(props.initialTool ?? 'select')
const brushHex = ref<string | null>(null)
const edits = shallowRef<Edits>({})
const past = shallowRef<Edits[]>([])
const future = shallowRef<Edits[]>([])
const paletteOpen = ref(false)
const TOOLS: { id: Tool; icon: string; label: string; title: string }[] = [
    {id: 'select', icon: 'select', label: 'Select', title: 'Select a colour (V)'},
    {id: 'brush', icon: 'brush', label: 'Brush', title: 'Brush (B). Alt-click picks a colour.'},
    {id: 'eraser', icon: 'eraser', label: 'Eraser', title: 'Eraser (E)'},
    {id: 'fill', icon: 'fill', label: 'Fill', title: 'Fill a connected area (F)'},
]
const zoom = ref(1)
const building = ref(false)
const saving = ref(false)
const canvasRef = ref<{ zoomTo: (z: number) => void }>()
const zoomBy = (k: number) => canvasRef.value?.zoomTo(k === 0 ? 1 : zoom.value * k)

// --- image source -----------------------------------------------------------
const dataUrl = ref<string | null>(null)
const img = shallowRef<HTMLImageElement | null>(null)
const imageSource = shallowRef<SourceGrid | null>(null)
const error = ref('')
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

async function useFile(file: File | undefined | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
        error.value = 'That file is not an image. Use a JPG, PNG or WebP.'
        return
    }
    error.value = ''
    const {fileToDataUrl} = await import('~/helper/beads/source')
    try {
        await setImage(await fileToDataUrl(file))
    } catch {
        error.value = 'This image could not be read. Try another file.'
    }
}

async function setImage(url: string) {
    const {loadImage} = await import('~/helper/beads/source')
    img.value = await loadImage(url)
    dataUrl.value = url
    swaps.value = {}
    focus.value = null
    resetEdits()
}

function onDrop(e: DragEvent) {
    dragOver.value = false
    useFile(e.dataTransfer?.files?.[0])
}

function onPaste(e: ClipboardEvent) {
    if (!isImage.value) return
    const item = [...(e.clipboardData?.items ?? [])].find(i => i.type.startsWith('image/'))
    if (item) useFile(item.getAsFile())
}

let timer: ReturnType<typeof setTimeout> | undefined
watch(
    () => [img.value, settings.width, settings.removeBg, settings.brightness, settings.contrast, settings.saturation, aspect.value, craft.value.layout],
    () => {
        clearTimeout(timer)
        timer = setTimeout(async () => {
            if (!img.value) { imageSource.value = null; return }
            const {imageToSource} = await import('~/helper/beads/source')
            imageSource.value = imageToSource(img.value, {...settings, aspect: aspect.value, layout: craft.value.layout})
        }, 60)
    },
)

// --- pattern ----------------------------------------------------------------
const src = computed(() => props.source ?? imageSource.value)
// Distinct colours in a ready grid; 0 for a blank designer board.
const sourceColors = computed(() => {
    if (!props.source) return 60
    const s = new Set<string>()
    for (const c of props.source.cells) if (c) s.add(c.join(','))
    return Math.min(60, s.size)
})
watch(sourceColors, n => { if (props.source) settings.maxColors = Math.max(2, n) }, {immediate: true})

const inventoryOpen = ref(false)
const {owned: myColours} = useInventory(brandId)
const matched = computed(() => src.value && matchToBeads(src.value, brand.value, {
    maxColors: settings.maxColors,
    dither: isImage.value && settings.dither,
    includeSpecial: settings.special,
    only: settings.mine ? myColours.value : null,
}))
const grid = computed(() => matched.value && applyEdits(applySwaps(matched.value, swaps.value), edits.value, brand.value))
const counts = computed(() => (grid.value ? countBeads(grid.value) : []))

watch(brandId, () => { swaps.value = {}; focus.value = null })

// A craft brings its own palettes and sizes.
watch(craftId, c => {
    const cr = CRAFTS[c]
    if (!cr.palettes.includes(brandId.value)) brandId.value = cr.palettes[0]!
    if (isImage.value) {
        settings.width = cr.defaultWidth
        settings.maxColors = cr.defaultColors
    }
})

function swap(from: number, to: number) {
    const next: Record<number, number> = {}
    for (const [k, v] of Object.entries(swaps.value)) next[+k] = v === from ? to : v
    if (!(from in next)) next[from] = to
    swaps.value = next
    // Painted beads of that colour follow the swap too.
    const fromHex = brand.value.beads[from]!.hex
    const toHex = to >= 0 ? brand.value.beads[to]!.hex : null
    if (Object.values(edits.value).includes(fromHex)) {
        const e: Edits = {}
        for (const [k, v] of Object.entries(edits.value)) e[+k] = v === fromHex ? toHex : v
        edits.value = e
    }
}

// --- brush & eraser -----------------------------------------------------------
function resetEdits() {
    edits.value = {}
    past.value = []
    future.value = []
}

// A different grid size means the cell indices no longer line up.
watch(() => src.value && `${src.value.width}x${src.value.height}`, (now, before) => {
    if (before && now !== before) resetEdits()
})

// Picking a colour in the list also loads it on the brush.
watch(focus, i => { if (i != null && i >= 0) brushHex.value = brand.value.beads[i]!.hex })

// The most used bead, or on a blank board the darkest regular one.
function defaultBrush(): string {
    if (counts.value[0]) return brand.value.beads[counts.value[0].index]!.hex
    const regular = brand.value.beads.filter(b => !b.special)
    return regular.reduce((a, b) => (b.lab[0] < a.lab[0] ? b : a), regular[0]!).hex
}

function useTool(t: Tool) {
    tool.value = t
    if ((t === 'brush' || t === 'fill') && !brushHex.value) brushHex.value = defaultBrush()
    paletteOpen.value = false
}

function strokeStart() {
    past.value = [...past.value.slice(-49), edits.value]
    future.value = []
}

function paint(cells: number[]) {
    if (tool.value !== 'eraser' && !brushHex.value) brushHex.value = defaultBrush()
    const value = tool.value === 'eraser' ? null : brushHex.value
    if (tool.value !== 'eraser' && !value) return
    const e = {...edits.value}
    let changed = false
    for (const i of cells) {
        if (e[i] === value && i in e) continue
        e[i] = value
        changed = true
    }
    if (changed) edits.value = e
}

function undo() {
    if (!past.value.length) return
    future.value = [edits.value, ...future.value]
    edits.value = past.value.at(-1)!
    past.value = past.value.slice(0, -1)
}

function redo() {
    if (!future.value.length) return
    past.value = [...past.value, edits.value]
    edits.value = future.value[0]!
    future.value = future.value.slice(1)
}

function pickBrush(i: number) {
    brushHex.value = brand.value.beads[i]!.hex
    if (tool.value !== 'fill') tool.value = 'brush'
    paletteOpen.value = false
}

const brushBead = computed(() => {
    const hex = brushHex.value
    return hex ? brand.value.beads.find(b => b.hex === hex) ?? null : null
})

function onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null
    if (!grid.value || t?.closest('input, select, textarea, [contenteditable]')) return
    const mod = e.metaKey || e.ctrlKey
    if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return }
    if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return }
    if (mod || e.altKey) return
    const k = e.key.toLowerCase()
    if (k === 'b') useTool('brush')
    else if (k === 'e') useTool('eraser')
    else if (k === 'f') useTool('fill')
    else if (k === '+' || k === '=') zoomBy(1.5)
    else if (k === '-') zoomBy(1 / 1.5)
    else if (k === '0') zoomBy(0)
    else if (k === 'v' || k === 'escape') useTool('select')
}

const unit = computed(() => brand.value.unit)
const hoverLabel = computed(() => {
    const h = hover.value, g = grid.value
    if (!h || !g || h.x >= g.width || h.y >= g.height) return ''
    const where = `Row ${h.y + 1}, column ${h.x + 1}`
    // Read the cell from the current grid: the hovered index may belong to the
    // brand (or edit) from before the last change.
    const b = brand.value.beads[g.cells[h.y * g.width + h.x]!]
    return b ? `${where}: ${b.code} ${b.name}` : `${where}: empty`
})

const sizeLabel = computed(() => (grid.value ? sizeLine(grid.value, brand.value, craft.value) : ''))


// --- export -----------------------------------------------------------------
const site = useRuntimeConfig().public.siteUrl.replace(/^https?:\/\//, '')
const busy = ref(false)
const fileBase = computed(() => `${(props.title || 'bead-pattern').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${craftId.value === 'fuse' ? '' : `${craftId.value}-`}${brandId.value}`)

function save(blob: Blob, name: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

async function downloadPdf() {
    if (!grid.value) return
    busy.value = true
    try {
        const {patternPdf} = await import('~/helper/beads/pdf')
        save(patternPdf(grid.value, brand.value, craft.value, props.title || 'Bead pattern', site), `${fileBase.value}.pdf`)
    } finally {
        busy.value = false
    }
}

// PNG: a pattern sheet (title, board, colour list); "No board": the beads
// alone on a transparent background, for mock-ups and editing elsewhere.
async function downloadPng(transparent: boolean) {
    if (!grid.value) return
    const c = craft.value
    let blob: Blob
    if (transparent) {
        const {patternPng} = await import('~/helper/beads/draw')
        blob = await patternPng(grid.value, {
            beads: brand.value.beads, mode: mode.value, shape: c.shape, layout: c.layout,
            aspect: aspect.value, boards: c.boards, transparent,
        })
    } else {
        const {patternSheet} = await import('~/helper/beads/sheet')
        blob = await patternSheet(grid.value, brand.value, c, props.title || 'Bead pattern', site, mode.value)
    }
    save(blob, `${fileBase.value}${transparent ? '-beads' : ''}.png`)
}

// --- autosave (converter only) -----------------------------------------------
// Converter: image, settings and edits. Ready grids (designer, letters): the
// edits, kept only while the grid keeps its size.
function persist() {
    if (!props.storageKey) return
    try {
        localStorage.setItem(props.storageKey, JSON.stringify({
            craft: craftId.value, brand: brandId.value, settings, mode: mode.value,
            image: isImage.value ? dataUrl.value : null, edits: edits.value,
            size: src.value ? `${src.value.width}x${src.value.height}` : null,
        }))
    } catch { /* storage full or blocked: the converter still works */ }
}
watch([craftId, brandId, mode, dataUrl, edits, () => ({...settings})], persist, {deep: true})

onMounted(async () => {
    window.addEventListener('paste', onPaste)
    window.addEventListener('keydown', onKey)
    if (!props.storageKey) return
    try {
        const saved = JSON.parse(localStorage.getItem(props.storageKey) || 'null')
        if (!saved) return
        if (props.craftSwitch && isCraftId(saved.craft)) craftId.value = saved.craft
        await nextTick()
        if (!props.initialBrand && isPaletteId(saved.brand) && craft.value.palettes.includes(saved.brand)) brandId.value = saved.brand
        if (isImage.value) Object.assign(settings, saved.settings || {})
        if (saved.mode) mode.value = saved.mode
        const okEdits = saved.edits && typeof saved.edits === 'object'
        if (!isImage.value && okEdits && src.value && saved.size === `${src.value.width}x${src.value.height}`) edits.value = saved.edits
        if (isImage.value && saved.image) {
            await setImage(saved.image)
            if (okEdits) edits.value = saved.edits
        }
    } catch { /* ignore a broken save */ }
})
onBeforeUnmount(() => {
    window.removeEventListener('paste', onPaste)
    window.removeEventListener('keydown', onKey)
})

defineExpose({setImage})
</script>

<template>
  <div class="bench">
    <!-- Settings -->
    <div class="bench-side">
      <!-- Page-specific inputs (bead letters) sit above the shared settings. -->
      <slot name="controls" :brand="brand" :craft="craft" />
      <div v-if="craftSwitch" class="field">
        <label for="bk">Make it as</label>
        <select id="bk" v-model="craftId">
          <option v-for="id in CRAFT_IDS" :key="id" :value="id">{{ CRAFTS[id].name }}</option>
        </select>
      </div>
      <div class="field">
        <label for="bb">{{ unit === 'knot' ? 'Floss' : 'Beads' }}</label>
        <select id="bb" v-model="brandId" :disabled="craft.palettes.length < 2">
          <option v-for="id in craft.palettes" :key="id" :value="id">{{ getBrand(id).line }} ({{ getBrand(id).beads.length }})</option>
        </select>
      </div>

      <template v-if="isImage">
        <div class="field">
          <label for="bw">Width <output>{{ settings.width }} {{ unit }}s</output></label>
          <div class="seg" role="group" aria-label="Width">
            <button v-for="s in craft.widths" :key="s.w" :aria-pressed="settings.width === s.w" @click="settings.width = s.w">{{ s.label }}</button>
          </div>
          <input id="bw" v-model.number="settings.width" type="range" min="4" :max="craft.maxWidth" step="1">
        </div>
      </template>

      <div v-if="isImage || sourceColors > 2" class="field">
        <label for="bc">Colours <output>up to {{ settings.maxColors }}</output></label>
        <input id="bc" v-model.number="settings.maxColors" type="range" min="2" :max="isImage ? 60 : sourceColors" step="1">
      </div>

      <label v-if="isImage" class="check"><input v-model="settings.dither" type="checkbox"> Blend colours (dithering)</label>
      <label v-if="isImage" class="check"><input v-model="settings.removeBg" type="checkbox"> Remove background</label>

      <details v-if="isImage || sourceColors > 0" class="more">
        <summary><Icon name="options" />More options<Icon name="arrow-down" class="chev" /></summary>
        <label class="check"><input v-model="settings.special" type="checkbox"> Allow clear, glitter and neon beads</label>
        <label class="check"><input v-model="settings.mine" type="checkbox" :disabled="!myColours.size"> Only colours I have ({{ myColours.size }})</label>
        <button class="btn btn-small" @click="inventoryOpen = true"><Icon name="swatch" />{{ myColours.size ? 'Edit my colours' : 'Pick my colours' }}</button>
        <template v-if="isImage">
        <div class="field">
          <label for="ab">Brightness <output>{{ settings.brightness }}</output></label>
          <input id="ab" v-model.number="settings.brightness" type="range" min="-100" max="100">
        </div>
        <div class="field">
          <label for="ac">Contrast <output>{{ settings.contrast }}</output></label>
          <input id="ac" v-model.number="settings.contrast" type="range" min="-100" max="100">
        </div>
        <div class="field">
          <label for="as">Saturation <output>{{ settings.saturation }}</output></label>
          <input id="as" v-model.number="settings.saturation" type="range" min="-100" max="100">
        </div>
        <button class="btn btn-small" @click="Object.assign(settings, {brightness: 0, contrast: 0, saturation: 0})"><Icon name="refresh" />Reset image</button>
        </template>
      </details>
    </div>

    <!-- Pegboard -->
    <div class="bench-stage">
      <div v-if="grid" class="stage-tools" role="toolbar" aria-label="Edit tools">
        <div class="seg icons" role="group" aria-label="Tool">
          <button v-for="t in TOOLS" :key="t.id" :aria-pressed="tool === t.id" :title="t.title" :aria-label="t.label" @click="useTool(t.id)">
            <Icon :name="t.icon" />
          </button>
        </div>
        <button
          class="brush-color"
          :aria-expanded="paletteOpen"
          :title="brushBead ? `Brush colour: ${brushBead.code} ${brushBead.name}` : 'Choose a brush colour'"
          @click="paletteOpen = !paletteOpen"
        >
          <span class="bead-dot" :style="{background: brushHex || 'transparent'}" />
          <span class="brush-name">{{ brushBead ? brushBead.code : 'Colour' }}</span>
        </button>
        <span class="spacer" />
        <button class="btn btn-small btn-icon" :disabled="!past.length" title="Undo (Ctrl+Z)" aria-label="Undo" @click="undo"><Icon name="undo" /></button>
        <button class="btn btn-small btn-icon" :disabled="!future.length" title="Redo (Ctrl+Shift+Z)" aria-label="Redo" @click="redo"><Icon name="redo" /></button>
        <div v-if="paletteOpen" class="brush-palette">
          <div class="swatches">
            <button
              v-for="(b, i) in brand.beads"
              :key="b.code"
              :style="{background: b.hex}"
              :title="`${b.code} ${b.name}`"
              :aria-label="`Paint with ${b.code} ${b.name}`"
              :aria-pressed="b.hex === brushHex"
              @click="pickBrush(i)"
            />
          </div>
        </div>
      </div>
      <div class="stage-canvas">
        <ClientOnly>
          <BeadCanvas
            v-if="grid"
            ref="canvasRef"
            v-model:zoom="zoom"
            :grid="grid"
            :beads="brand.beads"
            :mode="mode"
            :focus="tool === 'select' ? focus : null"
            :tool="tool"
            :shape="craft.shape"
            :layout="craft.layout"
            :aspect="aspect"
            :boards="craft.boards"
            @hover="hover = $event"
            @pick="b => { if (b >= 0) focus = focus === b ? null : b }"
            @sample="pickBrush"
            @stroke-start="strokeStart"
            @paint="paint"
          />
          <div
            v-else-if="isImage"
            class="drop"
            :class="{over: dragOver}"
            role="button"
            tabindex="0"
            @click="fileInput?.click()"
            @keydown.enter="fileInput?.click()"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="onDrop"
          >
            <div class="drop-card">
              <Icon name="upload" />
              <h2 class="panel-title">Drop an image here</h2>
              <p>Or click to choose one, or paste from the clipboard. JPG, PNG or WebP. Your image stays in your browser.</p>
              <span class="btn btn-primary"><Icon name="image" />Choose image</span>
              <p v-if="error" role="alert" class="error">{{ error }}</p>
            </div>
          </div>
        </ClientOnly>
        <input ref="fileInput" class="visually-hidden" type="file" accept="image/*" aria-label="Choose an image" tabindex="-1" @change="useFile(($event.target as HTMLInputElement).files?.[0])">
      </div>
      <div class="stage-bar">
        <template v-if="grid">
          <span class="stage-info" :title="sizeLabel">{{ hoverLabel || sizeLabel }}</span>
          <div class="zoom" role="group" aria-label="Zoom">
            <button class="btn btn-small btn-icon" :disabled="zoom <= 1" title="Zoom out (−)" aria-label="Zoom out" @click="zoomBy(1 / 1.5)"><Icon name="zoom-out" /></button>
            <output>{{ Math.round(zoom * 100) }}%</output>
            <button class="btn btn-small btn-icon" :disabled="zoom >= 8" title="Zoom in (+)" aria-label="Zoom in" @click="zoomBy(1.5)"><Icon name="zoom-in" /></button>
            <button class="btn btn-small btn-icon" :disabled="zoom <= 1" title="Fit to view (0)" aria-label="Fit to view" @click="zoomBy(0)"><Icon name="fit" /></button>
          </div>
          <span class="tool-sep" />
          <div class="seg icons" role="group" aria-label="View">
            <button :aria-pressed="mode === 'beads'" title="Show beads" aria-label="Show beads" @click="mode = 'beads'"><Icon name="bead" /></button>
            <button :aria-pressed="mode === 'flat'" title="Show flat colours" aria-label="Show flat colours" @click="mode = 'flat'"><Icon name="flat" /></button>
          </div>
          <button v-if="isImage" class="btn btn-small btn-icon" title="Use another image" aria-label="Use another image" @click="fileInput?.click()"><Icon name="upload" /></button>
        </template>
        <span v-else-if="craft.boards">Patterns are split into {{ BOARD }} × {{ BOARD }} pegboards.</span>
        <span v-else>{{ craft.name }}: the chart and a row-by-row list come in the PDF.</span>
      </div>
    </div>

    <!-- Bead list + export -->
    <div class="bench-side list-side">
      <BeadList v-model:focus="focus" :counts="counts" :beads="brand.beads" :brand-name="brand.name" :unit="unit" @swap="swap" />
      <div class="export">
        <button class="btn btn-primary" :disabled="!grid || busy" @click="downloadPdf"><Icon name="pdf" />Download PDF pattern</button>
        <button class="btn btn-small" :disabled="!grid" title="Save to your account" @click="saving = true"><Icon name="save" />Save</button>
        <button class="btn btn-small" :disabled="!grid" title="Track beads as you place them" @click="building = true"><Icon name="play" />Build</button>
        <button class="btn btn-small" :disabled="!grid" title="Pattern sheet with the colour list" @click="downloadPng(false)"><Icon name="image" />PNG</button>
        <button class="btn btn-small" :disabled="!grid" title="Beads only, transparent background" @click="downloadPng(true)"><Icon name="image-clear" />No board</button>
      </div>
    </div>
    <ClientOnly>
      <InventoryDialog v-model:open="inventoryOpen" :palette="brandId" />
      <SaveDialog v-if="grid" v-model:open="saving" :grid="grid" :brand="brand" :craft="craft" :title="title || 'My bead pattern'" :save-key="storageKey" />
    </ClientOnly>
    <BuildMode v-if="building && grid" :grid="grid" :brand="brand" :craft="craft" :title="title || 'Bead pattern'" @close="building = false" />
  </div>
</template>
