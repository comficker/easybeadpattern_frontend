// One theme and the themes that most often appear with it.
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const {tags} = await getCatalog()
    const tag = tags.find(t => t.id_string === id)
    if (!tag) throw createError({statusCode: 404, statusMessage: 'Theme not found'})
    const byId = new Map(tags.map(t => [t.id_string, t]))
    return {
        tag: {id_string: tag.id_string, name: tag.name, count: tag.count},
        related: tag.related.map(r => byId.get(r)).filter(t => t && t.count >= MIN_INDEX)
            .map(t => ({id_string: t!.id_string, name: t!.name, count: t!.count})),
        minIndex: MIN_INDEX,
    }
})
