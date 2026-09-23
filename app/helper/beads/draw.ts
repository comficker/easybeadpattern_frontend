import {shade} from '../color'
import {BOARD, type Bead} from './brands'
import type {Layout, Shape} from './crafts'
import type {BeadGrid} from './pattern'

export type ViewMode = 'beads' | 'flat'
export type Tool = 'select' | 'brush' | 'eraser' | 'fill'

// Where cells sit: size of one cell in px and how rows are offset.
export interface Geometry {
    cw: number
    ch: number
    layout: Layout
}

export interface DrawOptions extends Geometry {
    mode: ViewMode
    shape: Shape
    beads: Bead[]
    // Dashed lines every 29 pegs (fuse beads).
    boardLines?: boolean
    // Only this bead index is shown at full strength.
    focus?: number | null
    // Cells drawn faded (Build mode: already placed).
    dim?: Uint8Array | null
    // Cells with a ring around them (Build mode: the row being worked).
    outline?: Uint8Array | null
    // Background colours; the page passes its theme tokens.
    board?: string
    peg?: string
    line?: string
}

export function canvasSize(grid: BeadGrid, g: Geometry) {
    return {
        W: (grid.width + (g.layout === 'brick' && grid.height > 1 ? 0.5 : 0)) * g.cw,
        H: (grid.height + (g.layout === 'peyote' && grid.width > 1 ? 0.5 : 0)) * g.ch,
    }
}

export function cellOrigin(x: number, y: number, g: Geometry) {
    return {
        px: x * g.cw + (g.layout === 'brick' && y % 2 ? g.cw / 2 : 0),
        py: y * g.ch + (g.layout === 'peyote' && x % 2 ? g.ch / 2 : 0),
    }
}

// Cell under a point, or the nearest one when `clamp` is set.
export function cellAt(px: number, py: number, grid: BeadGrid, g: Geometry, clamp = false) {
    let x: number, y: number
    if (g.layout === 'brick') {
        y = Math.floor(py / g.ch)
        x = Math.floor((px - (y % 2 ? g.cw / 2 : 0)) / g.cw)
    } else if (g.layout === 'peyote') {
        x = Math.floor(px / g.cw)
        y = Math.floor((py - (x % 2 ? g.ch / 2 : 0)) / g.ch)
    } else {
        x = Math.floor(px / g.cw)
        y = Math.floor(py / g.ch)
    }
    if (clamp) {
        x = Math.max(0, Math.min(grid.width - 1, x))
        y = Math.max(0, Math.min(grid.height - 1, y))
    } else if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return null
    return {x, y}
}

const sprites = new Map<string, HTMLCanvasElement>()

// One bead, rendered once per colour, shape and size. Drawing thousands of
// gradients per frame is what made brush strokes lag on big patterns.
function sprite(hex: string, shape: Shape, cw: number, ch: number, scale: number): HTMLCanvasElement {
    const w = Math.max(1, Math.round(cw * scale)), h = Math.max(1, Math.round(ch * scale))
    const key = `${hex}|${shape}|${w}x${h}`
    let cv = sprites.get(key)
    if (cv) return cv
    if (sprites.size > 3000) sprites.clear()
    cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    const ctx = cv.getContext('2d')!
    if (shape === 'bead') {
        // A fuse or pony bead from above: a ring with a hole, lit from the top left.
        const c = w / 2, r = Math.min(w, h) * 0.47, hole = Math.min(w, h) * 0.17
        const g = ctx.createRadialGradient(c - r * 0.35, h / 2 - r * 0.35, r * 0.1, c, h / 2, r)
        g.addColorStop(0, shade(hex, 0.18))
        g.addColorStop(1, shade(hex, -0.14))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(c, h / 2, r, 0, Math.PI * 2)
        ctx.arc(c, h / 2, hole, 0, Math.PI * 2, true)
        ctx.fill()
    } else if (shape === 'tube') {
        // A cylinder seed bead from the side: rounded block, lit along its length.
        const ix = w * 0.06, iy = h * 0.06
        const g = ctx.createLinearGradient(0, 0, w, 0)
        g.addColorStop(0, shade(hex, -0.12))
        g.addColorStop(0.35, shade(hex, 0.16))
        g.addColorStop(1, shade(hex, -0.16))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.roundRect(ix, iy, w - 2 * ix, h - 2 * iy, Math.min(w, h) * 0.22)
        ctx.fill()
    } else {
        // A knot: two strands crossing into a V.
        ctx.fillStyle = shade(hex, -0.1)
        ctx.beginPath()
        ctx.roundRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92, Math.min(w, h) * 0.3)
        ctx.fill()
        ctx.strokeStyle = shade(hex, 0.18)
        ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.16)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(w * 0.25, h * 0.3)
        ctx.lineTo(w * 0.5, h * 0.7)
        ctx.lineTo(w * 0.75, h * 0.3)
        ctx.stroke()
    }
    sprites.set(key, cv)
    return cv
}

