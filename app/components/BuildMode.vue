<script setup lang="ts">
// Full-screen helper for building a pattern: tap beads as you place them,
// work one board (fuse beads) or one row (beadwork) at a time. Progress stays
// in this browser, keyed by the pattern.
import {BOARD, type Brand} from '~/helper/beads/brands'
import {cellAspect, type Craft} from '~/helper/beads/crafts'
import {boardLabel, boardsOf, countBeads, wordChart, type BeadGrid} from '~/helper/beads/pattern'
import {decodeDone, encodeDone, patternKey} from '~/helper/beads/progress'

const props = defineProps<{ grid: BeadGrid; brand: Brand; craft: Craft; title: string }>()
const emit = defineEmits<{ close: [] }>()

const key = computed(() => patternKey(props.grid, props.brand.id, props.craft.id))
const n = computed(() => props.grid.width * props.grid.height)
const done = shallowRef<Uint8Array>(new Uint8Array(n.value))

function load() {
    try {
        const saved = localStorage.getItem(key.value)
        done.value = saved ? decodeDone(saved, n.value) : new Uint8Array(n.value)
    } catch { done.value = new Uint8Array(n.value) }
}
function save() {
    try { localStorage.setItem(key.value, encodeDone(done.value)) } catch { /* storage blocked */ }
}
function setDone(cells: number[], value: boolean) {
    const d = done.value.slice()
    for (const i of cells) if (props.grid.cells[i]! >= 0) d[i] = value ? 1 : 0
    done.value = d
    save()
}

// --- sections: boards for fuse beads, rows for everything else ---------------
const boards = computed(() => boardsOf(props.grid.width, props.grid.height))
const rows = computed(() => (props.craft.rowOrder ? wordChart(props.grid, props.craft.rowOrder) : []))
const byRow = computed(() => !props.craft.boards && rows.value.length > 0)
const section = ref(0)
const sectionCount = computed(() => (byRow.value ? rows.value.length : boards.value.cols * boards.value.rows))

// Cells of the current section (global indices).
const sectionCells = computed<number[]>(() => {
    if (byRow.value) return rows.value[section.value]?.cells ?? []
    if (!props.craft.boards) return [...Array(n.value).keys()]
    const c = section.value % boards.value.cols, r = Math.floor(section.value / boards.value.cols)
    const out: number[] = []
    for (let y = r * BOARD; y < Math.min(props.grid.height, (r + 1) * BOARD); y++) {
        for (let x = c * BOARD; x < Math.min(props.grid.width, (c + 1) * BOARD); x++) out.push(y * props.grid.width + x)
    }
    return out
})

// Fuse beads: show only the current board, as a grid of its own.
const view = computed(() => {
    if (!props.craft.boards || boards.value.cols * boards.value.rows === 1) return {grid: props.grid, map: null as number[] | null}
    const c = section.value % boards.value.cols, r = Math.floor(section.value / boards.value.cols)
    const x0 = c * BOARD, y0 = r * BOARD
    const w = Math.min(BOARD, props.grid.width - x0), h = Math.min(BOARD, props.grid.height - y0)
    const cells = new Int16Array(w * h)
    const map: number[] = []
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const gi = (y0 + y) * props.grid.width + x0 + x
        cells[y * w + x] = props.grid.cells[gi]!
        map.push(gi)
    }
    return {grid: {width: w, height: h, cells}, map}
})
const viewDone = computed(() => {
    const m = view.value.map
    if (!m) return done.value
    return Uint8Array.from(m, gi => done.value[gi]!)
})
const outline = computed(() => {
    if (!byRow.value) return null
    const o = new Uint8Array(n.value)
    for (const i of sectionCells.value) o[i] = 1
    return o
})

// --- colours ------------------------------------------------------------------
const focus = ref<number | null>(null)
const sectionCounts = computed(() => {
    const left = new Map<number, number>()
    for (const i of sectionCells.value) {
        const b = props.grid.cells[i]!
        if (b >= 0 && !done.value[i]) left.set(b, (left.get(b) || 0) + 1)
    }
    return countBeads({width: 0, height: 0, cells: Int16Array.from(sectionCells.value.map(i => props.grid.cells[i]!))})
        .map(c => ({...c, left: left.get(c.index) || 0}))
})
const placed = computed(() => done.value.reduce((s, d) => s + d, 0))
const total = computed(() => props.grid.cells.reduce((s, b) => s + (b >= 0 ? 1 : 0), 0))
const sectionLeft = computed(() => sectionCells.value.filter(i => props.grid.cells[i]! >= 0 && !done.value[i]).length)

function toggle(_bead: number, viewIndex: number) {
    const gi = view.value.map ? view.value.map[viewIndex]! : viewIndex
    if (props.grid.cells[gi]! < 0) return
    setDone([gi], !done.value[gi])
}
function markColour(b: number, value: boolean) {
    setDone(sectionCells.value.filter(i => props.grid.cells[i] === b), value)
}
function markSection(value: boolean) {
    setDone(sectionCells.value, value)
    if (value && section.value < sectionCount.value - 1) section.value++
}
function reset() {
    if (confirm('Clear all progress on this pattern?')) setDone([...Array(n.value).keys()], false)
}

