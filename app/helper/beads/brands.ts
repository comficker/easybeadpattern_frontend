import data from '../../data/beads.json'
import {hexToRgb, rgbToLab, type Lab, type RGB} from '../color'

// Fuse bead brands (pegboard crafts).
export type BrandId = 'perler' | 'hama' | 'artkal' | 'nabbi' | 'mard'
// Every palette the crafts can use: fuse brands, generic pony and seed beads
// (our own palettes, no brand codes) and DMC embroidery floss.
export type PaletteId = BrandId | 'pony' | 'seed' | 'dmc'

export interface Bead {
    code: string
    name: string
    hex: string
    special?: boolean
    rgb: RGB
    lab: Lab
}

// A palette of real materials. Named Brand for history: most palettes are one.
export interface Brand {
    id: PaletteId
    name: string
    line: string
    // Fuse brand landing page slug (/<slug>); empty for other palettes.
    slug: string
    blurb: string
    // What one cell is, for labels: "bead" or "knot".
    unit: 'bead' | 'knot'
    beads: Bead[]
}

const META: Record<PaletteId, Omit<Brand, 'id' | 'beads' | 'unit'> & { unit?: Brand['unit'] }> = {
    perler: {
        name: 'Perler', line: 'Perler Midi 5 mm', slug: 'perler-bead-pattern-maker',
        blurb: 'Perler Midi beads, matched by product code and colour name.',
    },
    hama: {
        name: 'Hama', line: 'Hama Midi 5 mm', slug: 'hama-bead-pattern-maker',
        blurb: 'Hama Midi beads, matched by their H-codes (H01, H02 …).',
    },
    artkal: {
        name: 'Artkal', line: 'Artkal S 5 mm', slug: 'artkal-bead-pattern-maker',
        blurb: 'Artkal S beads. A wide range of close shades that helps with photos and gradients.',
    },
    nabbi: {
        name: 'Nabbi', line: 'Nabbi BioBeads 5 mm', slug: 'nabbi-bead-pattern-maker',
        blurb: 'Nabbi BioBeads. A short palette that suits bold, simple designs.',
    },
    mard: {
        name: 'MARD', line: 'MARD 5 mm', slug: 'mard-bead-pattern-maker',
        blurb: 'MARD beads, matched by their letter-number codes (A1, B12 …).',
    },
    pony: {
        name: 'Pony beads', line: 'Pony beads', slug: '',
        blurb: 'The usual pony bead colours sold in mixed packs. Brands do not share codes, so colours are named.',
    },
    seed: {
        name: 'Seed beads', line: 'Seed beads 11/0', slug: '',
        blurb: 'Common opaque seed bead colours. Match each one to the closest shade of your brand, such as Miyuki Delica or Toho.',
    },
    dmc: {
        name: 'DMC', line: 'DMC floss', slug: '', unit: 'knot',
        blurb: 'DMC stranded cotton, matched by floss number.',
    },
}

export const BRAND_IDS: BrandId[] = ['perler', 'hama', 'artkal', 'nabbi', 'mard']
export const PALETTE_IDS = Object.keys(META) as PaletteId[]
// Palettes with a colour chart page: real product codes only.
export const CHART_IDS: PaletteId[] = [...BRAND_IDS, 'dmc']

const cache = new Map<PaletteId, Brand>()

export function getBrand(id: PaletteId): Brand {
    let b = cache.get(id)
    if (!b) {
        const raw = (data as Record<string, { code: string; name: string; hex: string; special?: boolean }[]>)[id] ?? []
        b = {
            id, ...META[id], unit: META[id].unit ?? 'bead',
            beads: raw.map(e => {
                const rgb = hexToRgb(e.hex)
                return {...e, rgb, lab: rgbToLab(rgb)}
            }),
        }
        cache.set(id, b)
    }
    return b
}

export function brandBySlug(slug: string): Brand | null {
    const id = BRAND_IDS.find(k => META[k].slug === slug)
    return id ? getBrand(id) : null
}

export const isBrandId = (v: unknown): v is BrandId => BRAND_IDS.includes(v as BrandId)
export const isPaletteId = (v: unknown): v is PaletteId => PALETTE_IDS.includes(v as PaletteId)

// Patterns are split into boards of the common 29×29 large square pegboard.
export const BOARD = 29
export const BEAD_MM = 5
