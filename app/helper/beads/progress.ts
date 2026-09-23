// Build mode progress: which cells are already on the board, kept per pattern
// in localStorage as a base64 bitset.
import type {BeadGrid} from './pattern'

// FNV-1a over the grid and its bead range: same pattern, same key.
export function patternKey(grid: BeadGrid, palette: string, craft: string): string {
    let h = 0x811c9dc5
    const mix = (n: number) => { h ^= n & 0xff; h = Math.imul(h, 0x01000193) >>> 0 }
    for (const ch of `${palette}|${craft}|${grid.width}x${grid.height}`) mix(ch.charCodeAt(0))
    for (const b of grid.cells) { mix(b); mix(b >> 8) }
    return `bap:build:${h.toString(36)}`
}

export function encodeDone(done: Uint8Array): string {
    const bytes = new Uint8Array(Math.ceil(done.length / 8))
    done.forEach((d, i) => { if (d) bytes[i >> 3]! |= 1 << (i & 7) })
    let s = ''
    bytes.forEach(b => { s += String.fromCharCode(b) })
    return btoa(s)
}

export function decodeDone(text: string, length: number): Uint8Array {
    const done = new Uint8Array(length)
    const s = atob(text)
    for (let i = 0; i < length; i++) if ((s.charCodeAt(i >> 3) >> (i & 7)) & 1) done[i] = 1
    return done
}
