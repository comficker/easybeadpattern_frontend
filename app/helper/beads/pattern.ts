import {deltaE, hexToRgb, rgbToLab, type Lab, type RGB} from '../color'
import {BOARD, type Brand} from './brands'
import type {RowOrder} from './crafts'

// A brand-agnostic grid of colours, row-major. null = no bead.
export interface SourceGrid {
    width: number
    height: number
    cells: (RGB | null)[]
}

// A grid of bead indices into `brand.beads`, row-major. -1 = no bead.
export interface BeadGrid {
    width: number
    height: number
    cells: Int16Array
}

export interface MatchOptions {
    maxColors: number
    dither?: boolean
    // Include clear, glitter, glow, pearl and neon beads as candidates.
    includeSpecial?: boolean
    // Only these bead codes (the colours someone owns). Ignored when empty.
    only?: Set<string> | null
}

export function gridFromMapNumbers(width: number, height: number, colors: string[], map: Record<string, number>): SourceGrid {
    const palette = colors.map(c => (c && c.length >= 7 ? hexToRgb(c) : null))
    const cells: (RGB | null)[] = new Array(width * height).fill(null)
    for (const [k, idx] of Object.entries(map || {})) {
        const [xs, ys] = k.split('_')
        const x = +xs!, y = +ys!
        if (x < 0 || y < 0 || x >= width || y >= height) continue
        cells[y * width + x] = palette[idx] ?? null
    }
    return {width, height, cells}
}

const SHORTLIST = 8

// Closest bead by CIEDE2000. Plain Lab distance is a good enough pre-filter,
// so the costly formula only runs on a short list of candidates.
function nearestIn(lab: Lab, beads: Brand['beads'], pool: number[]): number {
    if (pool.length <= SHORTLIST) return bestOf(lab, beads, pool)
    const idx: number[] = [], dist: number[] = []
    for (const i of pool) {
        const b = beads[i]!.lab
        const d = (lab[0] - b[0]) ** 2 + (lab[1] - b[1]) ** 2 + (lab[2] - b[2]) ** 2
        if (idx.length === SHORTLIST && d >= dist[SHORTLIST - 1]!) continue
        let j = Math.min(idx.length, SHORTLIST - 1)
        while (j > 0 && dist[j - 1]! > d) { dist[j] = dist[j - 1]!; idx[j] = idx[j - 1]!; j-- }
        dist[j] = d; idx[j] = i
    }
    return bestOf(lab, beads, idx)
}

function bestOf(lab: Lab, beads: Brand['beads'], pool: number[]): number {
    let best = pool[0]!, bd = Infinity
    for (const i of pool) {
        const d = deltaE(lab, beads[i]!.lab)
        if (d < bd) { bd = d; best = i }
    }
    return best
}

