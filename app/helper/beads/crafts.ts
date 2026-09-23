import {BOARD, BRAND_IDS, type PaletteId} from './brands'

export type CraftId = 'fuse' | 'kandi' | 'loom' | 'peyote' | 'brick' | 'friendship'
// square: rows and columns line up. peyote: every other column sits half a
// cell lower. brick: every other row sits half a cell to the right.
export type Layout = 'square' | 'peyote' | 'brick'
export type Shape = 'bead' | 'tube' | 'knot'
// Order the written chart walks each row in.
export type RowOrder = 'ltr' | 'zigzag' | 'peyote'

export interface Craft {
    id: CraftId
    name: string
    // Iconsax glyph in public/icons/.
    icon: string
    // Page slug (/<slug>) and heading.
    slug: string
    title: string
    intro: string
    palettes: PaletteId[]
    layout: Layout
    shape: Shape
    // Size of one cell in mm (width × height). Sets the drawn proportions and
    // the finished size. null: proportions 1:1 and no size in cm.
    cellMm: { w: number; h: number } | null
    widths: { label: string; w: number }[]
    defaultWidth: number
    maxWidth: number
    defaultColors: number
    // Split into 29 × 29 pegboards (fuse beads only).
    boards: boolean
    // Written row-by-row instructions in the PDF.
    rowOrder: RowOrder | null
    // Extra facts for the size line, e.g. warp threads.
    extras: (w: number, h: number) => string[]
    steps: { title: string; text: string }[]
    faq: { q: string; a: string }[]
    metaTitle: string
    metaDescription: string
}

const DELICA = {w: 1.3, h: 1.6} // Delica 11/0 ≈ 1.6 mm across, 1.3 mm long

