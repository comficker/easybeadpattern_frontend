// Letters of the A-to-Z pattern index. Anything that does not start with a
// latin letter -- numbers, "8-bit heart" -- goes under 0-9.
export const AZ_LETTERS = ['0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

export function azLetter(name: string): string {
    const c = (name.trim()[0] || '').toUpperCase()
    return /^[A-Z]$/.test(c) ? c : '0-9'
}

export const azPath = (letter: string) => `/patterns/a-z/${letter.toLowerCase()}`