// Match every cell to a bead of `brand`, then cut the palette down to
// `maxColors` by repeatedly dropping the bead whose removal costs least:
// √cells × (distance to the closest bead still in use)². Near-duplicate shades
// go first; a small but distinct detail such as a one-bead eye survives, which
// a "least used" or plain cells × distance rule would merge away.
export function matchToBeads(src: SourceGrid, brand: Brand, opts: MatchOptions): BeadGrid {
    const {beads} = brand
    let pool = beads.map((_, i) => i).filter(i => opts.includeSpecial || !beads[i]!.special)
    if (opts.only?.size) {
        const mine = beads.map((_, i) => i).filter(i => opts.only!.has(beads[i]!.code))
        if (mine.length) pool = mine
    }
    const n = src.width * src.height
    const labs: (Lab | null)[] = src.cells.map(c => (c ? rgbToLab(c) : null))
    const cells = new Int16Array(n).fill(-1)

    const memo = new Map<number, number>()
    for (let i = 0; i < n; i++) {
        const c = src.cells[i]
        if (!c) continue
        const key = (c[0] << 16) | (c[1] << 8) | c[2]
        let b = memo.get(key)
        if (b === undefined) { b = nearestIn(labs[i]!, beads, pool); memo.set(key, b) }
        cells[i] = b
    }

    const counts = new Map<number, number>()
    for (const b of cells) if (b >= 0) counts.set(b, (counts.get(b) || 0) + 1)
    const limit = Math.max(1, opts.maxColors)

    // Bead-to-bead distances among the beads in use, computed once.
    const dist = new Map<number, number>()
    const pair = (u: number, v: number) => {
        const k = u < v ? u * 1024 + v : v * 1024 + u
        let d = dist.get(k)
        if (d === undefined) { d = deltaE(beads[u]!.lab, beads[v]!.lab); dist.set(k, d) }
        return d
    }
    while (counts.size > limit) {
        const used = [...counts.keys()]
        let drop = -1, dropCost = Infinity
        for (const u of used) {
            let d = Infinity
            for (const v of used) if (v !== u) d = Math.min(d, pair(u, v))
            const cost = Math.sqrt(counts.get(u)!) * d * d
            if (cost < dropCost) { dropCost = cost; drop = u }
        }
        counts.delete(drop)
        const rest = [...counts.keys()]
        for (let i = 0; i < n; i++) {
            if (cells[i] !== drop) continue
            const b = nearestIn(labs[i]!, beads, rest)
            cells[i] = b
            counts.set(b, counts.get(b)! + 1)
        }
    }

    if (opts.dither) {
        const used = [...counts.keys()]
        const buf = new Float32Array(n * 3)
        src.cells.forEach((c, i) => { if (c) buf.set(c, i * 3) })
        const {width: w, height: h} = src
        const push = (x: number, y: number, e: number[], k: number) => {
            if (x < 0 || x >= w || y >= h) return
            const j = y * w + x
            if (!src.cells[j]) return
            buf[j * 3]! += e[0]! * k; buf[j * 3 + 1]! += e[1]! * k; buf[j * 3 + 2]! += e[2]! * k
        }
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = y * w + x
                if (!src.cells[i]) continue
                const rgb: RGB = [
                    Math.max(0, Math.min(255, buf[i * 3]!)),
                    Math.max(0, Math.min(255, buf[i * 3 + 1]!)),
                    Math.max(0, Math.min(255, buf[i * 3 + 2]!)),
                ]
                const b = nearestIn(rgbToLab(rgb), beads, used)
                cells[i] = b
                const t = beads[b]!.rgb
                const e = [rgb[0] - t[0], rgb[1] - t[1], rgb[2] - t[2]]
                push(x + 1, y, e, 7 / 16)
                push(x - 1, y + 1, e, 3 / 16)
                push(x, y + 1, e, 5 / 16)
                push(x + 1, y + 1, e, 1 / 16)
            }
        }
    }

    return {width: src.width, height: src.height, cells}
}

// Apply user colour swaps (bead index → bead index, -1 removes the bead).
export function applySwaps(grid: BeadGrid, swaps: Record<number, number>): BeadGrid {
    if (!Object.keys(swaps).length) return grid
    const cells = grid.cells.map(b => (b >= 0 && b in swaps ? swaps[b]! : b))
    return {...grid, cells}
}

// The regular bead of `brand` closest to a colour.
export function nearestBead(brand: Brand, hex: string): number {
    const pool = brand.beads.map((_, i) => i).filter(i => !brand.beads[i]!.special)
    return nearestIn(rgbToLab(hexToRgb(hex)), brand.beads, pool)
}

// Hand edits from the brush and eraser: cell index → bead colour (hex), or
// null for no bead. Kept as colours, not bead indices, so they survive a brand
// switch (each colour maps to that brand's closest bead) and a change of the
// colour limit (painted beads are never merged away).
export type Edits = Record<number, string | null>

export function applyEdits(grid: BeadGrid, edits: Edits, brand: Brand): BeadGrid {
    const keys = Object.keys(edits)
    if (!keys.length) return grid
    const cells = grid.cells.slice()
    const memo = new Map<string, number>()
    // Exact bead first; otherwise the closest regular bead, never a clear or metallic one.
    const pool = brand.beads.map((_, i) => i).filter(i => !brand.beads[i]!.special)
    for (const k of keys) {
        const i = +k
        if (i < 0 || i >= cells.length) continue
        const hex = edits[i]
        if (hex == null) { cells[i] = -1; continue }
        let b = memo.get(hex)
        if (b === undefined) {
            b = brand.beads.findIndex(x => x.hex === hex)
            if (b < 0) b = nearestIn(rgbToLab(hexToRgb(hex)), brand.beads, pool)
            memo.set(hex, b)
        }
        cells[i] = b
    }
    return {...grid, cells}
}