export const CRAFTS: Record<CraftId, Craft> = {
    fuse: {
        id: 'fuse',
        icon: 'bead',
        name: 'Fuse beads',
        slug: '',
        title: 'Turn any image into a bead pattern',
        intro: 'Matched to real Perler, Hama, Artkal, Nabbi and MARD colours, with a bead count and a printable page for every pegboard.',
        palettes: BRAND_IDS,
        layout: 'square',
        shape: 'bead',
        cellMm: {w: 5, h: 5},
        widths: [
            {label: '1 board', w: BOARD},
            {label: '2 × 2', w: BOARD * 2},
            {label: '3 × 3', w: BOARD * 3},
        ],
        defaultWidth: BOARD,
        maxWidth: 150,
        defaultColors: 24,
        boards: true,
        rowOrder: null,
        extras: () => [],
        steps: [],
        faq: [
            {q: 'How big is one pegboard?', a: 'Patterns are split into large square boards of 29 × 29 pegs. A 58-bead-wide pattern fills a 2 × 2 grid of boards. With 5 mm beads, one board is about 14.5 cm across.'},
            {q: 'Which bead brands can I use?', a: 'Perler, Hama, Artkal, Nabbi and MARD. Switch brand at any time and the pattern is matched again to that brand\'s real colours.'},
            {q: 'Why are clear, glitter and neon beads off by default?', a: 'They look different once ironed, so a close colour match on screen can look wrong on the board. Turn on "Allow clear, glitter and neon beads" to use them.'},
            {q: 'What does dithering do?', a: 'It mixes two nearby colours in a pattern of dots to fake the colours in between. It helps with photos and gradients, and makes flat cartoons look noisy.'},
            {q: 'Is my image uploaded?', a: 'No. The conversion runs in your browser. The last image you used is kept in this browser only, so it is still there when you come back.'},
        ],
        metaTitle: 'Bead pattern maker: photo to Perler beads',
        metaDescription: 'Turn any photo into a Perler, Hama, Artkal or MARD bead pattern. Real bead colours, a bead count and a printable page for every pegboard. Free, no sign-up.',
    },
    kandi: {
        id: 'kandi',
        icon: 'heart',
        name: 'Kandi',
        slug: 'kandi-pattern-maker',
        title: 'Kandi pattern maker',
        intro: 'Turn an image or a word into a kandi cuff pattern for pony beads, with a bead count and a row-by-row list to follow.',
        palettes: ['pony', ...BRAND_IDS],
        layout: 'square',
        shape: 'bead',
        cellMm: null,
        widths: [
            {label: '20', w: 20},
            {label: '30', w: 30},
            {label: '45', w: 45},
            {label: '60', w: 60},
        ],
        defaultWidth: 30,
        maxWidth: 100,
        defaultColors: 8,
        boards: false,
        rowOrder: 'ltr',
        extras: () => [],
        steps: [
            {title: 'Add an image or a word', text: 'Upload a picture, or make a word on the bead letters page and open it here.'},
            {title: 'Set the cuff size', text: 'Width is the number of beads in a row. Most cuffs are 30 to 60 beads around and 7 to 15 rows deep.'},
            {title: 'Keep the colours few', text: 'Pony beads come in fewer shades than fuse beads, so a handful of bold colours reads best.'},
            {title: 'String row by row', text: 'The PDF lists every row as runs of colour, so you can count beads onto the string without reading the grid.'},
        ],
        faq: [
            {q: 'Which kandi stitch is this for?', a: 'The grid lines up in straight rows, which suits ladder (standard) cuffs and single rows. For X-base or peyote cuffs, where rows are offset, use the peyote pattern maker.'},
            {q: 'Why are the colours named, not coded?', a: 'Pony bead brands do not share colour codes, and mixed packs are sold by colour name. Pick the closest bead you have.'},
            {q: 'Can I use Perler colours?', a: 'Yes. Switch the palette to a fuse bead brand if you want to match a specific bead range.'},
        ],
        metaTitle: 'Kandi pattern maker: free cuff patterns',
        metaDescription: 'Turn an image or a word into a kandi cuff pattern for pony beads, with a bead count per colour and a printable row-by-row list. Free, in your browser.',
    },
    loom: {
        id: 'loom',
        icon: 'layers',
        name: 'Bead loom',
        slug: 'bead-loom-pattern-maker',
        title: 'Bead loom pattern maker',
        intro: 'Turn any image into a loom pattern for 11/0 seed beads, drawn in true bead proportions, with warp thread count, finished size and a written chart.',
        palettes: ['seed'],
        layout: 'square',
        shape: 'tube',
        cellMm: DELICA,
        widths: [
            {label: '12', w: 12},
            {label: '24', w: 24},
            {label: '48', w: 48},
            {label: '72', w: 72},
        ],
        defaultWidth: 24,
        maxWidth: 120,
        defaultColors: 12,
        boards: false,
        rowOrder: 'ltr',
        extras: w => [`${w + 1} warp threads`],
        steps: [
            {title: 'Add an image', text: 'Photos, logos and pixel art all work. The chart keeps the proportions of real beads, so the woven piece is not stretched.'},
            {title: 'Choose the width', text: 'Width is beads per row, and you need one more warp thread than that. Bracelets are often 12 to 25 beads wide.'},
            {title: 'Match your beads', text: 'Colours are common seed bead shades. Pick the closest colour in your brand, such as Miyuki Delica or Toho.'},
            {title: 'Weave row by row', text: 'The PDF has the chart plus a written list of every row, left to right, as runs of colour.'},
        ],
        faq: [
            {q: 'Why are the cells not square?', a: 'A loomed seed bead is a little taller than it is wide. The chart is drawn with 11/0 cylinder bead proportions (about 1.6 × 1.3 mm), so the finished piece matches the picture.'},
            {q: 'How many warp threads do I need?', a: 'One more than the number of beads in a row. A 24-bead-wide pattern needs 25 warp threads.'},
            {q: 'Are these Miyuki Delica codes?', a: 'Not yet. The palette is common seed bead colours without brand codes. Match each one to the closest Delica or Toho shade you can buy.'},
            {q: 'How big will it be?', a: 'The size shown assumes 11/0 cylinder beads. Round seed beads and your tension change it a little, so weave a few rows and measure before a long piece.'},
        ],
        metaTitle: 'Bead loom pattern maker, free from any image',
        metaDescription: 'Turn a photo into a seed bead loom pattern in true bead proportions, with warp thread count, finished size and a written row-by-row chart. Free.',
    },
    peyote: {
        id: 'peyote',
        icon: 'fuse',
        name: 'Peyote',
        slug: 'peyote-pattern-maker',
        title: 'Peyote pattern maker',
        intro: 'Turn any image into an even-count peyote pattern with offset columns, a bead count and a written chart that starts with rows 1 and 2 together.',
        palettes: ['seed', 'pony'],
        layout: 'peyote',
        shape: 'tube',
        cellMm: DELICA,
        widths: [
            {label: '10', w: 10},
            {label: '20', w: 20},
            {label: '40', w: 40},
            {label: '60', w: 60},
        ],
        defaultWidth: 20,
        maxWidth: 120,
        defaultColors: 12,
        boards: false,
        rowOrder: 'peyote',
        extras: w => (w % 2 ? ['odd count: needs an odd-count turn'] : ['even count']),
        steps: [
            {title: 'Add an image', text: 'The chart staggers every other column by half a bead, the way flat peyote sits.'},
            {title: 'Pick an even width', text: 'Even-count peyote is the easier start. An odd width works too but needs an odd-count turn at one edge.'},
            {title: 'Match your beads', text: 'Colours are common seed bead shades. Cylinder beads such as Delicas give the flattest fabric.'},
            {title: 'Follow the word chart', text: 'Rows 1 and 2 are picked up together in one pass, then each row lists its beads in the order you add them.'},
        ],
        faq: [
            {q: 'How do I read the word chart?', a: 'Rows 1 and 2 are strung together, left to right across the top of every column. From row 3 on, each row adds one bead to every other column, and the direction alternates.'},
            {q: 'What is the difference with brick stitch?', a: 'Brick stitch is peyote turned a quarter turn: rows are offset instead of columns. It suits earrings and shapes.'},
            {q: 'Can I use this for an X-base kandi cuff?', a: 'Yes. X-base cuffs follow the same offset as peyote. Switch the palette to pony beads.'},
        ],
        metaTitle: 'Peyote pattern maker: free peyote charts',
        metaDescription: 'Turn a photo into an even-count peyote pattern with offset columns, bead counts and a word chart that starts with rows 1 and 2. Free, in your browser.',
    },
    brick: {
        id: 'brick',
        icon: 'patterns',
        name: 'Brick stitch',
        slug: 'brick-stitch-pattern-maker',
        title: 'Brick stitch pattern maker',
        intro: 'Turn any image into a brick stitch pattern for earrings and motifs, with offset rows, a bead count and a written row list.',
        palettes: ['seed'],
        layout: 'brick',
        shape: 'tube',
        cellMm: {w: DELICA.h, h: DELICA.w},
        widths: [
            {label: '10', w: 10},
            {label: '16', w: 16},
            {label: '24', w: 24},
            {label: '40', w: 40},
        ],
        defaultWidth: 16,
        maxWidth: 100,
        defaultColors: 10,
        boards: false,
        rowOrder: 'ltr',
        extras: () => [],
        steps: [
            {title: 'Add an image', text: 'Shapes with a clear outline work best. Turn on remove background to keep only the motif.'},
            {title: 'Choose the width', text: 'Earrings are often 10 to 20 beads across at the widest row.'},
            {title: 'Match your beads', text: 'Colours are common seed bead shades. Pick the closest colour of your brand.'},
            {title: 'Build from a ladder', text: 'Start the widest row with ladder stitch, then brick stitch each row onto the one before, following the written list.'},
        ],
        faq: [
            {q: 'Why are rows offset?', a: 'In brick stitch each bead sits between two beads of the row before, so every other row shifts half a bead, like bricks in a wall.'},
            {q: 'Can the pattern be a shape, not a rectangle?', a: 'Yes. Empty cells are left out, so rows can be shorter or longer. Remove the background to get the outline of your motif.'},
            {q: 'What is the difference with peyote?', a: 'Peyote offsets columns and is worked across; brick stitch offsets rows and is worked row by row onto thread bridges.'},
        ],
        metaTitle: 'Brick stitch pattern maker for earrings',
        metaDescription: 'Turn a picture into a brick stitch pattern for earrings and motifs, with offset rows, bead counts and a written row list. Free, in your browser.',
    },
    friendship: {
        id: 'friendship',
        icon: 'beadwork',
        name: 'Friendship bracelet',
        slug: 'friendship-bracelet-pattern-maker',
        title: 'Friendship bracelet pattern maker',
        intro: 'Turn a picture or a word into an alpha friendship bracelet pattern matched to DMC floss, with knot counts and a row-by-row chart.',
        palettes: ['dmc'],
        layout: 'square',
        shape: 'knot',
        cellMm: null,
        widths: [
            {label: '10', w: 10},
            {label: '14', w: 14},
            {label: '18', w: 18},
            {label: '24', w: 24},
        ],
        defaultWidth: 14,
        maxWidth: 60,
        defaultColors: 3,
        boards: false,
        rowOrder: 'zigzag',
        extras: w => [`${w} base strings`],
        steps: [
            {title: 'Add a picture or a word', text: 'Alpha patterns work best with bold shapes and letters. Make a word on the bead letters page and open it here.'},
            {title: 'Set knots per row', text: 'Most alpha bracelets are 12 to 24 knots wide. Each knot is one square of the chart.'},
            {title: 'Keep colours few', text: 'Every colour is a string to manage, so 2 to 4 colours is easiest. Each is matched to a DMC floss number.'},
            {title: 'Knot row by row', text: 'Rows alternate direction. The chart lists each row in the order you knot it.'},
        ],
        faq: [
            {q: 'What is an alpha pattern?', a: 'A friendship bracelet pattern made of a grid of knots, one colour per square, knotted in rows over base strings. It can show any picture or word.'},
            {q: 'How many strings do I need?', a: 'One base string per knot of width. A two-colour pattern also needs one knotting string, so a 14-knot pattern uses 15 strings. More colours need more strings.'},
            {q: 'Why DMC?', a: 'DMC stranded cotton is sold nearly everywhere and every colour has a number, so the chart tells you exactly what to buy.'},
        ],
        metaTitle: 'Friendship bracelet pattern maker (alpha)',
        metaDescription: 'Turn a picture or a word into an alpha friendship bracelet pattern matched to DMC floss, with knot counts, string count and a row-by-row chart.',
    },
}

export const CRAFT_IDS = Object.keys(CRAFTS) as CraftId[]
// Crafts with their own landing page, in menu order.
export const BEADWORK_IDS: CraftId[] = ['kandi', 'loom', 'peyote', 'brick', 'friendship']

export const craftBySlug = (slug: string) => BEADWORK_IDS.map(id => CRAFTS[id]).find(c => c.slug === slug) ?? null
export const isCraftId = (v: unknown): v is CraftId => CRAFT_IDS.includes(v as CraftId)

// Drawn proportions of a cell: height / width.
export const cellAspect = (c: Craft) => (c.cellMm ? c.cellMm.h / c.cellMm.w : 1)
