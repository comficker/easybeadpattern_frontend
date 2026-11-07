// What a brand landing page says about its brand.
//
// Every sentence here is derived from the palette we actually ship, never
// written per brand by hand: the palettes differ enough on their own (Nabbi
// has 30 colours, MARD 291) that counted facts say more than copy would, and
// a counted fact cannot go stale when `bun run palettes` rebuilds the data.
//
// Pure TS, relative imports, so `bun test` can read it without Nuxt.

import type {Brand} from './brands'
import type {RGB} from '../color'

export interface PaletteFacts {
    total: number
    regular: number
    special: number
    // The first few real codes, to show what this brand's codes look like.
    codes: string[]
    // Hue families of the regular beads, largest first.
    families: { name: string; count: number }[]
    neutrals: number
}

const FAMILIES = [
    {name: 'reds', to: 15},
    {name: 'oranges and browns', to: 45},
    {name: 'yellows', to: 70},
    {name: 'greens', to: 160},
    {name: 'turquoises', to: 200},
    {name: 'blues', to: 260},
    {name: 'purples', to: 290},
    {name: 'pinks', to: 345},
]

// Hue in degrees, plus a saturation floor: a bead with almost no colour left
// is a grey, not a very dark red.
function familyOf(rgb: RGB): string {
    const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
    const l = (max + min) / 2
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
    if (s < 0.15) return 'neutrals'
    let h = 0
    if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6
        else if (max === g) h = (b - r) / d + 2
        else h = (r - g) / d + 4
    }
    h = (h * 60 + 360) % 360
    return (FAMILIES.find(f => h < f.to) ?? FAMILIES[0]!).name
}

export function paletteFacts(brand: Brand): PaletteFacts {
    const regular = brand.beads.filter(b => !b.special)
    const counts = new Map<string, number>()
    for (const b of regular) {
        const f = familyOf(b.rgb)
        counts.set(f, (counts.get(f) ?? 0) + 1)
    }
    const families = [...counts]
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    return {
        total: brand.beads.length,
        regular: regular.length,
        special: brand.beads.length - regular.length,
        codes: brand.beads.slice(0, 3).map(b => b.code),
        families,
        neutrals: counts.get('neutrals') ?? 0,
    }
}

const list = (parts: string[]) =>
    parts.length < 2 ? (parts[0] ?? '') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`

// How a palette of this size behaves in the matcher. The boundaries are the
// ones the maker itself cares about: under ~40 colours there is no shade to
// pick from and photos band; past ~150 there are several near-identical
// shades of everything and the colour limit does the real work.
function sizeAdvice(f: PaletteFacts): string {
    if (f.regular < 40) {
        return `With ${f.regular} regular colours to match against, this is a short palette. It suits flat, bold work: icons, logos, sprites and lettering, where a handful of strong colours is the point. A photograph matched to it will band, because there is no near shade to step through.`
    }
    if (f.regular < 150) {
        return `${f.regular} regular colours is enough shade for faces and skies to step smoothly, and still few enough that the bead list stays something you can buy. Most photos look right here without touching the colour limit.`
    }
    return `At ${f.regular} regular colours this is one of the longest palettes we carry: several near-identical shades of most hues. That helps photographs and gradients, but it also means the matcher will happily pick twenty blues, so the colour limit is the control that matters most on this brand.`
}

export interface BrandSection {
    heading: string
    paragraphs: string[]
    list?: string[]
}

export function brandSections(brand: Brand, f = paletteFacts(brand)): BrandSection[] {
    const top = f.families.filter(x => x.name !== 'neutrals').slice(0, 3).map(x => `${x.count} ${x.name}`)
    const out: BrandSection[] = [{
        heading: `What the ${brand.name} palette holds`,
        paragraphs: [
            f.special
                ? `Our ${brand.name} chart carries ${f.total} colours: ${f.regular} regular, and ${f.special} clear, glitter, glow, pearl, metallic or neon ${f.special === 1 ? 'bead that is' : 'beads that are'} left out of matching unless you ask for ${f.special === 1 ? 'it' : 'them'}. Codes look like ${f.codes.join(', ')}.`
                : `Our ${brand.name} chart carries ${f.total} colours, all of them plain: no clear, glitter, glow or neon finishes to leave out of a match. Codes look like ${f.codes.join(', ')}.`,
            `By hue that is ${list(top)}${f.neutrals ? `, plus ${f.neutrals} neutral greys, whites and blacks, which are the ones that carry a photograph` : ''}.`,
        ],
    }, {
        heading: `What it is good at`,
        paragraphs: [sizeAdvice(f)],
    }, {
        heading: `Using beads you already own`,
        paragraphs: [
            `Tick the colours you have on the ${brand.name} colour chart and the maker will match your image to those only, instead of to all ${f.regular}. It is the difference between a pattern you can build tonight and a shopping list.`,
        ],
    }]
    return out
}

export function brandFaq(brand: Brand, f = paletteFacts(brand)): { q: string; a: string }[] {
    return [
        {
            q: `How many ${brand.name} colours can the pattern use?`,
            a: `All ${f.regular} colours in the ${brand.line} chart${f.special ? `, plus ${f.special} special ${f.special === 1 ? 'finish' : 'finishes'} if you turn ${f.special === 1 ? 'it' : 'them'} on` : ''}. You can also cap the pattern at any number of colours, and the matcher drops the least useful ones first.`,
        },
        {
            q: `What do ${brand.name} codes look like?`,
            a: `${f.codes.join(', ')} and so on. Every colour in the pattern and in the printed PDF is labelled with its real ${brand.name} code, so the bead list is something you can order from.`,
        },
        {
            q: `Can I switch a ${brand.name} pattern to another brand?`,
            a: `Yes. Patterns are stored as colours, not as bead codes, so changing the brand matches the whole image again to that brand's real shades. It will not be colour for colour: no two brands share a palette.`,
        },
        {
            q: `How big a pegboard do I need?`,
            a: `One large square board holds 29 x 29 beads. The maker splits anything larger into boards and prints one page each, so a 58 x 58 pattern is four boards.`,
        },
    ]
}
