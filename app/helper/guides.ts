// Guides: short, practical articles. Facts about brands come from the palette
// data; craft advice stays general and points to the maker's own instructions.
import {BRAND_IDS, getBrand} from './beads/brands'

export interface Guide {
    slug: string
    title: string
    description: string
    icon: string
    // Tool the guide leads to.
    cta: { to: string; label: string }
    sections: { heading: string; paragraphs: string[]; list?: string[] }[]
}

const brandFacts = BRAND_IDS.map(id => {
    const b = getBrand(id)
    const regular = b.beads.filter(x => !x.special).length
    return `${b.name}: ${b.beads.length} colours in our chart (${regular} regular, ${b.beads.length - regular} clear, glitter, glow, pearl, metallic or neon). Codes look like ${b.beads.slice(0, 2).map(x => x.code).join(', ')}.`
})

export const GUIDES: Guide[] = [
    {
        slug: 'how-to-turn-a-photo-into-a-bead-pattern',
        title: 'How to turn a photo into a bead pattern',
        description: 'Pick the right picture, size and colour count, then clean up the result so it is easy to build with Perler, Hama or any fuse bead.',
        icon: 'image',
        cta: {to: '/', label: 'Open the pattern maker'},
        sections: [
            {
                heading: 'Start with the right picture',
                paragraphs: [
                    'Bold shapes with clear edges convert best: a logo, a cartoon, a pet photo cropped close. Busy backgrounds and tiny details turn into noise at bead size.',
                    'Crop to the subject before you upload. If the background is plain, turn on "Remove background" so only the subject is beaded.',
                ],
            },
            {
                heading: 'Choose the size in beads, not pixels',
                paragraphs: [
                    'One large square pegboard holds 29 × 29 beads. That is enough for a simple icon. Faces and detailed pictures need two or three boards across.',
                    'Twice as wide is about four times the beads, because the height grows with it. Start small and go up only if details are lost.',
                ],
            },
            {
                heading: 'Keep the colours few',
                paragraphs: [
                    'Fewer colours make a pattern easier to buy for and faster to build. Try 8 to 12 colours for cartoons and 16 to 24 for photos.',
                    'Dithering mixes two colours in a dot pattern to fake the shades in between. It helps with skies and skin, and makes flat cartoons look speckled.',
                ],
            },
            {
                heading: 'Tidy up by hand',
                paragraphs: [
                    'Click a colour in the bead list to see where it is used. Swap colours you do not own for ones you do, or remove stray single beads with the eraser.',
                    'If you only have some colours, mark them in "My colours" and turn on "Only colours I have": the pattern is matched to your beads alone.',
                ],
            },
            {
                heading: 'Print and build',
                paragraphs: ['Download the PDF: one page per pegboard, each peg numbered with its colour, and a shopping list on the first page. On a phone, Build mode lets you tick beads off as you place them.'],
            },
        ],
    },
    {
        slug: 'how-to-read-a-bead-pattern',
        title: 'How to read a bead pattern',
        description: 'What the board labels, colour numbers and row-by-row lists in a printed bead pattern mean, for pegboards, loom, peyote and brick stitch.',
        icon: 'book',
        cta: {to: '/beadwork', label: 'See the beadwork makers'},
        sections: [
            {
                heading: 'The first page: the whole picture',
                paragraphs: ['Page one shows the full pattern with a numbered list of every colour and how many you need. Colour 1 is the one used most. Buy from this list before you start.'],
            },
            {
                heading: 'Pegboards: A1, A2, B1',
                paragraphs: [
                    'Big fuse bead patterns are split into 29 × 29 boards. Board labels read like a map: the letter is the row of boards, the number is the column. A1 is top left, A2 is to its right, B1 is below A1.',
                    'Every peg on a board page shows the number of its colour. Heavier lines every 5 pegs help you count.',
                ],
            },
            {
                heading: 'Row by row: loom, kandi and friendship bracelets',
                paragraphs: ['Beadwork patterns also come as a written list, one line per row. "4 × 2" means four beads of colour 2. Friendship bracelet rows alternate direction, so each line says whether to work left to right or right to left.'],
            },
            {
                heading: 'Peyote: rows 1 and 2 together',
                paragraphs: [
                    'In flat even-count peyote the first pass picks up the top bead of every column, which forms rows 1 and 2 at once. After that each row adds one bead to every other column, and the direction turns at each edge.',
                    'The chart draws every other column half a bead lower, the way the beads sit in the finished piece.',
                ],
            },
            {
                heading: 'Brick stitch: offset rows',
                paragraphs: ['Brick stitch charts shift every other row half a bead, like bricks in a wall. Start the widest row in ladder stitch, then add each row onto the one before. Empty cells at the ends are simply left out.'],
            },
        ],
    },
    {
        slug: 'perler-vs-hama-vs-artkal',
        title: 'Perler vs Hama vs Artkal vs MARD',
        description: 'How the main 5 mm fuse bead brands compare by colour range and codes, and how to plan a pattern for the brand you can buy.',
        icon: 'palette',
        cta: {to: '/colors', label: 'Compare the colour charts'},
        sections: [
            {
                heading: 'Same idea, different colour ranges',
                paragraphs: [
                    'Perler, Hama, Artkal S, Nabbi and MARD all make 5 mm fuse beads for pegboards. The main practical difference when you plan a pattern is the colour range and how colours are coded.',
                ],
                list: brandFacts,
            },
            {
                heading: 'More colours help photos',
                paragraphs: ['A bigger range gives closer shades, which matters most for photos, skin and gradients. For cartoons and icons any brand works: you will use a handful of bold colours anyway.'],
            },
            {
                heading: 'Plan for the brand you have',
                paragraphs: [
                    'A pattern made for one brand can be matched to another, but not colour for colour: each brand has its own shades. Switch the brand in the maker and the whole pattern is matched again to that brand\'s real colours.',
                    'Colours on screen are close, not exact. Before a big order, compare the chart with real beads.',
                ],
            },
        ],
    },
    {
        slug: 'how-to-iron-fuse-beads',
        title: 'How to iron fuse beads',
        description: 'A general guide to fusing Perler, Hama and other fuse bead designs with an iron, from covering the board to cooling the piece flat.',
        icon: 'lamp',
        cta: {to: '/patterns', label: 'Find a pattern to make'},
        sections: [
            {
                heading: 'Check your brand first',
                paragraphs: ['Each brand prints its own heat and time advice on the pack, and it is the best starting point. The steps below are the usual method; adjust them to what your beads need. Ironing is hot work, so children should do it with an adult.'],
            },
            {
                heading: 'What you need',
                paragraphs: ['A household iron with steam turned off, the ironing paper that comes with most bead kits (or baking parchment), and a flat, heat-safe surface.'],
            },
            {
                heading: 'Fuse the first side',
                list: [
                    'Cover the finished board with ironing paper.',
                    'Start with a medium heat and keep the iron moving in small circles over the whole piece.',
                    'Lift the paper at a corner to check: the beads should join, with the holes still open for a flat, beady look or closing more for a solid look.',
                    'Let it cool for a moment, then peel off the paper.',
                ],
                paragraphs: [],
            },
            {
                heading: 'Flip and finish',
                paragraphs: [
                    'Lift the piece off the pegboard, turn it over and fuse the other side the same way.',
                    'While it is still warm, place something flat and heavy on top, such as a book, and leave it to cool. This keeps it from curling.',
                ],
            },
            {
                heading: 'If something goes wrong',
                list: [
                    'Beads not joined: iron a little longer, with even pressure.',
                    'Holes melted shut or shiny spots: the iron was too hot or stayed in one place.',
                    'Piece curled up: it cooled without weight on it; warm it gently and press it flat again.',
                ],
                paragraphs: [],
            },
        ],
    },
]

export const guideBySlug = (slug: string) => GUIDES.find(g => g.slug === slug) ?? null
