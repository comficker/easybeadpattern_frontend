// Renders the Open Graph cards (1200×630) and the logo into public/og/.
// Needs a local Chrome: CHROME_PATH=/path/to/chrome bun run og
// Re-run after changing titles, crafts, brands or guides.
import {chromium} from 'playwright-core'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public/og')
const palettes = JSON.parse(readFileSync(join(ROOT, 'app/data/beads.json'), 'utf8'))
const font = `file://${join(ROOT, 'public/fonts/rubik-latin.woff2')}`

// Heart, 11 × 10: the motif on every card.
const HEART = [
    '..###.###..', '.#########.', '###########', '###########', '###########',
    '.#########.', '..#######..', '...#####...', '....###....', '.....#.....',
]

const hue = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
    if (!d) return 999 + r
    const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
    return (h * 60 + 360) % 360 + (mx - mn < 0.25 ? 400 : 0)
}

// Warm-to-cool strip of saturated colours from a palette.
function motifColors(id) {
    const beads = palettes[id].filter(b => !b.special).map(b => b.hex)
    const sat = beads.filter(h => {
        const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
        return Math.max(r, g, b) - Math.min(r, g, b) > 70
    }).sort((a, b) => hue(a) - hue(b))
    const step = Math.max(1, Math.floor(sat.length / 10))
    return Array.from({length: 10}, (_, i) => sat[Math.min(sat.length - 1, i * step)])
}

function motif(id, shape) {
    const cols = motifColors(id)
    const s = 36, pad = 4
    let out = ''
    HEART.forEach((row, y) => [...row].forEach((c, x) => {
        const px = x * s, py = y * s
        if (c !== '#') { out += `<circle cx="${px + s / 2}" cy="${py + s / 2}" r="3" fill="#D3D8E2"/>`; return }
        const fill = cols[Math.min(cols.length - 1, y)]
        if (shape === 'tube') out += `<rect x="${px + pad}" y="${py + 2}" width="${s - 2 * pad}" height="${s - 4}" rx="7" fill="${fill}"/>`
        else if (shape === 'knot') out += `<rect x="${px + 2}" y="${py + 2}" width="${s - 4}" height="${s - 4}" rx="10" fill="${fill}"/><path d="M${px + 9} ${py + 11} L${px + 18} ${py + 25} L${px + 27} ${py + 11}" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" stroke-linecap="round"/>`
        else out += `<circle cx="${px + s / 2}" cy="${py + s / 2}" r="${s * 0.46}" fill="${fill}"/><circle cx="${px + s / 2}" cy="${py + s / 2}" r="${s * 0.16}" fill="#E9ECF2"/>`
    }))
    return `<svg width="${11 * s}" height="${10 * s}" viewBox="0 0 ${11 * s} ${10 * s}">${out}</svg>`
}

function swatches(id) {
    const beads = palettes[id].filter(b => !b.special).map(b => b.hex).sort((a, b) => hue(a) - hue(b))
    const n = Math.min(70, beads.length), step = beads.length / n
    const pick = Array.from({length: n}, (_, i) => beads[Math.floor(i * step)])
    return `<div class="sw">${pick.map(h => `<i style="background:${h}"></i>`).join('')}</div>`
}

const page = (title, sub, art) => `<!doctype html><html><head><style>
@font-face{font-family:Rubik;src:url(${font}) format('woff2');font-weight:400 700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;font-family:Rubik,sans-serif;background:#fff;color:#1F2A44;display:flex}
.l{flex:1;padding:64px 40px 64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700}
.mark{display:grid;grid-template-columns:repeat(2,16px);gap:4px}
.mark i{width:16px;height:16px;border-radius:50%;box-shadow:inset 0 0 0 4.5px currentColor}
h1{font-size:${title.length > 34 ? 58 : 68}px;line-height:1.06;letter-spacing:-.02em;font-weight:700}
p{font-size:28px;line-height:1.35;color:#5B6475;margin-top:22px;max-width:560px}
.r{width:500px;background:#E9ECF2;display:grid;place-items:center}
.sw{display:grid;grid-template-columns:repeat(7,48px);gap:10px}
.sw i{width:48px;height:48px;border-radius:50%;position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}
.sw i::after{content:'';position:absolute;inset:16px;border-radius:50%;background:#E9ECF2}
</style></head><body>
<div class="l"><div class="brand"><span class="mark"><i style="color:#E23E6B"></i><i style="color:#F4B400"></i><i style="color:#2F9E6B"></i><i style="color:#3D6BFF"></i></span>EasyBeadPattern</div>
<div><h1>${title}</h1><p>${sub}</p></div><div></div></div>
<div class="r">${art}</div></body></html>`

