import {BRAND_IDS, CHART_IDS, getBrand} from '../../app/helper/beads/brands'
import {BEADWORK_IDS, CRAFTS} from '../../app/helper/beads/crafts'
import {GUIDES} from '../../app/helper/guides'

export default defineCachedEventHandler(async (event) => {
    const site = useRuntimeConfig(event).public.siteUrl as string
    const {items, tags, sizes, levels} = await getCatalog()

    const paths = ['/', '/designer', '/beadwork', '/bead-letters', '/patterns', '/patterns/tag', '/colors']
    for (const id of BRAND_IDS) paths.push(`/${getBrand(id).slug}`)
    for (const id of BEADWORK_IDS) paths.push(`/${CRAFTS[id].slug}`)
    for (const id of CHART_IDS) paths.push(`/colors/${id}`)
    paths.push('/guides', ...GUIDES.map(g => `/guides/${g.slug}`))
    // Listing pages below MIN_INDEX are noindex, so they stay out of the sitemap.
    for (const [level, n] of Object.entries(levels)) if (n >= MIN_INDEX) paths.push(`/patterns/level/${level}`)
    for (const s of sizes) if (s.count >= MIN_INDEX) paths.push(`/patterns/size/${s.size}`)
    for (const t of tags) if (t.count >= MIN_INDEX) paths.push(`/patterns/tag/${t.id_string}`)

    const api = useRuntimeConfig(event).public.api as string
    const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const urls = paths.map(p => `<url><loc>${site}${p}</loc></url>`)
    // Pattern pages carry their picture, for image search.
    for (const a of items) {
        const img = `${api}/coloring/files/art-social/${a.id_string}.png?v=${Date.parse(a.updated)}`
        urls.push(`<url><loc>${site}/patterns/${a.id_string}</loc><lastmod>${a.updated.slice(0, 10)}</lastmod>`
            + `<image:image><image:loc>${esc(img)}</image:loc><image:title>${esc(`${a.name} bead pattern`)}</image:title></image:image></url>`)
    }

    setHeader(event, 'content-type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`
}, {maxAge: 60 * 60})
