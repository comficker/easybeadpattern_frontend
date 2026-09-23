// Page SEO in one call: title, description, canonical, robots, Open Graph,
// Twitter and JSON-LD. Guards the lengths search results show so no page
// ships a cut-off title or snippet.
export interface SeoOptions {
    title: string
    description: string
    path: string
    // Absolute URL, or a path under /og/ (a pre-rendered card, see scripts/og.mjs).
    image?: string
    imageAlt?: string
    type?: 'website' | 'article'
    noindex?: boolean
    jsonLd?: Record<string, unknown>[]
}

const BRAND = 'EasyBeadPattern'
const SUFFIX = ` · ${BRAND}`
const TITLE_MAX = 60
const DESC_MAX = 158

// Cut at a word boundary, never mid-word.
export function clip(text: string, max: number): string {
    if (text.length <= max) return text
    const cut = text.slice(0, max - 1)
    return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6)).replace(/[\s,.;:–-]+$/, '')}…`
}

export function useSeo(o: SeoOptions) {
    const site = useRuntimeConfig().public.siteUrl as string
    const url = site + o.path
    // Brand suffix only while the whole title still fits.
    const withSuffix = o.title.length + SUFFIX.length <= TITLE_MAX
    const title = withSuffix ? o.title : clip(o.title, TITLE_MAX)
    const description = clip(o.description, DESC_MAX)
    const image = o.image
        ? (o.image.startsWith('http') ? o.image : site + o.image)
        : `${site}/og/default.png`

    useHead({
        title,
        titleTemplate: withSuffix ? `%s${SUFFIX}` : '%s',
        link: [{rel: 'canonical', href: url}],
        script: (o.jsonLd ?? []).map(j => ({type: 'application/ld+json', innerHTML: JSON.stringify(j)})),
    })
    useSeoMeta({
        description,
        robots: o.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
        ogTitle: title,
        ogDescription: description,
        ogUrl: url,
        ogType: o.type ?? 'website',
        ogImage: image,
        ogImageWidth: o.image?.startsWith('http') ? undefined : 1200,
        ogImageHeight: o.image?.startsWith('http') ? undefined : 630,
        ogImageAlt: o.imageAlt ?? title,
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
    })
}

// Structured-data helpers shared by pages.
export function ldBreadcrumbs(items: { name: string; path?: string }[]) {
    const site = useRuntimeConfig().public.siteUrl as string
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
            '@type': 'ListItem', position: i + 1, name: it.name,
            ...(it.path ? {item: site + it.path} : {}),
        })),
    }
}

export function ldFaq(faq: { q: string; a: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({'@type': 'Question', name: f.q, acceptedAnswer: {'@type': 'Answer', text: f.a}})),
    }
}

export function ldTool(name: string, description: string, path: string) {
    const site = useRuntimeConfig().public.siteUrl as string
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        description,
        url: site + path,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any (web browser)',
        isAccessibleForFree: true,
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
    }
}

export function ldItemList(items: { name: string; path: string; image?: string }[]) {
    const site = useRuntimeConfig().public.siteUrl as string
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((it, i) => ({
            '@type': 'ListItem', position: i + 1, name: it.name, url: site + it.path, ...(it.image ? {image: it.image} : {}),
        })),
    }
}
