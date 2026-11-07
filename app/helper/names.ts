// Patterns in the shared coloring library are not named for this site. Some
// have no name at all, some are called literally "Untitled", and the same
// subject gets drawn more than once at the same size. Each of those shipped
// two pages under one <title>.
//
// The size is already part of a pattern's title, so two arts of the same name
// at different sizes read apart on their own. Only a name AND size that are
// both taken need the id, and only the arts that share them get it: a pattern
// with a name of its own keeps a clean title.

export interface NamedArt {
    id: number
    name: string
    width: number
    height: number
}

const UNTITLED = /^untitled$/i

// The name of one art, with no knowledge of the rest of the library.
export function displayName(art: { id: number; name?: string | null }): string {
    const n = (art.name ?? '').trim()
    return !n || UNTITLED.test(n) ? `Untitled ${art.id}` : n
}

// Settles the names of a whole set at once, which is the only way to know what
// collides. Returns new objects; the input is left alone.
export function nameAll<T extends NamedArt>(arts: T[]): T[] {
    const key = (name: string, a: NamedArt) => `${name.toLowerCase()}|${a.width}x${a.height}`
    const shared = new Map<string, number>()
    for (const a of arts) {
        const k = key(displayName(a), a)
        shared.set(k, (shared.get(k) ?? 0) + 1)
    }
    const used = new Set<string>()
    return arts.map(a => {
        const base = displayName(a)
        let name = shared.get(key(base, a))! > 1 ? `${base} ${a.id}` : base
        // The id can land on a name another art already has: the library holds
        // a "Plane" and a "Plane 2" at the same size, and "Plane" is id 2. Keep
        // going until the name is free. Earlier arts keep the cleaner name.
        if (used.has(key(name, a))) name = `${base} ${a.id}`
        for (let n = 2; used.has(key(name, a)); n++) name = `${base} ${a.id} (${n})`
        used.add(key(name, a))
        return {...a, name}
    })
}

// Whether a pattern page is worth putting in the index. A page whose whole
// content is "place 78 beads of one colour" has nothing to rank with, and the
// library holds 297 of them -- Food 2, Food 3, Food 4 -- from 1-bit sprite
// sets, near-identical to each other. A page with no name has nothing anyone
// could search for. Both stay reachable and usable in the tool; they are just
// noindex and out of the sitemap, the same bargain a thin listing page makes
// (MIN_INDEX in server/utils/catalog.ts).
export const isIndexable = (art: { name: string; colors: number }) =>
    art.colors >= 2 && !/^Untitled \d+$/.test(art.name)
