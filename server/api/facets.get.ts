// Filters and hub data for listing pages, kept small: it ships in the HTML of
// every listing. Only themes big enough for their own page, without their
// related lists (a theme page asks /api/tags/:id for those).
export default defineEventHandler(async () => {
    const {items, tags, sizes, levels} = await getCatalog()
    return {
        total: items.length,
        tags: tags.filter(t => t.count >= MIN_INDEX).map(({id_string, name, count}) => ({id_string, name, count})),
        sizes,
        levels,
        minIndex: MIN_INDEX,
    }
})
