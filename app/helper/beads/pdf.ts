// Browser-only printable pattern: a cover page with the preview and shopping
// list, then the chart. Fuse beads get one page per 29×29 board; other crafts
// get the chart in page-sized parts plus a written row-by-row chart.
import {jsPDF} from 'jspdf'
import {hexToRgb, inkOn} from '../color'
import {BOARD, type Brand} from './brands'
import {cellAspect, type Craft} from './crafts'
import {canvasSize, cellOrigin, drawPattern} from './draw'
import {sizeParts} from './info'
import {boardLabel, boardsOf, countBeads, wordChart, type BeadGrid} from './pattern'

const M = 14 // page margin, mm
const PW = 210, PH = 297
const INK = '#1F2A44', MUTED = '#5B6475', FAINT = '#8A93A6', LINE = '#DFE3EA', BOARD_BG = '#E9ECF2', ACCENT = '#D6336A'
const MARK = ['#E23E6B', '#F4B400', '#2F9E6B', '#3D6BFF']

export function patternPdf(grid: BeadGrid, brand: Brand, craft: Craft, title: string, site: string): Blob {
    const doc = new jsPDF({unit: 'mm', format: 'a4', compress: true})
    doc.setProperties({title, subject: `${craft.name} pattern`, creator: site, keywords: `bead pattern, ${brand.name}`})
    const counts = countBeads(grid)
    // Legend numbers follow the shopping list: 1 is the most used bead.
    const num = new Map<number, number>()
    counts.forEach((c, i) => num.set(c.index, i + 1))
    const aspect = cellAspect(craft)
    const total = counts.reduce((s, c) => s + c.count, 0)
    const unit = brand.unit

    const fill = (hex: string) => { const [r, g, b] = hexToRgb(hex); doc.setFillColor(r, g, b) }
    const stroke = (hex: string) => { const [r, g, b] = hexToRgb(hex); doc.setDrawColor(r, g, b) }
    const text = (hex: string) => { const [r, g, b] = hexToRgb(hex); doc.setTextColor(r, g, b) }
    const font = (size: number, weight: 'normal' | 'bold' = 'normal', color = INK) => {
        doc.setFont('helvetica', weight); doc.setFontSize(size); text(color)
    }
    // A bead seen from above: coloured ring with a hole.
    const bead = (x: number, y: number, r: number, hex: string) => {
        fill(hex); stroke('#C9CED8'); doc.setLineWidth(0.15); doc.circle(x, y, r, 'FD')
        fill('#FFFFFF'); doc.circle(x, y, r * 0.36, 'F')
    }
    const mark = (x: number, y: number, s: number) => {
        MARK.forEach((c, i) => {
            stroke(c); doc.setLineWidth(s * 0.32)
            doc.circle(x + (i % 2) * s * 1.25 + s / 2, y + Math.floor(i / 2) * s * 1.25 + s / 2, s * 0.34, 'S')
        })
    }
    // Rounded label; returns its width.
    const chip = (x: number, y: number, label: string, bg = BOARD_BG, color = INK) => {
        font(8.5, 'normal', color)
        const w = doc.getTextWidth(label) + 6
        fill(bg); doc.roundedRect(x, y - 4, w, 6, 3, 3, 'F')
        doc.text(label, x + 3, y)
        return w
    }
    const pageHead = (h: string, sub: string) => {
        font(15, 'bold'); doc.text(h, M, M + 6)
        font(9, 'normal', MUTED); doc.text(sub, M, M + 11.5)
    }
    // Small map of all boards / parts with the current one filled.
    const miniMap = (cols: number, rows: number, cur: number) => {
        if (cols * rows < 2) return
        const s = Math.min(6, 30 / Math.max(cols, rows)), gap = 0.8
        const x0 = PW - M - cols * (s + gap) + gap, y0 = M + 1
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            const on = r * cols + c === cur
            fill(on ? ACCENT : BOARD_BG); doc.roundedRect(x0 + c * (s + gap), y0 + r * (s + gap), s, s, 0.8, 0.8, 'F')
            if (s >= 4.5 && craft.boards) {
                font(5.5, on ? 'bold' : 'normal', on ? '#FFFFFF' : MUTED)
                doc.text(boardLabel(r, c), x0 + c * (s + gap) + s / 2, y0 + r * (s + gap) + s / 2 + 0.9, {align: 'center'})
            }
        }
    }

    // --- Cover -----------------------------------------------------------------
    mark(M, M - 1, 2.2)
    font(9.5, 'bold'); doc.text('EasyBeadPattern', M + 7, M + 2.4)
    font(8.5, 'normal', MUTED); doc.text(brand.line, PW - M, M + 2.4, {align: 'right'})
    font(22, 'bold'); doc.text(doc.splitTextToSize(title, PW - 2 * M)[0], M, M + 16)
    let cx = M
    for (const part of sizeParts(grid, brand, craft)) {
        font(8.5)
        const w = doc.getTextWidth(part) + 6
        if (cx + w > PW - M) break
        cx += chip(cx, M + 25, part) + 2
    }

    // Preview drawn as beads on a pegboard panel.
    const unitSize = canvasSize(grid, {cw: 1, ch: aspect, layout: craft.layout})
    const px = Math.max(6, Math.min(24, Math.floor(1600 / Math.max(unitSize.W, unitSize.H))))
    const cv = document.createElement('canvas')
    const pxSize = canvasSize(grid, {cw: px, ch: px * aspect, layout: craft.layout})
    cv.width = Math.ceil(pxSize.W); cv.height = Math.ceil(pxSize.H)
    drawPattern(cv.getContext('2d')!, grid, {
        cw: px, ch: px * aspect, layout: craft.layout, mode: 'beads', shape: craft.shape, beads: brand.beads, board: BOARD_BG, peg: '#D3D8E2',
    })
    const panelY = M + 31, pad = 5
    const k = Math.min((PW - 2 * M - 2 * pad) / unitSize.W, 112 / unitSize.H)
    const iw = unitSize.W * k, ih = unitSize.H * k
    fill(BOARD_BG); doc.roundedRect(M, panelY, PW - 2 * M, ih + 2 * pad, 3, 3, 'F')
    const ix = M + (PW - 2 * M - iw) / 2, iy = panelY + pad
    doc.addImage(cv.toDataURL('image/png'), 'PNG', ix, iy, iw, ih, undefined, 'FAST')
    if (craft.boards) {
        const {cols, rows} = boardsOf(grid.width, grid.height)
        if (cols * rows > 1) {
            stroke(INK); doc.setLineWidth(0.35); doc.setLineDashPattern([1.2, 0.8], 0)
            for (let c = 1; c < cols; c++) doc.line(ix + c * BOARD * k, iy, ix + c * BOARD * k, iy + ih)
            for (let r = 1; r < rows; r++) doc.line(ix, iy + r * BOARD * k, ix + iw, iy + r * BOARD * k)
            doc.setLineDashPattern([], 0)
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) chip(ix + c * BOARD * k + 1.5, iy + r * BOARD * k + 5.5, boardLabel(r, c), '#FFFFFF')
        }
    }

    // Shopping list: a table in one or two columns, continued if long.
    let y = panelY + ih + 2 * pad + 11
    font(12.5, 'bold'); doc.text(unit === 'knot' ? 'Floss you need' : 'Beads you need', M, y)
    font(9, 'normal', MUTED)
    doc.text(`${total.toLocaleString('en')} ${unit}${total === 1 ? '' : 's'}, ${counts.length} colour${counts.length === 1 ? '' : 's'}`, PW - M, y, {align: 'right'})
    const RH = 6.4
    const twoCols = counts.length > 12
    const colW = twoCols ? (PW - 2 * M - 6) / 2 : PW - 2 * M
    const tableHead = (x: number, yy: number) => {
        font(7.5, 'normal', FAINT)
        doc.text('No.', x + 1.5, yy); doc.text('Code and name', x + 16, yy)
        doc.text(unit === 'knot' ? 'Knots' : 'Beads', x + colW - 1.5, yy, {align: 'right'})
        stroke(LINE); doc.setLineWidth(0.2); doc.line(x, yy + 1.6, x + colW, yy + 1.6)
    }
    let top = y + 7, col = 0, row = 0
    const fits = () => Math.floor((PH - top - 22) / RH)
    let cap = fits()
    tableHead(M, top); if (twoCols) tableHead(M + colW + 6, top)
    for (const c of counts) {
        if (row >= cap) {
            row = 0
            if (twoCols && col === 0) col = 1
            else {
                doc.addPage(); col = 0
                pageHead(unit === 'knot' ? 'Floss you need' : 'Beads you need', 'Continued')
                top = M + 22
                tableHead(M, top); if (twoCols) tableHead(M + colW + 6, top)
                cap = fits()
            }
        }
        const x = M + col * (colW + 6), ry = top + 3 + row * RH
        if (row % 2 === 0) { fill('#F5F6F9'); doc.rect(x, ry, colW, RH, 'F') }
        const b = brand.beads[c.index]!
        font(8.5, 'bold'); doc.text(`${num.get(c.index)}`, x + 1.5, ry + 4.3)
        bead(x + 11, ry + RH / 2, 2.1, b.hex)
        font(8.5, 'bold'); doc.text(b.code, x + 16, ry + 4.3)
        const cw = doc.getTextWidth(b.code)
        font(8.5, 'normal', MUTED)
        doc.text(doc.splitTextToSize(b.name, colW - 34 - cw)[0] ?? '', x + 18 + cw, ry + 4.3)
        font(8.5, 'bold'); doc.text(c.count.toLocaleString('en'), x + colW - 1.5, ry + 4.3, {align: 'right'})
        row++
    }

    // Draws cells [x0, x1) × [y0, y1) at (gx, gy) with cell size s × s*aspect.
    // Offsets follow the global column / row, so parts line up with each other.
    const cells = (x0: number, x1: number, y0: number, y1: number, gx: number, gy: number, s: number) => {
        const cg = {cw: s, ch: s * aspect, layout: craft.layout}
        const used = new Map<number, number>()
        const base = cellOrigin(x0, y0, cg)
        for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
            const o = cellOrigin(xx, yy, cg)
            const px = gx + o.px - base.px + (craft.layout === 'brick' && y0 % 2 ? s / 2 : 0)
            const py = gy + o.py - base.py + (craft.layout === 'peyote' && x0 % 2 ? cg.ch / 2 : 0)
            const inside = xx < grid.width && yy < grid.height
            const b = inside ? grid.cells[yy * grid.width + xx]! : -1
            stroke('#CDD2DB'); doc.setLineWidth(0.1)
            if (b < 0) { if (inside) { fill('#FFFFFF'); doc.rect(px, py, s, cg.ch, 'FD') } continue }
            used.set(b, (used.get(b) || 0) + 1)
            const hex = brand.beads[b]!.hex
            fill(hex); doc.rect(px, py, s, cg.ch, 'FD')
            font(s > 5.5 ? 6.5 : 5.5, 'bold', inkOn(hex))
            doc.text(`${num.get(b)}`, px + s / 2, py + cg.ch / 2 + 0.95, {align: 'center'})
        }
        return used
    }

    // Colours on this page, as bead chips.
    const legend = (used: Map<number, number>, topY: number) => {
        let lx = M, ly = topY
        font(8.5, 'bold'); doc.text('On this page', M, ly); ly += 6
        for (const [b, n] of [...used].sort((a, z) => num.get(a[0])! - num.get(z[0])!)) {
            const bd = brand.beads[b]!
            font(8, 'normal')
            const label = `${num.get(b)}   ${bd.code}  × ${n}`
            const w = doc.getTextWidth(label) + 11
            if (lx + w > PW - M) { lx = M; ly += 7 }
            if (ly > PH - 18) break
            fill('#F5F6F9'); doc.roundedRect(lx, ly - 4.3, w, 6.2, 3.1, 3.1, 'F')
            bead(lx + 3.4, ly - 1.2, 1.9, bd.hex)
            font(8, 'normal'); doc.text(label, lx + 7, ly)
            lx += w + 2
        }
    }

    const axis = (x0: number, x1: number, y0: number, y1: number, gx: number, gy: number, s: number) => {
        font(6, 'normal', MUTED)
        for (let x = x0; x < x1; x++) if ((x + 1) % 5 === 0 || x === x0) {
            doc.text(`${x + 1}`, gx + (x - x0) * s + s / 2, gy - 1.3, {align: 'center'})
        }
        for (let yy = y0; yy < y1; yy++) if ((yy + 1) % 5 === 0 || yy === y0) {
            doc.text(`${yy + 1}`, gx - 1.6, gy + (yy - y0) * s * aspect + s * aspect / 2 + 0.9, {align: 'right'})
        }
    }

    if (craft.boards) {
        // --- One page per board -----------------------------------------------------
        const {cols, rows} = boardsOf(grid.width, grid.height)
        const gx = M + 6, gy = M + 20
        const size = (PW - M - gx) / BOARD
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            doc.addPage()
            pageHead(cols * rows > 1 ? `Board ${boardLabel(r, c)}` : 'Board',
                `Columns ${c * BOARD + 1}–${Math.min(grid.width, (c + 1) * BOARD)}, rows ${r * BOARD + 1}–${Math.min(grid.height, (r + 1) * BOARD)} of ${grid.width} × ${grid.height}`)
            miniMap(cols, rows, r * cols + c)
            const used = cells(c * BOARD, (c + 1) * BOARD, r * BOARD, (r + 1) * BOARD, gx, gy, size)
            // Pegs outside the pattern still show, so the page matches the board.
            stroke('#E3E6EC'); doc.setLineWidth(0.1)
            for (let yy = 0; yy < BOARD; yy++) for (let xx = 0; xx < BOARD; xx++) {
                if (c * BOARD + xx >= grid.width || r * BOARD + yy >= grid.height) doc.rect(gx + xx * size, gy + yy * size, size, size)
            }
            // Heavier guide every 5 pegs makes counting on the board easier.
            stroke(INK)
            for (let i = 5; i < BOARD; i += 5) {
                doc.setLineWidth(i % 10 === 0 ? 0.35 : 0.2)
                doc.line(gx + i * size, gy, gx + i * size, gy + BOARD * size)
                doc.line(gx, gy + i * size, gx + BOARD * size, gy + i * size)
            }
            doc.setLineWidth(0.45); doc.rect(gx, gy, BOARD * size, BOARD * size)
            axis(0, BOARD, 0, BOARD, gx, gy, size)
            legend(used, gy + BOARD * size + 10)
        }
    } else {
        // --- Chart in page-sized parts ----------------------------------------------
        const gx = M + 8, gy = M + 20
        const areaW = PW - M - gx - 2, areaH = PH - gy - 50
        // Cells stay big enough to read a number in; big patterns split into parts.
        const s = Math.max(4.2, Math.min(8, areaW / (grid.width + 0.5), areaH / ((grid.height + 0.5) * aspect)))
        const perColN = Math.max(1, Math.floor(areaW / s - (craft.layout === 'brick' ? 0.5 : 0)))
        const perRowN = Math.max(1, Math.floor(areaH / (s * aspect) - (craft.layout === 'peyote' ? 0.5 : 0)))
        const partsX = Math.ceil(grid.width / perColN), partsY = Math.ceil(grid.height / perRowN)
        for (let py = 0; py < partsY; py++) for (let px2 = 0; px2 < partsX; px2++) {
            doc.addPage()
            const x0 = px2 * perColN, x1 = Math.min(grid.width, x0 + perColN)
            const y0 = py * perRowN, y1 = Math.min(grid.height, y0 + perRowN)
            const n = py * partsX + px2 + 1
            pageHead(partsX * partsY > 1 ? `Chart, part ${n} of ${partsX * partsY}` : 'Chart', `Columns ${x0 + 1}–${x1}, rows ${y0 + 1}–${y1} of ${grid.width} × ${grid.height}`)
            miniMap(partsX, partsY, n - 1)
            const used = cells(x0, x1, y0, y1, gx, gy, s)
            axis(x0, x1, y0, y1, gx, gy, s)
            const chartH = (y1 - y0 + (craft.layout === 'peyote' ? 0.5 : 0)) * s * aspect
            legend(used, gy + chartH + 10)
        }

        // --- Written chart ------------------------------------------------------------
        if (craft.rowOrder) {
            const rows = wordChart(grid, craft.rowOrder)
            let ly = 0, zebra = 0
            const newPage = (first: boolean) => {
                doc.addPage()
                pageHead('Row by row', first ? '"4 × 2" means four of colour 2. Arrows show which way to work.' : 'Continued')
                ly = M + 22
                // Colour key, so the numbers read without turning back to page 1.
                let kx = M
                for (const c of counts) {
                    const bd = brand.beads[c.index]!
                    font(7.5, 'normal')
                    const label = `${num.get(c.index)} ${bd.code}`
                    const w = doc.getTextWidth(label) + 9
                    if (kx + w > PW - M) { kx = M; ly += 6 }
                    fill('#F5F6F9'); doc.roundedRect(kx, ly - 4, w, 5.6, 2.8, 2.8, 'F')
                    bead(kx + 3, ly - 1.2, 1.6, bd.hex)
                    font(7.5, 'normal'); doc.text(label, kx + 6, ly)
                    kx += w + 1.5
                }
                ly += 9
            }
            newPage(true)
            for (const r of rows) {
                font(9, 'normal')
                const runs = r.runs.map(u => (u.bead < 0 ? `skip ${u.count}` : `${u.count} × ${num.get(u.bead)}`)).join(',   ')
                const body = doc.splitTextToSize(runs || 'no beads', PW - 2 * M - 40)
                const h = Math.max(7, body.length * 4.4 + 2.6)
                if (ly + h > PH - 16) { newPage(false); zebra = 0 }
                if (zebra++ % 2 === 0) { fill('#F5F6F9'); doc.rect(M, ly - 4.6, PW - 2 * M, h, 'F') }
                font(9, 'bold'); doc.text(r.label, M + 2, ly)
                // Direction arrow.
                const ax = M + 26, ay = ly - 1.4
                fill(ACCENT)
                if (r.dir === 'ltr') doc.triangle(ax + 5, ay, ax + 2, ay - 1.8, ax + 2, ay + 1.8, 'F')
                else doc.triangle(ax, ay, ax + 3, ay - 1.8, ax + 3, ay + 1.8, 'F')
                stroke(ACCENT); doc.setLineWidth(0.5)
                doc.line(r.dir === 'ltr' ? ax : ax + 2.5, ay, r.dir === 'ltr' ? ax + 2.5 : ax + 5, ay)
                font(9, 'normal'); doc.text(body, M + 36, ly)
                ly += h
            }
        }
    }

    // Footers last, so every page can say "page x of y".
    const pages = doc.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i)
        stroke(LINE); doc.setLineWidth(0.2); doc.line(M, PH - 11, PW - M, PH - 11)
        mark(M, PH - 8.2, 1.3)
        font(7.5, 'normal', MUTED)
        doc.text(`${title} · ${site}`, M + 4.5, PH - 6)
        doc.text(`Page ${i} of ${pages}`, PW - M, PH - 6, {align: 'right'})
    }

    return doc.output('blob')
}
