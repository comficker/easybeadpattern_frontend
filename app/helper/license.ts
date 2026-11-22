// What others may do with a piece, chosen by its artist when publishing on
// SimplePixelArt and kept in `meta.license`. Copied from the simplepixelart
// web app's constants so the two sites name the same licence for the same
// art; keep them in sync by hand (there is no shared package here).
//
// No value means all rights reserved, which has no licence URL -- and a
// picture with no licence URL should not claim one in its schema, so
// `licenseUrl` returns undefined and the ImageObject leaves the field out.
const LICENSE_URLS: Record<string, string> = {
    'cc-by-4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'cc0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'mit': 'https://opensource.org/license/mit',
}

export const licenseUrl = (value: string | null | undefined): string | undefined =>
    LICENSE_URLS[(value || '').toLowerCase()]
