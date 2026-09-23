// "My colours": the beads (or floss) someone owns, per palette, in this browser.
// Shared by the workbench and the colour chart pages.
import type {PaletteId} from '~/helper/beads/brands'

const KEY = (id: PaletteId) => `bap:inventory:${id}`
const cache = reactive<Record<string, string[]>>({})

function read(id: PaletteId): string[] {
    if (!(id in cache)) {
        let codes: string[] = []
        try { codes = JSON.parse(localStorage.getItem(KEY(id)) || '[]') } catch { /* blocked */ }
        cache[id] = Array.isArray(codes) ? codes : []
    }
    return cache[id]!
}

export function useInventory(id: Ref<PaletteId>) {
    // Empty until mounted, so the server HTML and the first client render agree.
    const ready = ref(false)
    onMounted(() => { ready.value = true })
    const codes = computed(() => (ready.value ? read(id.value) : []))
    const owned = computed(() => new Set(codes.value))
    function set(list: string[]) {
        cache[id.value] = list
        try { localStorage.setItem(KEY(id.value), JSON.stringify(list)) } catch { /* private mode */ }
    }
    function toggle(code: string) {
        set(owned.value.has(code) ? codes.value.filter(c => c !== code) : [...codes.value, code])
    }
    return {codes, owned, set, toggle}
}
