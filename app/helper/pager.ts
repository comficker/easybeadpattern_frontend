// Page numbers to show in a pager: always the first and last page, plus a
// window around the current one. 0 marks a gap ("…"). Keeping both ends in
// every pager is what makes a long listing two clicks deep instead of N.
export function pageWindow(page: number, pages: number, span = 2): number[] {
    const want = new Set<number>([1, pages])
    for (let p = page - span; p <= page + span; p++) if (p >= 1 && p <= pages) want.add(p)
    const sorted = [...want].sort((a, b) => a - b)
    const out: number[] = []
    for (const p of sorted) {
        if (out.length && p !== out[out.length - 1]! + 1) out.push(0)
        out.push(p)
    }
    return out
}
