<script setup lang="ts">
import type {Bead} from '~/helper/beads/brands'
import type {Layout, Shape} from '~/helper/beads/crafts'
import {canvasSize, cellAt, drawPattern, type Geometry, type Tool, type ViewMode} from '~/helper/beads/draw'
import {floodRegion, lineCells, type BeadGrid} from '~/helper/beads/pattern'

const props = defineProps<{
    grid: BeadGrid
    beads: Bead[]
    mode: ViewMode
    focus?: number | null
    tool?: Tool
    shape?: Shape
    layout?: Layout
    // Cell height / width.
    aspect?: number
    boards?: boolean
    // Faded cells (Build mode: beads already placed).
    dim?: Uint8Array | null
    outline?: Uint8Array | null
    maxCell?: number
    // Fraction of the view height the board may take.
    fill?: number
}>()
// 1 fits the whole pattern in view; above 1 zooms in and the view scrolls.
const zoom = defineModel<number>('zoom', {default: 1})
const emit = defineEmits<{
    hover: [cell: { x: number; y: number; bead: number } | null]
    pick: [bead: number, index: number]
    // Alt-click with the brush: use the bead under the pointer.
    sample: [bead: number]
    strokeStart: []
    paint: [cells: number[]]
}>()

const MAX_ZOOM = 8
const box = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const base = ref(12)
const cell = computed(() => Math.max(2, Math.min(72, Math.round(base.value * zoom.value))))
const geo = computed<Geometry>(() => ({cw: cell.value, ch: cell.value * (props.aspect ?? 1), layout: props.layout ?? 'square'}))
const painting = computed(() => props.tool === 'brush' || props.tool === 'eraser')
const viewH = ref(480)
let ro: ResizeObserver | null = null
let frame = 0
let last: { x: number; y: number } | null = null
let pan: { x: number; y: number; sl: number; st: number; id: number } | null = null
let space = false

function fit() {
    const el = box.value
    if (!el) return
    const w = el.clientWidth
    // Inside a sized container (the square stage) use its height; otherwise a
    // share of the window.
    const parent = el.parentElement
    const cs = parent && getComputedStyle(parent)
    const inner = parent ? parent.clientHeight - parseFloat(cs!.paddingTop) - parseFloat(cs!.paddingBottom) : 0
    viewH.value = props.fill == null && inner > 120
        ? Math.floor(inner)
        : Math.round(Math.max(240, Math.min(window.innerHeight * (props.fill ?? 0.66), 900)))
    // Size of the grid in cell widths, including the half-cell offset.
    const unit = canvasSize(props.grid, {cw: 1, ch: props.aspect ?? 1, layout: props.layout ?? 'square'})
    base.value = Math.max(2, Math.min(props.maxCell ?? 30, Math.floor(Math.min(w / unit.W, viewH.value / unit.H))))
}

