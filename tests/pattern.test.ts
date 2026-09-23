import {describe, expect, test} from 'bun:test'
import {FONT_HEIGHT, GLYPHS, normalise, textToSource} from '../app/helper/beads/font'
import {decodeDone, encodeDone, patternKey} from '../app/helper/beads/progress'
import {gridToArt} from '../app/helper/beads/share'
import {BRAND_IDS, getBrand} from '../app/helper/beads/brands'
import {applyEdits, applySwaps, boardLabel, boardsOf, countBeads, floodRegion, gridFromMapNumbers, lineCells, matchToBeads, wordChart} from '../app/helper/beads/pattern'

describe('brands', () => {
    test('every brand has beads with codes and hex', () => {
        for (const id of BRAND_IDS) {
            const b = getBrand(id)
            expect(b.beads.length).toBeGreaterThan(20)
            for (const bead of b.beads) expect(bead.hex).toMatch(/^#[0-9A-F]{6}$/)
        }
    })
})

describe('matchToBeads', () => {
    const perler = getBrand('perler')

    test('an exact bead colour maps to that bead', () => {
        const target = perler.beads.find(b => !b.special)!
        const grid = matchToBeads({width: 1, height: 1, cells: [target.rgb]}, perler, {maxColors: 10})
        expect(perler.beads[grid.cells[0]!]!.code).toBe(target.code)
    })

    test('empty cells stay empty', () => {
        const grid = matchToBeads({width: 2, height: 1, cells: [null, [0, 0, 0]]}, perler, {maxColors: 10})
        expect(grid.cells[0]).toBe(-1)
        expect(grid.cells[1]).toBeGreaterThanOrEqual(0)
    })

    test('respects maxColors and keeps a small distinct detail', () => {
        // Mostly two close greens plus a single black "eye".
        const cells: [number, number, number][] = []
        for (let i = 0; i < 50; i++) cells.push([60, 170, 70])
        for (let i = 0; i < 50; i++) cells.push([70, 185, 85])
        cells.push([0, 0, 0])
        const grid = matchToBeads({width: cells.length, height: 1, cells}, perler, {maxColors: 2})
        const used = countBeads(grid)
        expect(used.length).toBeLessThanOrEqual(2)
        expect(perler.beads[grid.cells[100]!]!.name).toBe('Black')
    })

    test('special beads are skipped unless asked for', () => {
        const hama = getBrand('hama')
        const clear = hama.beads.find(b => b.special)!
        const off = matchToBeads({width: 1, height: 1, cells: [clear.rgb]}, hama, {maxColors: 5})
        expect(hama.beads[off.cells[0]!]!.special).toBeFalsy()
        const on = matchToBeads({width: 1, height: 1, cells: [clear.rgb]}, hama, {maxColors: 5, includeSpecial: true})
        expect(hama.beads[on.cells[0]!]!.code).toBe(clear.code)
    })

    test('dither stays within the reduced palette', () => {
        const cells: [number, number, number][] = []
        for (let i = 0; i < 64; i++) cells.push([i * 4, i * 4, i * 4])
        const grid = matchToBeads({width: 8, height: 8, cells}, perler, {maxColors: 3, dither: true})
        expect(countBeads(grid).length).toBeLessThanOrEqual(3)
    })
})

describe('helpers', () => {
    test('gridFromMapNumbers reads x_y keys', () => {
        const g = gridFromMapNumbers(3, 2, ['#FF0000', '#0000FF'], {'2_1': 1, '0_0': 0})
        expect(g.cells[0]).toEqual([255, 0, 0])
        expect(g.cells[1 * 3 + 2]).toEqual([0, 0, 255])
        expect(g.cells[1]).toBeNull()
    })

    test('boards and labels', () => {
        expect(boardsOf(29, 29)).toEqual({cols: 1, rows: 1})
        expect(boardsOf(30, 58)).toEqual({cols: 2, rows: 2})
        expect(boardLabel(1, 2)).toBe('B3')
    })

    test('applySwaps replaces and removes', () => {
        const g = {width: 3, height: 1, cells: new Int16Array([0, 1, -1])}
        expect([...applySwaps(g, {0: 5, 1: -1}).cells]).toEqual([5, -1, -1])
    })
})

describe('colour distance', () => {
    test('pure black matches the black bead of each brand', () => {
        for (const id of ['perler', 'hama', 'artkal'] as const) {
            const brand = getBrand(id)
            const g = matchToBeads({width: 1, height: 1, cells: [[0, 0, 0]]}, brand, {maxColors: 10})
            expect(brand.beads[g.cells[0]!]!.name).toBe('Black')
        }
    })

    test('pure white matches a white bead', () => {
        const perler = getBrand('perler')
        const g = matchToBeads({width: 1, height: 1, cells: [[255, 255, 255]]}, perler, {maxColors: 10})
        expect(perler.beads[g.cells[0]!]!.name).toMatch(/white/i)
    })
})

describe('edits', () => {
    const perler = getBrand('perler')
    const hama = getBrand('hama')

    test('brush sets a bead, eraser clears it', () => {
        const g = {width: 3, height: 1, cells: new Int16Array([0, 0, 0])}
        const out = applyEdits(g, {0: perler.beads[5]!.hex, 2: null}, perler)
        expect([...out.cells]).toEqual([5, 0, -1])
    })

    test('a painted colour maps to the closest bead of another brand', () => {
        const white = perler.beads.find(b => b.name === 'White')!
        const g = {width: 1, height: 1, cells: new Int16Array([-1])}
        const out = applyEdits(g, {0: white.hex}, hama)
        expect(hama.beads[out.cells[0]!]!.name).toBe('White')
    })

    test('lineCells has no gaps', () => {
        const pts = lineCells(0, 0, 5, 2)
        expect(pts[0]).toEqual([0, 0])
        expect(pts.at(-1)).toEqual([5, 2])
        for (let i = 1; i < pts.length; i++) {
            expect(Math.abs(pts[i]![0] - pts[i - 1]![0])).toBeLessThanOrEqual(1)
            expect(Math.abs(pts[i]![1] - pts[i - 1]![1])).toBeLessThanOrEqual(1)
        }
    })
})

describe('word chart', () => {
    // 4 columns × 2 rows:  row0: 0 0 1 1   row1: 2 -1 2 2
    const g = {width: 4, height: 2, cells: new Int16Array([0, 0, 1, 1, 2, -1, 2, 2])}

    test('left to right runs', () => {
        const rows = wordChart(g, 'ltr')
        expect(rows[0]!.runs).toEqual([{bead: 0, count: 2}, {bead: 1, count: 2}])
        expect(rows[1]!.runs).toEqual([{bead: 2, count: 1}, {bead: -1, count: 1}, {bead: 2, count: 2}])
    })

    test('zigzag reverses every other row', () => {
        const rows = wordChart(g, 'zigzag')
        expect(rows[1]!.dir).toBe('rtl')
        expect(rows[1]!.runs).toEqual([{bead: 2, count: 2}, {bead: -1, count: 1}, {bead: 2, count: 1}])
    })

    test('peyote: rows 1 & 2 together, then every other column', () => {
        const rows = wordChart(g, 'peyote')
        expect(rows.map(r => r.label)).toEqual(['Rows 1 & 2', 'Row 3', 'Row 4'])
        expect(rows[0]!.runs).toEqual([{bead: 0, count: 2}, {bead: 1, count: 2}])
        // Row 3: columns 2 and 0 of row 1, right to left.
        expect(rows[1]!.label).toBe('Row 3')
        expect(rows[1]!.dir).toBe('rtl')
        expect(rows[1]!.runs).toEqual([{bead: 2, count: 2}])
        // Grid indices of row 1 (y = 1), even columns, right to left.
        expect(rows[1]!.cells).toEqual([6, 4])
        // Row 4: columns 1 and 3, left to right; column 1 is empty.
        expect(rows[2]!.runs).toEqual([{bead: 2, count: 1}])
    })

    test('leading and trailing gaps are trimmed', () => {
        const s = {width: 5, height: 1, cells: new Int16Array([-1, 3, 3, -1, -1])}
        expect(wordChart(s, 'ltr')[0]!.runs).toEqual([{bead: 3, count: 2}])
    })
})

describe('bead letters', () => {
    test('every glyph is 7 rows of equal width', () => {
        for (const [ch, g] of Object.entries(GLYPHS)) {
            expect(g.length, ch).toBe(FONT_HEIGHT)
            for (const row of g) expect(row.length, ch).toBe(g[0]!.length)
        }
    })

    test('word size, spacing and padding', () => {
        const src = textToSource({text: 'hi', letter: [0, 0, 0], background: [255, 255, 255], spacing: 1, padding: 1})!
        // H is 5 wide, I is 3 wide, 1 space between, 1 padding each side.
        expect(src.width).toBe(5 + 1 + 3 + 2)
        expect(src.height).toBe(7 + 2)
        expect(src.cells[0]).toEqual([255, 255, 255])
        expect(src.cells[1 * src.width + 1]).toEqual([0, 0, 0])
    })

    test('<3 becomes a heart and unknown characters are dropped', () => {
        expect(normalise('a<3b~')).toBe('A♥B')
    })

    test('no background leaves empty cells', () => {
        const src = textToSource({text: 'I', letter: [0, 0, 0], background: null, spacing: 1, padding: 0})!
        expect(src.cells.filter(c => c === null).length).toBe(21 - 11)
    })
})

describe('flood fill', () => {
    test('fills the connected same-colour region only', () => {
        // 0 0 1
        // 1 0 1
        // 0 1 1
        const g = {width: 3, height: 3, cells: new Int16Array([0, 0, 1, 1, 0, 1, 0, 1, 1])}
        expect(floodRegion(g, 0, 0).sort((a, b) => a - b)).toEqual([0, 1, 4])
        expect(floodRegion(g, 2, 0).sort((a, b) => a - b)).toEqual([2, 5, 7, 8])
        expect(floodRegion(g, 0, 2)).toEqual([6])
    })
})

describe('build progress', () => {
    test('bitset round-trips', () => {
        const done = new Uint8Array(21)
        ;[0, 3, 8, 20].forEach(i => { done[i] = 1 })
        expect([...decodeDone(encodeDone(done), 21)]).toEqual([...done])
    })

    test('key changes with the pattern', () => {
        const a = {width: 2, height: 1, cells: new Int16Array([1, 2])}
        const b = {width: 2, height: 1, cells: new Int16Array([2, 1])}
        expect(patternKey(a, 'perler', 'fuse')).not.toBe(patternKey(b, 'perler', 'fuse'))
        expect(patternKey(a, 'perler', 'fuse')).not.toBe(patternKey(a, 'hama', 'fuse'))
        expect(patternKey(a, 'perler', 'fuse')).toBe(patternKey({...a}, 'perler', 'fuse'))
    })
})

describe('my colours', () => {
    test('only uses owned beads', () => {
        const perler = getBrand('perler')
        const red = perler.beads.find(b => b.name === 'Red')!
        const white = perler.beads.find(b => b.name === 'White')!
        const g = matchToBeads({width: 2, height: 1, cells: [red.rgb, [250, 250, 250]]}, perler, {maxColors: 10, only: new Set([white.code])})
        expect([...g.cells].map(i => perler.beads[i]!.code)).toEqual([white.code, white.code])
    })
})

describe('save to library', () => {
    test('grid → colours and x_y map, and back', () => {
        const perler = getBrand('perler')
        const g = {width: 3, height: 2, cells: new Int16Array([4, -1, 4, 7, 7, -1])}
        const art = gridToArt(g, perler)
        expect(art.colors).toEqual([perler.beads[4]!.hex, perler.beads[7]!.hex])
        expect(art.map_numbers).toEqual({'0_0': 0, '2_0': 0, '0_1': 1, '1_1': 1})
        const back = matchToBeads(gridFromMapNumbers(3, 2, art.colors, art.map_numbers), perler, {maxColors: 10, includeSpecial: true})
        expect([...back.cells]).toEqual([...g.cells])
    })
})
