import type {Brand} from './brands'
import type {Craft} from './crafts'
import {canvasSize} from './draw'
import {boardsOf, type BeadGrid} from './pattern'

// Facts about a pattern: size, boards or threads, bead count, finished size.
export function sizeParts(grid: BeadGrid, brand: Brand, craft: Craft): string[] {
    const unit = brand.unit
    const total = grid.cells.reduce((s, b) => s + (b >= 0 ? 1 : 0), 0)
    const parts = [`${grid.width} × ${grid.height} ${unit}s`]
    if (craft.boards) {
        const {cols, rows} = boardsOf(grid.width, grid.height)
        parts.push(`${cols * rows} board${cols * rows > 1 ? 's' : ''}`)
    }
    parts.push(`${total.toLocaleString('en')} ${unit}${total === 1 ? '' : 's'}`, ...craft.extras(grid.width, grid.height))
    if (craft.cellMm) {
        const {W, H} = canvasSize(grid, {cw: craft.cellMm.w, ch: craft.cellMm.h, layout: craft.layout})
        parts.push(`about ${(W / 10).toFixed(1)} × ${(H / 10).toFixed(1)} cm`)
    }
    return parts
}

export const sizeLine = (grid: BeadGrid, brand: Brand, craft: Craft) => sizeParts(grid, brand, craft).join(', ')