// Cells connected to (x, y) with the same bead (4 neighbours), for the fill tool.
export function floodRegion(grid: BeadGrid, x: number, y: number): number[] {
    const {width: w, height: h, cells} = grid
    const target = cells[y * w + x]
    const seen = new Uint8Array(w * h)
    const out: number[] = []
    const stack = [y * w + x]
    while (stack.length) {
        const i = stack.pop()!
        if (seen[i] || cells[i] !== target) continue
        seen[i] = 1
        out.push(i)
        const cx = i % w, cy = (i - cx) / w
        if (cx > 0) stack.push(i - 1)
        if (cx < w - 1) stack.push(i + 1)
        if (cy > 0) stack.push(i - w)
        if (cy < h - 1) stack.push(i + w)
    }
    return out
}

// Cells on the straight line between two cells (Bresenham), so a fast drag
// leaves no gaps.
export function lineCells(x0: number, y0: number, x1: number, y1: number): [number, number][] {
    const out: [number, number][] = []
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
    let err = dx + dy
    for (;;) {
        out.push([x0, y0])
        if (x0 === x1 && y0 === y1) break
        const e2 = 2 * err
        if (e2 >= dy) { err += dy; x0 += sx }
        if (e2 <= dx) { err += dx; y0 += sy }
    }
    return out
}

export interface BeadCount { index: number; count: number }

export function countBeads(grid: BeadGrid): BeadCount[] {
    const m = new Map<number, number>()
    for (const b of grid.cells) if (b >= 0) m.set(b, (m.get(b) || 0) + 1)
    return [...m].map(([index, count]) => ({index, count})).sort((a, b) => b.count - a.count)
}

export function boardsOf(width: number, height: number) {
    return {cols: Math.ceil(width / BOARD), rows: Math.ceil(height / BOARD)}
}

// A1, A2 … across; B1, B2 … on the next row of boards.
export function boardLabel(row: number, col: number): string {
    return String.fromCharCode(65 + (row % 26)) + (col + 1)
}

// Written chart: each row as runs of one colour, in the order you work it.
// bead -1 is a gap (a shape narrower than the grid).
export interface ChartRow {
    label: string
    dir: 'ltr' | 'rtl'
    runs: { bead: number; count: number }[]
    // Grid indices of the row's cells, in working order.
    cells: number[]
}

function runsOf(cells: number[]): ChartRow['runs'] {
    let a = 0, b = cells.length - 1
    while (a <= b && cells[a]! < 0) a++
    while (b >= a && cells[b]! < 0) b--
    const runs: ChartRow['runs'] = []
    for (let i = a; i <= b; i++) {
        const last = runs[runs.length - 1]
        if (last && last.bead === cells[i]) last.count++
        else runs.push({bead: cells[i]!, count: 1})
    }
    return runs
}

export function wordChart(grid: BeadGrid, order: RowOrder): ChartRow[] {
    const {width: w, height: h, cells} = grid
    const at = (x: number, y: number) => cells[y * w + x]!
    const rows: ChartRow[] = []

    if (order === 'peyote') {
        // Flat even-count peyote with odd columns half a bead lower: rows 1 and 2
        // are the top bead of every column, picked up together. Each later row
        // adds the next bead of every other column, alternating direction.
        const top = Array.from({length: w}, (_, x) => at(x, 0))
        rows.push({label: 'Rows 1 & 2', dir: 'ltr', runs: runsOf(top), cells: Array.from({length: w}, (_, x) => x)})
        for (let n = 3; ; n++) {
            const y = Math.floor((n - 1) / 2)
            if (y >= h) break
            const parity = n % 2 ? 0 : 1
            const idx: number[] = []
            for (let x = parity; x < w; x += 2) idx.push(y * w + x)
            const dir = n % 2 ? 'rtl' : 'ltr'
            if (dir === 'rtl') idx.reverse()
            rows.push({label: `Row ${n}`, dir, runs: runsOf(idx.map(i => cells[i]!)), cells: idx})
        }
        return rows
    }

    for (let y = 0; y < h; y++) {
        const idx = Array.from({length: w}, (_, x) => y * w + x)
        const dir = order === 'zigzag' && y % 2 ? 'rtl' : 'ltr'
        if (dir === 'rtl') idx.reverse()
        rows.push({label: `Row ${y + 1}`, dir, runs: runsOf(idx.map(i => cells[i]!)), cells: idx})
    }
    return rows
}
