// The pattern library, built from the shared coloring backend and cached for an
// hour. The backend has no tag counts, size buckets or colour counts for public
// originals, and the library is small (hundreds of arts), so it is cheaper to
// derive them here than to add endpoints. Revisit once the library reaches
// several thousand arts: the full payload is ~9 KB per art.

export type Level = 'easy' | 'medium' | 'hard'

export interface CatalogItem {
    id: number
    id_string: string
    name: string
    width: number
    height: number
    updated: string
    colors: number
    beads: number
    level: Level
    tags: string[]
}

export interface CatalogTag {
    id_string: string
    name: string
    count: number
    // Tags that most often appear on the same patterns.
    related: string[]
}

export interface CatalogSize {
    size: string
    width: number
    height: number
    count: number
}

export interface Catalog {
    items: CatalogItem[]
    tags: CatalogTag[]
    sizes: CatalogSize[]
    levels: Record<Level, number>
}

// A listing page is indexed only with at least this many patterns; thinner
// pages stay reachable but are noindex and left out of the sitemap.
export const MIN_INDEX = 3

// Only art narrower than this is a bead pattern here: wider pieces need too
// many boards (and beads) to be a practical build.
export const MAX_WIDTH = 48

export function levelOf(width: number, height: number, colors: number): Level {
    const side = Math.max(width, height)
    if (side <= 16 && colors <= 6) return 'easy'
    if (side > 29 || colors > 15) return 'hard'
    return 'medium'
}

export const getCatalog = defineCachedFunction(async (): Promise<Catalog> => {
    const api = useRuntimeConfig().public.api as string

    const tagNames = new Map<number, { id_string: string; name: string }>()
    const tagPage: any = await $fetch(`${api}/coloring/tags/?page_size=1000`)
    for (const t of tagPage.results || []) tagNames.set(t.id, {id_string: t.id_string, name: t.name})

    const items: CatalogItem[] = []
    let next: string | null = `${api}/coloring/shared-pages/?is_template=true&template__isnull=true&full_schema=true&page_size=100`
    for (let guard = 0; next && guard < 100; guard++) {
        const page: any = await $fetch(next)
        for (const a of page.results || []) {
            if (a.status !== 'public' || a.is_tile || a.width >= MAX_WIDTH) continue
            const values = Object.values(a.map_numbers || {}) as number[]
            if (!values.length) continue
            const colors = new Set(values).size
            items.push({
                id: a.id,
                id_string: a.id_string,
                name: a.name,
                width: a.width,
                height: a.height,
                updated: a.updated,
                colors,
                beads: values.length,
                level: levelOf(a.width, a.height, colors),
                tags: (a.taxonomies || []).map((id: number) => tagNames.get(id)?.id_string).filter(Boolean),
            })
        }
        next = page.links?.next || null
    }
    items.sort((a, b) => b.id - a.id)

    const tagCount = new Map<string, number>()
    const pairs = new Map<string, Map<string, number>>()
    for (const it of items) {
        for (const t of it.tags) {
            tagCount.set(t, (tagCount.get(t) || 0) + 1)
            const m = pairs.get(t) || new Map<string, number>()
            for (const o of it.tags) if (o !== t) m.set(o, (m.get(o) || 0) + 1)
            pairs.set(t, m)
        }
    }
    const byId = new Map([...tagNames.values()].map(t => [t.id_string, t]))
    const tags: CatalogTag[] = [...tagCount].map(([id, count]) => ({
        id_string: id,
        name: byId.get(id)?.name || id,
        count,
        related: [...(pairs.get(id) || [])].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([o]) => o),
    })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

    const sizeCount = new Map<string, CatalogSize>()
    for (const it of items) {
        const size = `${it.width}x${it.height}`
        const s = sizeCount.get(size) || {size, width: it.width, height: it.height, count: 0}
        s.count++
        sizeCount.set(size, s)
    }
    const sizes = [...sizeCount.values()].sort((a, b) => b.count - a.count || a.width - b.width)

    const levels = {easy: 0, medium: 0, hard: 0}
    for (const it of items) levels[it.level]++

    return {items, tags, sizes, levels}
// The filter is part of the key, so changing it never serves a stale catalog.
}, {name: 'catalog', getKey: () => `w${MAX_WIDTH}`, maxAge: 60 * 60, swr: true})
