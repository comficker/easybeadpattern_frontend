// Filtered, paginated pattern list from the cached catalog.
// ?tag= ?size=WxH ?level=easy|medium|hard ?related=<id_string> ?sort=new|small|large ?page= ?page_size=
export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const {items} = await getCatalog()
    let list = items

    if (q.tag) list = list.filter(i => i.tags.includes(String(q.tag)))
    if (q.size) list = list.filter(i => `${i.width}x${i.height}` === String(q.size))
    if (q.level) list = list.filter(i => i.level === q.level)

    if (q.related) {
        // Most shared tags first, then closest in size.
        const base = items.find(i => i.id_string === q.related)
        if (!base) return {count: 0, num_pages: 1, stats: null, results: []}
        const side = Math.max(base.width, base.height)
        list = list
            .filter(i => i.id !== base.id)
            .map(i => ({i, shared: i.tags.filter(t => base.tags.includes(t)).length, gap: Math.abs(Math.max(i.width, i.height) - side)}))
            .filter(x => x.shared > 0)
            .sort((a, b) => b.shared - a.shared || a.gap - b.gap)
            .map(x => x.i)
    } else if (q.sort === 'small' || q.sort === 'large') {
        const k = q.sort === 'small' ? 1 : -1
        list = [...list].sort((a, b) => k * (a.width * a.height - b.width * b.height))
    }

    // Facts about the whole filtered set, for page intros.
    const sides = list.map(i => Math.max(i.width, i.height))
    const stats = {
        minSide: sides.length ? Math.min(...sides) : 0,
        maxSide: sides.length ? Math.max(...sides) : 0,
        avgColors: list.length ? Math.round(list.reduce((s, i) => s + i.colors, 0) / list.length) : 0,
        levels: {
            easy: list.filter(i => i.level === 'easy').length,
            medium: list.filter(i => i.level === 'medium').length,
            hard: list.filter(i => i.level === 'hard').length,
        },
    }

    const pageSize = Math.min(100, Math.max(1, Number(q.page_size) || 24))
    const numPages = Math.max(1, Math.ceil(list.length / pageSize))
    const page = Math.min(numPages, Math.max(1, Number(q.page) || 1))
    return {
        count: list.length,
        num_pages: numPages,
        stats,
        results: list.slice((page - 1) * pageSize, page * pageSize),
    }
})
