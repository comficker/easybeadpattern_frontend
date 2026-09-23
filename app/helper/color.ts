export type RGB = [number, number, number]
export type Lab = [number, number, number]

export function hexToRgb(hex: string): RGB {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function rgbToHex([r, g, b]: RGB): string {
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()
}

const lin = (c: number) => {
    const v = c / 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116)

// sRGB → CIELAB (D65).
export function rgbToLab([r, g, b]: RGB): Lab {
    const R = lin(r), G = lin(g), B = lin(b)
    const x = f((R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047)
    const y = f(R * 0.2126 + G * 0.7152 + B * 0.0722)
    const z = f((R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883)
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
}

const rad = Math.PI / 180
const P25 = 25 ** 7

// CIEDE2000 colour difference. Plain Lab distance (CIE76) over-weights
// lightness in the darks: it matched pure black to Perler Cocoa over Black.
export function deltaE(a: Lab, b: Lab): number {
    const [L1, a1, b1] = a, [L2, a2, b2] = b
    const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2)
    const Cm7 = ((C1 + C2) / 2) ** 7
    const G = 0.5 * (1 - Math.sqrt(Cm7 / (Cm7 + P25)))
    const a1p = a1 * (1 + G), a2p = a2 * (1 + G)
    const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2)
    const h1p = (Math.atan2(b1, a1p) / rad + 360) % 360
    const h2p = (Math.atan2(b2, a2p) / rad + 360) % 360
    const dLp = L2 - L1
    const dCp = C2p - C1p
    let dhp = 0
    if (C1p * C2p) {
        dhp = h2p - h1p
        if (dhp > 180) dhp -= 360
        else if (dhp < -180) dhp += 360
    }
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * rad / 2)
    const Lpm = (L1 + L2) / 2
    const Cpm = (C1p + C2p) / 2
    let hpm = h1p + h2p
    if (C1p * C2p) {
        if (Math.abs(h1p - h2p) > 180) hpm += h1p + h2p < 360 ? 360 : -360
        hpm /= 2
    }
    const T = 1 - 0.17 * Math.cos((hpm - 30) * rad) + 0.24 * Math.cos(2 * hpm * rad)
        + 0.32 * Math.cos((3 * hpm + 6) * rad) - 0.2 * Math.cos((4 * hpm - 63) * rad)
    const Cpm7 = Cpm ** 7
    const Rc = 2 * Math.sqrt(Cpm7 / (Cpm7 + P25))
    const Rt = -Math.sin(60 * Math.exp(-(((hpm - 275) / 25) ** 2)) * rad) * Rc
    const Sl = 1 + 0.015 * (Lpm - 50) ** 2 / Math.sqrt(20 + (Lpm - 50) ** 2)
    const Sc = 1 + 0.045 * Cpm
    const Sh = 1 + 0.015 * Cpm * T
    const l = dLp / Sl, c = dCp / Sc, h = dHp / Sh
    return Math.sqrt(l * l + c * c + h * h + Rt * c * h)
}

// Black or white, whichever reads better on top of `hex`.
export function inkOn(hex: string): '#000000' | '#FFFFFF' {
    const [r, g, b] = hexToRgb(hex)
    return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#000000' : '#FFFFFF'
}

export function shade(hex: string, amount: number): string {
    const [r, g, b] = hexToRgb(hex)
    const k = 1 + amount
    return rgbToHex([Math.min(255, r * k), Math.min(255, g * k), Math.min(255, b * k)])
}
