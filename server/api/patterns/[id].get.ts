// One catalog entry. Only public originals are in the catalog, so this is also
// the gate for which pattern pages exist. Carries the counts of its own themes
// so the page does not need the whole facet list.
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const {items, tags} = await getCatalog()
    const item = items.find(i => i.id_string === id)
    if (!item) throw createError({statusCode: 404, statusMessage: 'Pattern not found'})
    const counts = Object.fromEntries(tags.filter(t => item.tags.includes(t.id_string)).map(t => [t.id_string, t.count]))
    return {...item, tagCounts: counts}
})