const sectionName = computed(() => {
    if (byRow.value) return rows.value[section.value]?.label ?? ''
    const c = section.value % boards.value.cols, r = Math.floor(section.value / boards.value.cols)
    return sectionCount.value > 1 ? `Board ${boardLabel(r, c)}` : 'Board'
})
const rowRuns = computed(() => {
    const r = byRow.value ? rows.value[section.value] : null
    if (!r) return []
    return r.runs.map(u => ({...u, bead: u.bead >= 0 ? props.brand.beads[u.bead]! : null}))
})

// --- screen stays on while building ----------------------------------------
let lock: { release: () => Promise<void> } | null = null
async function keepAwake() {
    try { lock = await (navigator as any).wakeLock?.request('screen') } catch { /* not supported */ }
}
function onVisible() { if (document.visibilityState === 'visible') keepAwake() }
function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') emit('close')
    if (e.key === 'ArrowRight' && section.value < sectionCount.value - 1) section.value++
    if (e.key === 'ArrowLeft' && section.value > 0) section.value--
}

watch(key, load)
watch(section, () => { focus.value = null })
// Open where the work stopped: the first board or row with beads left.
function firstUnfinished() {
    for (let k = 0; k < sectionCount.value; k++) {
        section.value = k
        if (sectionLeft.value > 0) return
    }
    section.value = 0
}

onMounted(() => {
    load()
    firstUnfinished()
    keepAwake()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.add('no-scroll')
})
onBeforeUnmount(() => {
    lock?.release().catch(() => {})
    document.removeEventListener('visibilitychange', onVisible)
    window.removeEventListener('keydown', onKey)
    document.documentElement.classList.remove('no-scroll')
})
</script>

<template>
  <div class="build" role="dialog" aria-modal="true" :aria-label="`Build ${title}`">
    <header class="build-head">
      <button class="btn btn-small btn-icon" title="Close (Esc)" aria-label="Close build mode" @click="emit('close')"><Icon name="close" /></button>
      <div class="build-title">
        <strong>{{ title }}</strong>
        <span class="muted small">{{ placed }} of {{ total }} placed, {{ total ? Math.round(placed / total * 100) : 0 }}%</span>
      </div>
      <div class="build-progress" aria-hidden="true"><i :style="{width: `${total ? placed / total * 100 : 0}%`}" /></div>
      <button class="btn btn-small" title="Clear all progress" @click="reset"><Icon name="refresh" />Reset</button>
    </header>

    <div class="build-body">
      <div class="build-stage">
        <ClientOnly>
          <BeadCanvas
            :grid="view.grid"
            :beads="brand.beads"
            mode="beads"
            :shape="craft.shape"
            :layout="craft.layout"
            :aspect="cellAspect(craft)"
            :focus="focus"
            :dim="viewDone"
            :outline="outline"
            :max-cell="48"
            @pick="toggle"
          />
        </ClientOnly>
      </div>

      <aside class="build-side">
        <div class="build-nav">
          <button class="btn btn-small btn-icon" :disabled="section === 0" aria-label="Previous" title="Previous (←)" @click="section--"><Icon name="arrow-left" /></button>
          <div class="build-section">
            <strong>{{ sectionName }}</strong>
            <span class="muted small">{{ sectionLeft }} left</span>
          </div>
          <button class="btn btn-small btn-icon" :disabled="section >= sectionCount - 1" aria-label="Next" title="Next (→)" @click="section++"><Icon name="arrow-right" /></button>
        </div>

        <ol v-if="byRow" class="build-runs" aria-label="Beads in this row, in order">
          <li v-for="(r, i) in rowRuns" :key="i">
            <span v-if="r.bead" class="bead-dot" :style="{background: r.bead.hex}" />
            <span v-else class="gap-dot" />
            <span>{{ r.count }} × {{ r.bead ? r.bead.code : 'skip' }}</span>
            <span v-if="r.bead" class="muted small">{{ r.bead.name }}</span>
          </li>
        </ol>

        <ul class="build-colours" aria-label="Colours here">
          <li v-for="c in sectionCounts" :key="c.index">
            <button class="bead-row" :aria-pressed="focus === c.index" @click="focus = focus === c.index ? null : c.index">
              <span class="bead-dot" :style="{background: brand.beads[c.index]!.hex}" />
              <span><span class="code">{{ brand.beads[c.index]!.code }}</span><span class="name">{{ brand.beads[c.index]!.name }}</span></span>
              <span class="count" :class="{finished: !c.left}">{{ c.left ? `${c.left} left` : 'done' }}</span>
            </button>
            <button v-if="focus === c.index" class="btn btn-small" @click="markColour(c.index, !!c.left)">
              <Icon :name="c.left ? 'tick' : 'undo'" />{{ c.left ? 'Mark this colour placed' : 'Unmark this colour' }}
            </button>
          </li>
        </ul>

        <button class="btn btn-primary" @click="markSection(sectionLeft > 0)">
          <Icon :name="sectionLeft ? 'tick' : 'undo'" />{{ sectionLeft ? `${byRow ? 'Row' : 'Board'} done` : `Unmark ${byRow ? 'row' : 'board'}` }}
        </button>
        <p class="muted small">Tap a bead to mark it placed. Pick a colour to see only its beads.</p>
      </aside>
    </div>
  </div>
</template>
