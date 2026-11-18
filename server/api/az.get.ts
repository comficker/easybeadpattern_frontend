import {AZ_LETTERS, azLetter} from '../../app/helper/az'

// The A-to-Z index: every indexable pattern gets a plain link from one small
// page, so none of them depends on walking a pager to be found. Only the two
// fields a text link needs travel in the HTML -- the whole catalog row is
// ~120 bytes and there are thousands of them.
export default defineEventHandler(async (event) => {
    const want = String(getQuery(event).letter || '').toUpperCase()
    const {items} = await getCatalog()

    const counts = new Map<string, number>()
    const results: { id_string: string; name: string; width: number; height: number }[] = []
    for (const it of items) {
        if (!it.indexable) continue
        const l = azLetter(it.name)
        counts.set(l, (counts.get(l) || 0) + 1)
        if (l === want) results.push({id_string: it.id_string, name: it.name, width: it.width, height: it.height})
    }
    results.sort((a, b) => a.name.localeCompare(b.name))

    return {
        letters: AZ_LETTERS.map(letter => ({letter, count: counts.get(letter) || 0})).filter(l => l.count > 0),
        total: [...counts.values()].reduce((s, n) => s + n, 0),
        results,
    }
})
