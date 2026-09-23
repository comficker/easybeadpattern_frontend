export type Level = 'easy' | 'medium' | 'hard'

export interface ArtRow {
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

export interface ArtDetail {
    id: number
    id_string: string
    name: string
    width: number
    height: number
    updated: string
    desc?: string
    colors: string[]
    map_numbers: Record<string, number>
    taxonomies: { id_string: string; name: string }[]
    user?: { username: string } | null
}

export interface PatternStats {
    minSide: number
    maxSide: number
    avgColors: number
    levels: Record<Level, number>
}

export interface PatternPage {
    count: number
    num_pages: number
    stats: PatternStats | null
    results: ArtRow[]
}

export interface Facets {
    total: number
    minIndex: number
    tags: { id_string: string; name: string; count: number }[]
    sizes: { size: string; width: number; height: number; count: number }[]
    levels: Record<Level, number>
}

export interface PatternFilter {
    tag?: string
    size?: string
    level?: Level
    related?: string
    sort?: 'new' | 'small' | 'large'
    page?: number
    page_size?: number
}

export const LEVELS: Record<Level, { name: string; blurb: string }> = {
    easy: {name: 'Easy', blurb: 'up to 16 × 16 beads and 6 colours'},
    medium: {name: 'Medium', blurb: 'up to one 29 × 29 board and 15 colours'},
    hard: {name: 'Hard', blurb: 'bigger than one board or more than 15 colours'},
}

export const isLevel = (v: unknown): v is Level => v === 'easy' || v === 'medium' || v === 'hard'

export function apiBase() {
    return useRuntimeConfig().public.api as string
}

// Thumbnail of an art, rendered by the shared coloring backend.
export function artThumb(art: Pick<ArtRow, 'id_string' | 'updated'>, size = 'art-thumb') {
    const v = art.updated ? Date.parse(art.updated) : NaN
    return `${apiBase()}/coloring/files/${size}/${art.id_string}.png${Number.isFinite(v) ? `?v=${v}` : ''}`
}

// Patterns from the site's own catalog (server/utils/catalog.ts).
// `key` must not contain a route path: it ends up in the SSR payload.
export function usePatterns(key: string, filter: Ref<PatternFilter>) {
    return useFetch<PatternPage>('/api/patterns', {query: filter, key: `patterns-${key}`})
}

export function useFacets() {
    return useFetch<Facets>('/api/facets', {key: 'facets'})
}

export function tagName(facets: Facets | null | undefined, id: string) {
    return facets?.tags.find(t => t.id_string === id)?.name ?? id.replace(/-/g, ' ')
}

export const sizeLabel = (size: string) => size.replace('x', ' × ')