function token(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function draw() {
    frame = 0
    const cv = canvas.value
    if (!cv) return
    const dpr = window.devicePixelRatio || 1
    const {W, H} = canvasSize(props.grid, geo.value)
    const w = Math.ceil(W * dpr), h = Math.ceil(H * dpr)
    if (cv.width !== w || cv.height !== h) {
        cv.width = w
        cv.height = h
        cv.style.width = `${W}px`
        cv.style.height = `${H}px`
    }
    const ctx = cv.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawPattern(ctx, props.grid, {
        ...geo.value, mode: props.mode, shape: props.shape ?? 'bead', beads: props.beads, focus: props.focus,
        dim: props.dim, outline: props.outline, boardLines: props.boards, board: token('--board'), peg: token('--peg'),
        ...(props.outline ? {line: token('--accent')} : {}),
    })
}

// A brush stroke changes the grid on every pointer move; draw at most once a frame.
function schedule() {
    if (!frame) frame = requestAnimationFrame(draw)
}

function at(e: PointerEvent, clamp = false) {
    const r = canvas.value!.getBoundingClientRect()
    const c = cellAt(e.clientX - r.left, e.clientY - r.top, props.grid, geo.value, clamp)
    return c && {...c, bead: props.grid.cells[c.y * props.grid.width + c.x]!}
}

// Zoom to `z`, keeping the point under (cx, cy) (client coords) in place.
function zoomTo(z: number, cx?: number, cy?: number) {
    const el = box.value, cv = canvas.value
    if (!el || !cv) return
    const next = Math.max(1, Math.min(MAX_ZOOM, z))
    if (next === zoom.value) return
    const r = cv.getBoundingClientRect(), b = el.getBoundingClientRect()
    const px = cx ?? b.left + b.width / 2, py = cy ?? b.top + b.height / 2
    // Fraction of the canvas under the anchor, restored after the resize.
    const fx = (px - r.left) / r.width, fy = (py - r.top) / r.height
    zoom.value = next
    nextTick(() => {
        draw()
        const r2 = cv.getBoundingClientRect()
        el.scrollLeft += r2.left + fx * r2.width - px
        el.scrollTop += r2.top + fy * r2.height - py
    })
}

function onWheel(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    zoomTo(zoom.value * Math.exp(-e.deltaY * 0.004), e.clientX, e.clientY)
}

function startPan(e: PointerEvent) {
    const el = box.value!
    pan = {x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop, id: e.pointerId}
    canvas.value!.setPointerCapture(e.pointerId)
}

function onDown(e: PointerEvent) {
    // Middle button or space held: pan, whatever the tool.
    if (e.button === 1 || space) { e.preventDefault(); startPan(e); return }
    const c = at(e)
    if (!c) return
    const i = c.y * props.grid.width + c.x
    if (props.tool === 'fill') {
        emit('strokeStart')
        emit('paint', floodRegion(props.grid, c.x, c.y))
        return
    }
    if (!painting.value) {
        emit('pick', c.bead, i)
        // Dragging with the mouse pans a zoomed pattern; touch scrolls natively.
        if (e.pointerType === 'mouse' && zoom.value > 1) startPan(e)
        return
    }
    if (props.tool === 'brush' && e.altKey) {
        if (c.bead >= 0) emit('sample', c.bead)
        return
    }
    canvas.value!.setPointerCapture(e.pointerId)
    last = {x: c.x, y: c.y}
    emit('strokeStart')
    emit('paint', [i])
}

function onMove(e: PointerEvent) {
    if (pan && e.pointerId === pan.id) {
        box.value!.scrollLeft = pan.sl - (e.clientX - pan.x)
        box.value!.scrollTop = pan.st - (e.clientY - pan.y)
        return
    }
    const c = at(e)
    emit('hover', c)
    if (!last) return
    // Clamp to the board so a stroke that leaves the canvas still reaches the edge.
    const {x, y} = at(e, true)!
    if (x === last.x && y === last.y) return
    emit('paint', lineCells(last.x, last.y, x, y).slice(1).map(([px, py]) => py * props.grid.width + px))
    last = {x, y}
}

function onUp() {
    last = null
    pan = null
}

function onKey(e: KeyboardEvent) {
    if (e.code !== 'Space' || (e.target as HTMLElement)?.closest('input, textarea, select, button')) return
    space = e.type === 'keydown'
    if (space) e.preventDefault()
}

onMounted(() => {
    ro = new ResizeObserver(() => { fit(); draw() })
    if (box.value) ro.observe(box.value)
    if (box.value?.parentElement) ro.observe(box.value.parentElement)
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    fit()
    draw()
})
onBeforeUnmount(() => {
    ro?.disconnect()
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('keyup', onKey)
    if (frame) cancelAnimationFrame(frame)
})
watch(() => [props.grid.width, props.grid.height, props.aspect, props.layout], fit)
watch(() => [props.grid, props.beads, props.mode, props.focus, props.shape, props.dim, props.outline, geo.value], schedule)

defineExpose({zoomTo})
</script>

<template>
  <div
    ref="box"
    class="bead-canvas"
    :class="{painting, zoomed: zoom > 1}"
    :style="{maxHeight: `${viewH}px`, height: fill == null ? '100%' : undefined}"
    @wheel="onWheel"
  >
    <canvas
      ref="canvas"
      role="img"
      :aria-label="`Bead pattern, ${grid.width} by ${grid.height} beads`"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @pointerleave="emit('hover', null)"
      @contextmenu.prevent
    />
  </div>
</template>

