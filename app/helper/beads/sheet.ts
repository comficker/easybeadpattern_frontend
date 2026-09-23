// Browser-only "pattern sheet" PNG: title, the pattern on its board, and the
// colour list with counts, sized for sharing or printing on one page.
import type {Brand} from './brands'
import {cellAspect, type Craft} from './crafts'
import {canvasSize, drawPattern, type ViewMode} from './draw'
import {sizeParts} from './info'
import {countBeads, type BeadGrid} from './pattern'

const INK = '#1F2A44', MUTED = '#5B6475', BOARD_BG = '#E9ECF2', ZEBRA = '#F5F6F9'
const MARK = ['#E23E6B', '#F4B400', '#2F9E6B', '#3D6BFF']
const FONT = "'Rubik', 'Rubik Fallback', Arial, sans-serif"

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.fill()
}

function bead(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, hex: string) {
    ctx.fillStyle = hex
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.arc(x, y, r * 0.36, 0, Math.PI * 2, true); ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke()
}

export async function patternSheet(grid: BeadGrid, brand: Brand, craft: Craft, title: string, site: string, mode: ViewMode): Promise<Blob> {
    await document.fonts?.ready
    const aspect = cellAspect(craft)
    const unit = canvasSize(grid, {cw: 1, ch: aspect, layout: craft.layout})
    const W = 1600, PAD = 80
    // The board fills the width, up to a height that keeps the sheet printable.
    const cell = Math.max(4, Math.min(64, Math.floor(Math.min((W - 2 * PAD - 64) / unit.W, 1300 / unit.H))))
    const g = {cw: cell, ch: cell * aspect, layout: craft.layout}
    const board = canvasSize(grid, g)
    const counts = countBeads(grid)
    const cols = counts.length > 16 ? 3 : counts.length > 6 ? 2 : 1
    const rowH = 64
    const listRows = Math.ceil(counts.length / cols)
    const headH = 220, boardH = board.H + 64, listH = 90 + listRows * rowH, footH = 110
    const H = Math.ceil(headH + boardH + 56 + listH + footH)

    const cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    const ctx = cv.getContext('2d')!
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H)

    // Header: brand, title, facts.
    MARK.forEach((c, i) => {
        ctx.strokeStyle = c; ctx.lineWidth = 7
        ctx.beginPath(); ctx.arc(PAD + 12 + (i % 2) * 26, 60 + Math.floor(i / 2) * 26, 8.5, 0, Math.PI * 2); ctx.stroke()
    })
    ctx.fillStyle = INK; ctx.font = `700 30px ${FONT}`; ctx.textBaseline = 'middle'
    ctx.fillText('EasyBeadPattern', PAD + 64, 74)
    ctx.fillStyle = MUTED; ctx.font = `400 26px ${FONT}`; ctx.textAlign = 'right'
    ctx.fillText(brand.line, W - PAD, 74)
    ctx.textAlign = 'left'
    ctx.fillStyle = INK; ctx.font = `700 60px ${FONT}`
    let t = title
    while (ctx.measureText(t).width > W - 2 * PAD && t.length > 4) t = `${t.slice(0, -2)}…`
    ctx.fillText(t, PAD, 150)
    let cx = PAD
    ctx.font = `400 24px ${FONT}`
    for (const part of sizeParts(grid, brand, craft)) {
        const w = ctx.measureText(part).width + 36
        if (cx + w > W - PAD) break
        ctx.fillStyle = BOARD_BG; roundRect(ctx, cx, 180, w, 44, 22)
        ctx.fillStyle = INK; ctx.fillText(part, cx + 18, 203)
        cx += w + 12
    }

    // The pattern on its pegboard.
    const by = headH + 40
    ctx.fillStyle = BOARD_BG; roundRect(ctx, PAD, by, W - 2 * PAD, boardH, 28)
    const bx = (W - board.W) / 2
    ctx.save(); ctx.translate(bx, by + 32)
    drawPattern(ctx, grid, {...g, mode, shape: craft.shape, beads: brand.beads, boardLines: craft.boards, board: BOARD_BG, peg: '#D3D8E2'})
    ctx.restore()

    // Colour list with counts.
    let ly = by + boardH + 70
    ctx.fillStyle = INK; ctx.font = `700 34px ${FONT}`
    ctx.fillText(brand.unit === 'knot' ? 'Floss you need' : 'Beads you need', PAD, ly)
    const total = counts.reduce((s, c) => s + c.count, 0)
    ctx.fillStyle = MUTED; ctx.font = `400 24px ${FONT}`; ctx.textAlign = 'right'
    ctx.fillText(`${total.toLocaleString('en')} ${brand.unit}s, ${counts.length} colour${counts.length === 1 ? '' : 's'}`, W - PAD, ly)
    ctx.textAlign = 'left'
    ly += 44
    const colW = (W - 2 * PAD - (cols - 1) * 24) / cols
    counts.forEach((c, i) => {
        const col = Math.floor(i / listRows), r = i % listRows
        const x = PAD + col * (colW + 24), y = ly + r * rowH
        if (r % 2 === 0) { ctx.fillStyle = ZEBRA; roundRect(ctx, x, y, colW, rowH - 6, 12) }
        const b = brand.beads[c.index]!
        const mid = y + (rowH - 6) / 2
        ctx.fillStyle = MUTED; ctx.font = `600 22px ${FONT}`; ctx.fillText(`${i + 1}`, x + 16, mid)
        bead(ctx, x + 76, mid, 18, b.hex)
        ctx.fillStyle = INK; ctx.font = `600 24px ${FONT}`; ctx.fillText(b.code, x + 108, mid)
        const cw = ctx.measureText(b.code).width
        ctx.fillStyle = MUTED; ctx.font = `400 22px ${FONT}`
        let name = b.name
        const room = colW - 108 - cw - 110
        while (ctx.measureText(name).width > room && name.length > 2) name = `${name.slice(0, -2)}…`
        ctx.fillText(name, x + 120 + cw, mid)
        ctx.fillStyle = INK; ctx.font = `700 24px ${FONT}`; ctx.textAlign = 'right'
        ctx.fillText(c.count.toLocaleString('en'), x + colW - 18, mid)
        ctx.textAlign = 'left'
    })

    // Footer.
    ctx.fillStyle = MUTED; ctx.font = `400 22px ${FONT}`
    ctx.fillText(`Made with ${site}`, PAD, H - 50)
    return new Promise((resolve, reject) => cv.toBlob(b => (b ? resolve(b) : reject(new Error('PNG_FAILED'))), 'image/png'))
}

