import type {PatternStats} from '~/composables/useApi'

// One plain sentence of facts for a listing page, built from the real set.
export function listingIntro(count: number, subject: string, stats: PatternStats | null | undefined, opts: { easyNote?: boolean } = {}): string {
    if (!count || !stats) return ''
    const range = stats.minSide === stats.maxSide
        ? `all ${stats.minSide} beads across`
        : `from ${stats.minSide} to ${stats.maxSide} beads across`
    const n = stats.levels.easy
    const easy = opts.easyNote === false || !n ? ''
        : n === count ? ' All of them are easy enough for a first project.'
            : ` ${n} ${n === 1 ? 'is' : 'are'} easy enough for a first project.`
    return `${count} free ${subject} bead pattern${count > 1 ? 's' : ''}, ${range}, with ${stats.avgColors} colours on average.${easy} Open any of them in Perler, Hama, Artkal, Nabbi or MARD colours and print one page per pegboard.`
}

export const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Page 2+ of a listing gets its own title and canonical, never page 1's.
export const pageSuffix = (page: number) => (page > 1 ? `, page ${page}` : '')
export const pageQuery = (page: number) => (page > 1 ? `?page=${page}` : '')

// JSON-LD for a page of patterns, and the first pattern as the share image.
export function listingSeo(results: { name: string; id_string: string; updated: string }[] | undefined) {
    const items = (results ?? []).slice(0, 24)
    return {
        image: items[0] ? artThumb(items[0], 'art-social') : undefined,
        itemList: ldItemList(items.map(a => ({name: `${a.name} bead pattern`, path: `/patterns/${a.id_string}`, image: artThumb(a)}))),
    }
}

export const pagePrefix = (page: number) => (page > 1 ? `Page ${page}: ` : '')
