// Which patterns to submit in the sitemap.
//
// Submitting the whole library did not work: of ~2,000 pattern URLs sent in,
// Google had never heard of 78% a month later (ops/seo/reports/
// index-status-2026-11-18.md). A sitemap is a request, not a promise, and a
// long one Google ignores earns the site less trust than a short one it
// crawls. So the sitemap carries the patterns most likely to be worth a
// result, and the rest rely on their links from /patterns/a-z and the theme,
// size and level pages. Raise this as the indexed share goes up.
export const SITEMAP_PATTERNS = 500

export interface RankedArt {
    name: string
    colors: number
    beads: number
    width: number
    height: number
    tags: string[]
    indexable: boolean
}

// A pattern is worth a search result when it has something to say: themes
// someone could search for, a real range of colours, and enough beads to be a
// project rather than a sprite. Deterministic, so the sitemap does not churn.
export function patternScore(a: RankedArt): number {
    return Math.min(a.tags.length, 3) * 10
        + Math.min(a.colors, 12) * 2
        + Math.min(Math.max(a.width, a.height), 32) / 4
}

export function bestPatterns<T extends RankedArt>(items: T[], limit = SITEMAP_PATTERNS): T[] {
    return items
        .filter(a => a.indexable)
        .map(a => ({a, s: patternScore(a)}))
        // Name breaks ties so the list is stable between builds.
        .sort((x, y) => y.s - x.s || x.a.name.localeCompare(y.a.name))
        .slice(0, limit)
        .map(x => x.a)
}
