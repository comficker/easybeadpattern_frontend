// Builds app/data/beads.json from the palette CSVs. Re-run after editing them.
// - data/beadcolors/: fuse bead brands, github.com/maxcleme/beadcolors (MIT)
// - data/own/dmc.csv: exported from ninosaur_backend apps/coloring/dmc.py
// - data/own/pony.csv, seed.csv: our own generic palettes (no brand codes)
import {readFileSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'

const ROOT = join(import.meta.dir, '..')
const FILES: Record<string, string> = {
    perler: 'beadcolors/perler.csv',
    hama: 'beadcolors/hama.csv',
    artkal: 'beadcolors/artkal_s.csv',
    nabbi: 'beadcolors/nabbi.csv',
    mard: 'beadcolors/mard.csv',
    pony: 'own/pony.csv',
    seed: 'own/seed.csv',
    dmc: 'own/dmc.csv',
}
// Beads whose look is not a flat opaque colour. They stay in the colour charts
// but are left out of automatic matching by default.
const SPECIAL = /clear|transparent|translucent|glitter|glow|pearl|metallic|silver|gold\b|copper|bronze|neon|fluorescent|stripe/i

const hex = (n: number) => n.toString(16).padStart(2, '0')
const out: Record<string, { code: string; name: string; hex: string; special?: true }[]> = {}

for (const [brand, file] of Object.entries(FILES)) {
    const seen = new Set<string>()
    const rows = readFileSync(join(ROOT, 'data', file), 'utf8').trim().split('\n')
    out[brand] = []
    for (const line of rows) {
        const [code, name, r, g, b] = line.split(',')
        if (!code || seen.has(code)) continue
        seen.add(code)
        const color = `#${hex(+r!)}${hex(+g!)}${hex(+b!)}`.toUpperCase()
        const entry: { code: string; name: string; hex: string; special?: true } = {code, name: name!.trim(), hex: color}
        // Floss names such as "Old Gold" are plain cotton, not a special finish.
        if (brand !== 'dmc' && SPECIAL.test(name!)) entry.special = true
        out[brand].push(entry)
    }
    console.log(brand, out[brand].length)
}

writeFileSync(join(ROOT, 'app/data/beads.json'), JSON.stringify(out))
