// Bead grid → the shared SharedPage shape (colours + "x_y" map), and back.
import type {Brand} from './brands'
import type {BeadGrid} from './pattern'

export interface ArtPayload {
    width: number
    height: number
    colors: string[]
    map_numbers: Record<string, number>
    layers: { x: number; y: number; name: string; pixels: Record<string, number> }[]
}

export function gridToArt(grid: BeadGrid, brand: Brand): ArtPayload {
    const index = new Map<number, number>()
    const colors: string[] = []
    const map: Record<string, number> = {}
    for (let y = 0; y < grid.height; y++) for (let x = 0; x < grid.width; x++) {
        const b = grid.cells[y * grid.width + x]!
        if (b < 0) continue
        let c = index.get(b)
        if (c === undefined) { c = colors.length; colors.push(brand.beads[b]!.hex); index.set(b, c) }
        map[`${x}_${y}`] = c
    }
    return {width: grid.width, height: grid.height, colors, map_numbers: map, layers: [{x: 0, y: 0, name: 'Layer 1', pixels: map}]}
}
