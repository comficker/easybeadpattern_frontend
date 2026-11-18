import {BRAND_IDS, CHART_IDS, getBrand} from '../../app/helper/beads/brands'
import {BEADWORK_IDS, CRAFTS} from '../../app/helper/beads/crafts'
import {ALL_LOCALE_PATHS} from '../../app/helper/i18n/pages'
import {GUIDES} from '../../app/helper/guides'
import {AZ_LETTERS, azLetter, azPath} from '../../app/helper/az'
import {SITEMAP_PATTERNS, bestPatterns} from '../../app/helper/rank'

export default defineCachedEventHandler(async (event) => {
    const site = useRuntimeConfig(event).public.siteUrl as string
    const {items, tags, sizes, levels} = await getCatalog()

    const paths = ['/', '/designer', '/beadwork', '/bead-letters', '/patterns', '/patterns/tag', '/patterns/a-z', '/colors']
    for (const id of BRAND_IDS) paths.push(`/${getBrand(id).slug}`)
    for (const id of BEADWORK_IDS) paths.push(`/${CRAFTS[id].slug}`)
    // Cross stitch is not beadwork, so it is not in BEADWORK_IDS.
    paths.push(`/${CRAFTS.cross.slug}`)
    paths.push(...ALL_LOCALE_PATHS)
    for (const id of CHART_IDS) paths.push(`/colors/${id}`)
    paths.push('/guides', ...GUIDES.map(g => `/guides/${g.slug}`))
    // Listing pages below MIN_INDEX are noindex, so they stay out of the sitemap.
    for (const [level, n] of Object.entries(levels)) if (n >= MIN_INDEX) paths.push(`/patterns/level/${level}`)
    for (const s of sizes) if (s.count >= MIN_INDEX) paths.push(`/patterns/size/${s.size}`)
    for (const t of tags) if (t.count >= MIN_INDEX) paths.push(`/patterns/tag/${t.id_string}`)

    // Letters that have patterns under them.
    const seen = new Set(items.filter(a => a.indexable).map(a => azLetter(a.name)))
    for (const l of AZ_LETTERS) if (seen.has(l)) paths.push(azPath(l))

    const api = useRuntimeConfig(event).public.api as string
    const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const urls = paths.map(p => `<url><loc>${site}${p}</loc></url>`)
    // Pattern pages carry their picture, for image search.
    // Only the strongest SITEMAP_PATTERNS go in: as of 18/11 Google had never
    // even heard of 78% of the ~2,000 submitted here, and a sitemap it mostly
    // ignores is worth less than a short one it crawls. The rest are still
    // indexable and now linked from /patterns/a-z; raise the number as the
    // index catches up.
    for (const a of bestPatterns(items, SITEMAP_PATTERNS)) {
        const img = `${api}/coloring/files/art-social/${a.id_string}.png?v=${Date.parse(a.updated)}`
        urls.push(`<url><loc>${site}/patterns/${a.id_string}</loc><lastmod>${a.updated.slice(0, 10)}</lastmod>`
            + `<image:image><image:loc>${esc(img)}</image:loc><image:title>${esc(`${a.name} bead pattern`)}</image:title></image:image></url>`)
    }

    setHeader(event, 'content-type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`
}, {maxAge: 60 * 60, getKey: () => `sitemap-w${MAX_WIDTH}`})
