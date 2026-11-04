// The German pages. Hama and Artkal sell mostly in Europe and "Bügelperlen
// Vorlagen" has about as much demand as "perler bead patterns", so these five
// URLs are hand-written German, not a machine pass over the English copy.
// Every string here is shipped as-is: no template left to fill in.
import type {BrandId} from './beads/brands'

export interface DePage {
    slug: string
    // The English page this one translates, for hreflang and the language link.
    en: string
    kind: 'maker' | 'gallery'
    brand?: BrandId
    h1: string
    intro: string
    metaTitle: string
    metaDescription: string
    steps?: { title: string; text: string }[]
    faq?: { q: string; a: string }[]
}

const STEPS: DePage['steps'] = [
    {title: 'Bild hochladen', text: 'Foto, Zeichnung oder Pixel-Art. Die Umwandlung läuft im Browser, das Bild wird nicht hochgeladen.'},
    {title: 'Größe und Farben wählen', text: 'Lege fest, wie viele Stiftplatten die Vorlage füllt und wie viele Farben du kaufen willst. Jede Farbe ist eine echte Perle.'},
    {title: 'Farben aufräumen', text: 'Klicke eine Farbe in der Liste an, um zu sehen, wo sie liegt, und tausche sie gegen eine andere Perle oder nimm sie heraus.'},
    {title: 'Drucken und stecken', text: 'Das PDF hat eine Seite pro Stiftplatte mit einer nummerierten Farbe in jedem Stift, dazu die Einkaufsliste aller Perlen.'},
]

const FAQ: DePage['faq'] = [
    {q: 'Wie groß ist eine Stiftplatte?', a: 'Die Vorlage wird in große quadratische Platten zu 29 × 29 Stiften geteilt. Eine Vorlage mit 58 Perlen Breite füllt 2 × 2 Platten. Bei 5-mm-Perlen ist eine Platte etwa 14,5 cm breit.'},
    {q: 'Welche Marken kann ich verwenden?', a: 'Perler, Hama, Artkal, Nabbi und MARD. Du kannst die Marke jederzeit wechseln, dann wird die Vorlage neu auf die echten Farben dieser Marke abgestimmt.'},
    {q: 'Warum sind Glitzer- und Neonperlen zuerst aus?', a: 'Sie sehen nach dem Bügeln anders aus, deshalb kann eine am Bildschirm passende Farbe auf der Platte falsch wirken. Schalte sie bei Bedarf in den Einstellungen dazu.'},
    {q: 'Was macht Dithering?', a: 'Es mischt zwei benachbarte Farben zu einem Punktmuster und täuscht so die Farben dazwischen vor. Das hilft bei Fotos und Verläufen, lässt flache Comic-Bilder aber unruhig aussehen.'},
    {q: 'Wird mein Bild hochgeladen?', a: 'Nein. Die Umwandlung läuft in deinem Browser. Das zuletzt genutzte Bild bleibt nur in diesem Browser gespeichert.'},
]

export const DE_PAGES: DePage[] = [
    {
        slug: 'buegelperlen-vorlagen',
        en: '/',
        kind: 'maker',
        h1: 'Bügelperlen Vorlagen aus Fotos erstellen',
        intro: 'Lade ein Bild hoch und erhalte eine Vorlage in echten Perler-, Hama-, Artkal-, Nabbi- oder MARD-Farben, mit Perlenzahl je Farbe und einer Druckseite für jede Stiftplatte.',
        metaTitle: 'Bügelperlen Vorlagen erstellen',
        metaDescription: 'Mach aus jedem Foto eine Bügelperlen-Vorlage in echten Perler-, Hama- oder Artkal-Farben, mit Perlenzahl und Druckseite je Platte. Kostenlos, ohne Anmeldung.',
        steps: STEPS,
        faq: FAQ,
    },
    {
        slug: 'hama-buegelperlen-vorlagen',
        en: '/hama-bead-pattern-maker',
        kind: 'maker',
        brand: 'hama',
        h1: 'Hama Bügelperlen Vorlagen erstellen',
        intro: 'Dein Bild wird auf die echten Hama-Midi-Farben mit ihren H-Nummern abgestimmt, damit die Einkaufsliste genau zu den Döschen im Laden passt.',
        metaTitle: 'Hama Vorlagen aus Fotos erstellen',
        metaDescription: 'Mach aus einem Foto eine Hama-Bügelperlen-Vorlage, abgestimmt auf die echten Hama-Midi-Farben mit H-Nummern, mit Perlenzahl und Druckseite je Platte.',
        steps: STEPS,
        faq: FAQ,
    },
    {
        slug: 'perler-buegelperlen-vorlagen',
        en: '/perler-bead-pattern-maker',
        kind: 'maker',
        brand: 'perler',
        h1: 'Perler Bügelperlen Vorlagen erstellen',
        intro: 'Dein Bild wird auf die echten Perler-Midi-Farben abgestimmt, nach Produktnummer und Farbname, mit Perlenzahl je Farbe.',
        metaTitle: 'Perler Vorlagen aus Fotos erstellen',
        metaDescription: 'Mach aus einem Foto eine Perler-Bügelperlen-Vorlage, abgestimmt auf echte Perler-Midi-Farben, mit Perlenzahl je Farbe und Druckseite je Stiftplatte.',
        steps: STEPS,
        faq: FAQ,
    },
    {
        slug: 'artkal-buegelperlen-vorlagen',
        en: '/artkal-bead-pattern-maker',
        kind: 'maker',
        brand: 'artkal',
        h1: 'Artkal Bügelperlen Vorlagen erstellen',
        intro: 'Artkal S hat viele eng beieinander liegende Töne, deshalb eignen sich diese Perlen besonders für Fotos und Farbverläufe.',
        metaTitle: 'Artkal Vorlagen aus Fotos erstellen',
        metaDescription: 'Mach aus einem Foto eine Artkal-S-Vorlage. Die vielen nahen Farbtöne eignen sich für Fotos und Verläufe, mit Perlenzahl und Druckseite je Platte.',
        steps: STEPS,
        faq: FAQ,
    },
    {
        slug: 'vorlagen',
        en: '/patterns',
        kind: 'gallery',
        h1: 'Kostenlose Bügelperlen Vorlagen',
        intro: 'Fertige Vorlagen zum Öffnen und Ausdrucken. Jede lässt sich in Perler-, Hama-, Artkal- oder MARD-Farben umrechnen, mit Perlenzahl und Seite je Stiftplatte.',
        metaTitle: 'Kostenlose Bügelperlen Vorlagen',
        metaDescription: 'Fertige Bügelperlen-Vorlagen zum Ausdrucken, in echten Perler-, Hama- oder Artkal-Farben, mit Perlenzahl je Farbe und einer Seite je Stiftplatte. Kostenlos.',
    },
]

export const DE_BY_SLUG = (slug: string) => DE_PAGES.find(p => p.slug === slug) ?? null
export const dePath = (p: DePage) => `/de/${p.slug}`
// hreflang pairs for one page: both languages, and English is also x-default.
export const deAlternates = (p: DePage) => [{lang: 'en', path: p.en}, {lang: 'de', path: dePath(p)}]
// The reverse lookup, so an English page can declare its German twin.
export const DE_FOR_EN = (path: string) => DE_PAGES.find(p => p.en === path) ?? null