const BRANDS = {perler: 'Perler', hama: 'Hama', artkal: 'Artkal', nabbi: 'Nabbi', mard: 'MARD'}
const CRAFTS = {
    kandi: ['Kandi pattern maker', 'Cuffs and singles for pony beads, row by row.', 'pony', 'bead'],
    loom: ['Bead loom pattern maker', 'True bead proportions, warp count and a written chart.', 'seed', 'tube'],
    peyote: ['Peyote pattern maker', 'Offset columns and a word chart from rows 1 and 2.', 'seed', 'tube'],
    brick: ['Brick stitch pattern maker', 'Earrings and motifs with offset rows.', 'seed', 'tube'],
    friendship: ['Friendship bracelet pattern maker', 'Alpha patterns matched to DMC floss.', 'dmc', 'knot'],
}
const GUIDES = {
    'how-to-turn-a-photo-into-a-bead-pattern': 'How to turn a photo into a bead pattern',
    'how-to-read-a-bead-pattern': 'How to read a bead pattern',
    'perler-vs-hama-vs-artkal': 'Perler vs Hama vs Artkal vs MARD',
    'how-to-iron-fuse-beads': 'How to iron fuse beads',
}

const cards = [
    ['default', 'Turn any image into a bead pattern', 'Real Perler, Hama, Artkal and MARD colours, counts and a page per pegboard. Free.', motif('perler', 'bead')],
    ['designer', 'Draw your own bead pattern', 'Brush, fill and eraser on a blank board, in real bead colours.', motif('hama', 'bead')],
    ['beadwork', 'Beadwork pattern makers', 'Kandi, bead loom, peyote, brick stitch and friendship bracelets.', motif('seed', 'tube')],
    ['letters', 'Bead letters', 'Any word as a 7-bead-tall pattern for kandi, pegboards or bracelets.', motif('pony', 'bead')],
    ['patterns', 'Free bead patterns', 'Open any design in Perler, Hama, Artkal, Nabbi or MARD colours.', motif('artkal', 'bead')],
    ['colors', 'Bead colour charts', 'Every code, name and hex for Perler, Hama, Artkal, Nabbi, MARD and DMC.', swatches('artkal')],
    ['guides', 'Bead pattern guides', 'From choosing a photo to ironing the finished piece.', motif('mard', 'bead')],
    ...Object.entries(BRANDS).map(([id, name]) => [`brand-${id}`, `${name} bead pattern maker`, `Any image as a ${name} pattern, matched to ${palettes[id].length} real colours.`, motif(id, 'bead')]),
    ...Object.entries(BRANDS).map(([id, name]) => [`chart-${id}`, `${name} colour chart`, `All ${palettes[id].length} ${name} colours with code, name and hex.`, swatches(id)]),
    ['chart-dmc', 'DMC floss colour chart', `${palettes.dmc.length} DMC floss colours with number, name and hex.`, swatches('dmc')],
    ...Object.entries(CRAFTS).map(([id, [t, s, pal, shape]]) => [`craft-${id}`, t, s, motif(pal, shape)]),
    ...Object.entries(GUIDES).map(([slug, t]) => [`guide-${slug}`, t, 'A short guide from EasyBeadPattern.', motif('perler', 'bead')]),
]

const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'})
const p = await (await browser.newContext({viewport: {width: 1200, height: 630}})).newPage()
for (const [name, title, sub, art] of cards) {
    await p.setContent(page(title, sub, art), {waitUntil: 'load'})
    await p.evaluate(() => document.fonts.ready)
    await p.screenshot({path: join(OUT, `${name}.png`)})
}
// Square logo for structured data and the home-screen icon.
for (const [name, size] of [['logo', 512], ['apple-touch-icon', 180]]) {
    await p.setViewportSize({width: size, height: size})
    const d = size / 5
    await p.setContent(`<body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:#fff"><div style="display:grid;grid-template-columns:repeat(2,${d}px);gap:${d / 4}px">${['#E23E6B', '#F4B400', '#2F9E6B', '#3D6BFF'].map(c => `<i style="width:${d}px;height:${d}px;border-radius:50%;box-shadow:inset 0 0 0 ${d * 0.28}px ${c}"></i>`).join('')}</div></body>`)
    await p.screenshot({path: join(OUT, `${name}.png`)})
}
await browser.close()
console.log(`${cards.length + 2} images in public/og/`)