// Draws the pattern onto `ctx` at (0,0); size the canvas with canvasSize().
export function drawPattern(ctx: CanvasRenderingContext2D, grid: BeadGrid, o: DrawOptions) {
    const {cw, ch, beads} = o
    const {W, H} = canvasSize(grid, o)
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = o.board ?? '#E9ECF2'
    ctx.fillRect(0, 0, W, H)

    const peg = o.peg ?? '#D3D8E2'
    const hasFocus = o.focus != null && o.focus >= 0
    const small = Math.min(cw, ch)
    const shaped = o.mode === 'beads' && small >= 5
    // Sprites are rendered at device pixels so they stay sharp on hi-dpi.
    const scale = ctx.getTransform().a || 1

    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            const b = grid.cells[y * grid.width + x]!
            const {px, py} = cellOrigin(x, y, o)
            if (b < 0) {
                if (small >= 6) {
                    ctx.fillStyle = peg
                    ctx.beginPath()
                    ctx.arc(px + cw / 2, py + ch / 2, Math.max(1, small * 0.12), 0, Math.PI * 2)
                    ctx.fill()
                }
                continue
            }
            const hex = beads[b]!.hex
            ctx.globalAlpha = (hasFocus && b !== o.focus) ? 0.14 : o.dim?.[y * grid.width + x] ? 0.22 : 1
            if (shaped) {
                ctx.drawImage(sprite(hex, o.shape, cw, ch, scale), px, py, cw, ch)
            } else {
                ctx.fillStyle = hex
                ctx.fillRect(px, py, cw, ch)
            }
        }
    }
    ctx.globalAlpha = 1

    if (o.outline) {
        ctx.strokeStyle = o.line ?? '#E23E6B'
        ctx.lineWidth = Math.max(1.5, small * 0.12)
        for (let y = 0; y < grid.height; y++) for (let x = 0; x < grid.width; x++) {
            if (!o.outline[y * grid.width + x]) continue
            const {px, py} = cellOrigin(x, y, o)
            ctx.strokeRect(px + ctx.lineWidth / 2, py + ctx.lineWidth / 2, cw - ctx.lineWidth, ch - ctx.lineWidth)
        }
    }

    if (o.boardLines && (grid.width > BOARD || grid.height > BOARD)) {
        ctx.strokeStyle = o.line ?? 'rgba(31,42,68,.45)'
        ctx.lineWidth = Math.max(1, cw * 0.08)
        ctx.setLineDash([cw * 0.6, cw * 0.4])
        ctx.beginPath()
        for (let x = BOARD; x < grid.width; x += BOARD) { ctx.moveTo(x * cw, 0); ctx.lineTo(x * cw, H) }
        for (let y = BOARD; y < grid.height; y += BOARD) { ctx.moveTo(0, y * ch); ctx.lineTo(W, y * ch) }
        ctx.stroke()
        ctx.setLineDash([])
    }
}

export interface PngOptions {
    beads: Bead[]
    mode: ViewMode
    shape: Shape
    layout: Layout
    aspect: number
    boards: boolean
    transparent: boolean
}

export function patternPng(grid: BeadGrid, o: PngOptions): Promise<Blob> {
    // Sharp at any size: small patterns get big beads, big ones stay under ~3000 px.
    const cw = Math.max(12, Math.min(64, Math.floor(3000 / Math.max(grid.width, grid.height * o.aspect))))
    const g: Geometry = {cw, ch: cw * o.aspect, layout: o.layout}
    const {W, H} = canvasSize(grid, g)
    const cv = document.createElement('canvas')
    cv.width = Math.ceil(W)
    cv.height = Math.ceil(H)
    const ctx = cv.getContext('2d')!
    // Transparent: no background, no pegs, just the beads.
    drawPattern(ctx, grid, {
        ...g, mode: o.mode, shape: o.shape, beads: o.beads,
        ...(o.transparent ? {board: 'rgba(0,0,0,0)', peg: 'rgba(0,0,0,0)'} : {boardLines: o.boards}),
    })
    return new Promise((resolve, reject) => cv.toBlob(b => (b ? resolve(b) : reject(new Error('PNG_FAILED'))), 'image/png'))
}
