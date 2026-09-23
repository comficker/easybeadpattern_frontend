// Browser-only: turn an uploaded image into a SourceGrid of `width` beads.
import type {RGB} from '../color'
import {peelGround, reconstructCells} from '../pixel/reconstruct'
import type {Layout} from './crafts'
import type {SourceGrid} from './pattern'

export interface ImageOptions {
    width: number
    // Cell height / width (1 for square beads) and how rows sit.
    aspect?: number
    layout?: Layout
    removeBg?: boolean
    brightness?: number // -100..100
    contrast?: number // -100..100
    saturation?: number // -100..100
}

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('IMAGE_UNREADABLE'))
        img.src = src
    })
}

// Downscale a picked file to at most `max` px on the long side, as a data URL.
// Keeps the working copy (and the autosave) small.
export async function fileToDataUrl(file: File, max = 1200): Promise<string> {
    const url = URL.createObjectURL(file)
    try {
        const img = await loadImage(url)
        const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight))
        const cv = document.createElement('canvas')
        cv.width = Math.max(1, Math.round(img.naturalWidth * k))
        cv.height = Math.max(1, Math.round(img.naturalHeight * k))
        cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height)
        return cv.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.92)
    } finally {
        URL.revokeObjectURL(url)
    }
}

export function heightFor(img: HTMLImageElement, width: number, aspect = 1): number {
    return Math.max(1, Math.round(width * img.naturalHeight / img.naturalWidth / aspect))
}

// Plain area average of each cell, for offset layouts where cells do not
// line up on one grid. Cells less than half covered stay empty.
function sampleBoxes(src: ImageData, w: number, h: number, cw: number, ch: number, layout: Layout): (RGB | null)[] {
    const {width: W, height: H, data} = src
    const out: (RGB | null)[] = []
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const ox = layout === 'brick' && y % 2 ? cw / 2 : 0
            const oy = layout === 'peyote' && x % 2 ? ch / 2 : 0
            const x0 = Math.floor(x * cw + ox), x1 = Math.min(W, Math.ceil((x + 1) * cw + ox))
            const y0 = Math.floor(y * ch + oy), y1 = Math.min(H, Math.ceil((y + 1) * ch + oy))
            let r = 0, g = 0, b = 0, a = 0, n = 0
            for (let py = y0; py < y1; py++) for (let px = x0; px < x1; px++) {
                const i = (py * W + px) * 4
                const al = data[i + 3]! / 255
                r += data[i]! * al; g += data[i + 1]! * al; b += data[i + 2]! * al; a += al; n++
            }
            out.push(n && a / n >= 0.5 ? [Math.round(r / a), Math.round(g / a), Math.round(b / a)] : null)
        }
    }
    return out
}

export function imageToSource(img: HTMLImageElement, opts: ImageOptions): SourceGrid {
    const w = opts.width
    const aspect = opts.aspect ?? 1
    const layout = opts.layout ?? 'square'
    const h = heightFor(img, w, aspect)
    // Pixels per cell, keeping the cell's real proportions.
    const cw = Math.max(2, Math.floor(600 / Math.max(w, h * aspect)))
    const ch = cw * aspect
    const cv = document.createElement('canvas')
    // Offset layouts are half a cell longer on the offset side.
    cv.width = Math.round((w + (layout === 'brick' ? 0.5 : 0)) * cw)
    cv.height = Math.round((h + (layout === 'peyote' ? 0.5 : 0)) * ch)
    const ctx = cv.getContext('2d', {willReadFrequently: true})!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, cv.width, cv.height)
    const src = ctx.getImageData(0, 0, cv.width, cv.height)

    const b = opts.brightness ?? 0
    const c = ((opts.contrast ?? 0) + 100) / 100
    const s = ((opts.saturation ?? 0) + 100) / 100
    if (b || c !== 1 || s !== 1) {
        const d = src.data
        for (let i = 0; i < d.length; i += 4) {
            let r = (d[i]! + b - 128) * c + 128
            let g = (d[i + 1]! + b - 128) * c + 128
            let bl = (d[i + 2]! + b - 128) * c + 128
            const gray = 0.299 * r + 0.587 * g + 0.114 * bl
            r = gray + (r - gray) * s
            g = gray + (g - gray) * s
            bl = gray + (bl - gray) * s
            d[i] = r; d[i + 1] = g; d[i + 2] = bl
        }
    }
    if (opts.removeBg) peelGround(src)

    if (layout !== 'square') return {width: w, height: h, cells: sampleBoxes(src, w, h, cw, ch, layout)}
    const rows = reconstructCells(src, w, h)
    return {width: w, height: h, cells: rows.flat()}
}
