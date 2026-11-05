// The languages this site ships beyond English.
//
// Picked from Bing impressions, July–November 2026 (ops/seo/easybeadpattern-
// converter-matrix.md). Japanese is the largest market by a wide margin;
// in Spanish, Portuguese and Italian people search the English brand name
// "hama beads" rather than a translated noun, so those head terms stay
// English on purpose. Finnish is left out: every phrasing measured zero.
//
// Two rules carried over from freegraphpaper's i18n:
//   - slugs are ASCII with no diacritics, but titles and headings keep them;
//   - German does not lowercase nouns mid-sentence.
export type Locale = 'de' | 'ja' | 'pt' | 'fr' | 'es' | 'nl' | 'pl' | 'sv' | 'da' | 'no' | 'it'

export interface LocaleUi {
    // Main navigation, in the order the English header uses.
    nav: { home: string; designer: string; beadwork: string; letters: string; patterns: string; colors: string }
    pager: { prev: string; next: string; of: (page: number, pages: number) => string }
    // Shown when a listing has nothing in it.
    empty: string
    // The line under a pattern card, and the thumbnail's alt text. Pattern
    // names come from the shared library and stay English.
    card: (w: number, h: number, colors: number) => string
    cardAlt: (name: string, w: number, h: number) => string
    // Section headings on a maker page.
    steps: string
    more: string
    faq: string
    // Points at the English site for the tools that are not translated. The
    // sentence holds its own link position, spacing and full stop: Japanese
    // ends in 。 and sets no space around the link, and the template must not
    // decide either of those.
    english: string
    englishLink: string
    // Title of the saved pattern inside the workbench.
    patternTitle: string
    // Footer. The tool pages themselves are English, so the footer names them
    // in this language and the English note below the columns says as much.
    footer: {
        makers: string
        maker: (brand: string) => string
        charts: string
        chart: (brand: string) => string
        // Heading over the sibling sites, whose names need no translating.
        tools: string
        patterns: string
        all: string
        themes: string
        easy: string
        medium: string
        hard: string
        // Heading of the language row, which every page carries.
        languages: string
    }
}

export interface LocaleMeta {
    code: Locale
    // URL prefix: /de, /ja …
    prefix: string
    // hreflang value and <html lang>.
    hreflang: string
    // What this language is called in itself, for the language list.
    name: string
    ui: LocaleUi
}

export const LOCALES: Record<Locale, LocaleMeta> = {
    de: {
        code: 'de', prefix: '/de', hreflang: 'de', name: 'Deutsch',
        ui: {
            nav: {home: 'Bügelperlen', designer: 'Designer', beadwork: 'Perlenarbeit', letters: 'Buchstaben', patterns: 'Vorlagen', colors: 'Farben'},
            pager: {prev: 'Zurück', next: 'Weiter', of: (p, n) => `Seite ${p} von ${n}`},
            empty: 'Hier gibt es noch keine Vorlagen.',
            card: (w, h, c) => `${w} × ${h} Perlen, ${c} Farbe${c > 1 ? 'n' : ''}`,
            cardAlt: (n, w, h) => `Bügelperlen-Vorlage ${n}, ${w} mal ${h} Perlen`,
            steps: 'Vom Foto zur Stiftplatte',
            more: 'Weitere Seiten auf Deutsch',
            faq: 'Häufige Fragen',
            english: 'Alle Werkzeuge — Kandi, Webrahmen, Peyote, Kreuzstich — gibt es auf {link}.',
            englishLink: 'der englischen Seite',
            patternTitle: 'Meine Vorlage',
            footer: {
                makers: 'Vorlagen-Generatoren', maker: b => `${b} Vorlagen`,
                charts: 'Farbtabellen', chart: b => `${b} Farbtabelle`,
                tools: 'Weitere Tools',
                patterns: 'Vorlagen', all: 'Alle Vorlagen', themes: 'Themen A bis Z',
                easy: 'Einfache Vorlagen', medium: 'Mittlere Vorlagen', hard: 'Schwere Vorlagen',
                languages: 'Sprache',
            },
        },
    },
    ja: {
        code: 'ja', prefix: '/ja', hreflang: 'ja', name: '日本語',
        ui: {
            nav: {home: 'アイロンビーズ', designer: 'デザイナー', beadwork: 'ビーズ織り', letters: '文字', patterns: '図案', colors: '色'},
            pager: {prev: '前へ', next: '次へ', of: (p, n) => `${n} ページ中 ${p} ページ目`},
            empty: 'まだ図案がありません。',
            card: (w, h, c) => `${w} × ${h} ビーズ、${c} 色`,
            cardAlt: (n, w, h) => `${n} のアイロンビーズ図案、${w} × ${h} ビーズ`,
            steps: '写真から図案をつくる',
            more: '日本語のほかのページ',
            faq: 'よくある質問',
            english: 'カンディ、ビーズ織り、ペヨーテ、クロスステッチなどの道具は{link}にあります。',
            englishLink: '英語版のページ',
            patternTitle: 'わたしの図案',
            footer: {
                makers: '図案メーカー', maker: b => `${b} の図案`,
                charts: 'カラーチャート', chart: b => `${b} のカラーチャート`,
                tools: 'ほかのツール',
                patterns: '図案', all: 'すべての図案', themes: 'テーマ A–Z',
                easy: 'やさしい図案', medium: 'ふつうの図案', hard: 'むずかしい図案',
                languages: '言語',
            },
        },
    },
    pt: {
        code: 'pt', prefix: '/pt', hreflang: 'pt-BR', name: 'Português',
        ui: {
            nav: {home: 'Hama beads', designer: 'Editor', beadwork: 'Miçangas', letters: 'Letras', patterns: 'Moldes', colors: 'Cores'},
            pager: {prev: 'Anterior', next: 'Próxima', of: (p, n) => `Página ${p} de ${n}`},
            empty: 'Ainda não há moldes aqui.',
            card: (w, h, c) => `${w} × ${h} contas, ${c} cor${c > 1 ? 'es' : ''}`,
            cardAlt: (n, w, h) => `Molde de hama beads ${n}, ${w} por ${h} contas`,
            steps: 'Da foto à placa',
            more: 'Outras páginas em português',
            faq: 'Perguntas frequentes',
            english: 'As outras ferramentas — kandi, tear, peyote, ponto cruz — estão {link}.',
            englishLink: 'na versão em inglês',
            patternTitle: 'Meu molde',
            footer: {
                makers: 'Geradores de molde', maker: b => `Moldes ${b}`,
                charts: 'Tabelas de cores', chart: b => `Tabela de cores ${b}`,
                tools: 'Mais ferramentas',
                patterns: 'Moldes', all: 'Todos os moldes', themes: 'Temas de A a Z',
                easy: 'Moldes fáceis', medium: 'Moldes médios', hard: 'Moldes difíceis',
                languages: 'Idioma',
            },
        },
    },
    fr: {
        code: 'fr', prefix: '/fr', hreflang: 'fr', name: 'Français',
        ui: {
            nav: {home: 'Perles à repasser', designer: 'Éditeur', beadwork: 'Tissage', letters: 'Lettres', patterns: 'Modèles', colors: 'Couleurs'},
            pager: {prev: 'Précédent', next: 'Suivant', of: (p, n) => `Page ${p} sur ${n}`},
            empty: 'Pas encore de modèles ici.',
            card: (w, h, c) => `${w} × ${h} perles, ${c} couleur${c > 1 ? 's' : ''}`,
            cardAlt: (n, w, h) => `Modèle de perles à repasser ${n}, ${w} sur ${h} perles`,
            steps: 'De la photo à la plaque',
            more: 'Autres pages en français',
            faq: 'Questions fréquentes',
            english: 'Les autres outils — kandi, métier à tisser, peyote, point de croix — sont sur {link}.',
            englishLink: 'la version anglaise',
            patternTitle: 'Mon modèle',
            footer: {
                makers: 'Générateurs de modèles', maker: b => `Modèles ${b}`,
                charts: 'Nuanciers', chart: b => `Nuancier ${b}`,
                tools: 'Autres outils',
                patterns: 'Modèles', all: 'Tous les modèles', themes: 'Thèmes de A à Z',
                easy: 'Modèles faciles', medium: 'Modèles moyens', hard: 'Modèles difficiles',
                languages: 'Langue',
            },
        },
    },
    es: {
        code: 'es', prefix: '/es', hreflang: 'es', name: 'Español',
        ui: {
            nav: {home: 'Hama beads', designer: 'Editor', beadwork: 'Abalorios', letters: 'Letras', patterns: 'Plantillas', colors: 'Colores'},
            pager: {prev: 'Anterior', next: 'Siguiente', of: (p, n) => `Página ${p} de ${n}`},
            empty: 'Todavía no hay plantillas aquí.',
            card: (w, h, c) => `${w} × ${h} cuentas, ${c} color${c > 1 ? 'es' : ''}`,
            cardAlt: (n, w, h) => `Plantilla de hama beads ${n}, ${w} por ${h} cuentas`,
            steps: 'De la foto a la placa',
            more: 'Otras páginas en español',
            faq: 'Preguntas frecuentes',
            english: 'Las demás herramientas — kandi, telar, peyote, punto de cruz — están en {link}.',
            englishLink: 'la versión en inglés',
            patternTitle: 'Mi plantilla',
            footer: {
                makers: 'Generadores de plantillas', maker: b => `Plantillas ${b}`,
                charts: 'Cartas de colores', chart: b => `Carta de colores ${b}`,
                tools: 'Más herramientas',
                patterns: 'Plantillas', all: 'Todas las plantillas', themes: 'Temas de la A a la Z',
                easy: 'Plantillas fáciles', medium: 'Plantillas medias', hard: 'Plantillas difíciles',
                languages: 'Idioma',
            },
        },
    },
    nl: {
        code: 'nl', prefix: '/nl', hreflang: 'nl', name: 'Nederlands',
        ui: {
            nav: {home: 'Strijkkralen', designer: 'Ontwerper', beadwork: 'Kralenwerk', letters: 'Letters', patterns: 'Patronen', colors: 'Kleuren'},
            pager: {prev: 'Vorige', next: 'Volgende', of: (p, n) => `Pagina ${p} van ${n}`},
            empty: 'Hier staan nog geen patronen.',
            card: (w, h, c) => `${w} × ${h} kralen, ${c} kleur${c > 1 ? 'en' : ''}`,
            cardAlt: (n, w, h) => `Strijkkralen patroon ${n}, ${w} bij ${h} kralen`,
            steps: 'Van foto naar grondplaat',
            more: 'Andere pagina’s in het Nederlands',
            faq: 'Veelgestelde vragen',
            english: 'De andere tools — kandi, weefraam, peyote, kruissteek — staan op {link}.',
            englishLink: 'de Engelse site',
            patternTitle: 'Mijn patroon',
            footer: {
                makers: 'Patroonmakers', maker: b => `${b} patronen`,
                charts: 'Kleurenkaarten', chart: b => `${b} kleurenkaart`,
                tools: 'Meer tools',
                patterns: 'Patronen', all: 'Alle patronen', themes: 'Thema’s van A tot Z',
                easy: 'Makkelijke patronen', medium: 'Gemiddelde patronen', hard: 'Moeilijke patronen',
                languages: 'Taal',
            },
        },
    },
    pl: {
        code: 'pl', prefix: '/pl', hreflang: 'pl', name: 'Polski',
        ui: {
            nav: {home: 'Koraliki', designer: 'Edytor', beadwork: 'Koralikarstwo', letters: 'Litery', patterns: 'Wzory', colors: 'Kolory'},
            pager: {prev: 'Wstecz', next: 'Dalej', of: (p, n) => `Strona ${p} z ${n}`},
            empty: 'Nie ma tu jeszcze wzorów.',
            card: (w, h, c) => `${w} × ${h} koralików, ${c} ${c === 1 ? 'kolor' : c < 5 ? 'kolory' : 'kolorów'}`,
            cardAlt: (n, w, h) => `Wzór z koralików do prasowania ${n}, ${w} na ${h} koralików`,
            steps: 'Od zdjęcia do podkładki',
            more: 'Inne strony po polsku',
            faq: 'Częste pytania',
            english: 'Pozostałe narzędzia — kandi, krosno, peyote, haft krzyżykowy — są na {link}.',
            englishLink: 'stronie angielskiej',
            patternTitle: 'Mój wzór',
            footer: {
                makers: 'Generatory wzorów', maker: b => `Wzory ${b}`,
                charts: 'Tabele kolorów', chart: b => `Tabela kolorów ${b}`,
                tools: 'Więcej narzędzi',
                patterns: 'Wzory', all: 'Wszystkie wzory', themes: 'Tematy od A do Z',
                easy: 'Łatwe wzory', medium: 'Średnie wzory', hard: 'Trudne wzory',
                languages: 'Język',
            },
        },
    },
    sv: {
        code: 'sv', prefix: '/sv', hreflang: 'sv', name: 'Svenska',
        ui: {
            nav: {home: 'Pärlplattor', designer: 'Designer', beadwork: 'Pärlarbete', letters: 'Bokstäver', patterns: 'Mallar', colors: 'Färger'},
            pager: {prev: 'Föregående', next: 'Nästa', of: (p, n) => `Sida ${p} av ${n}`},
            empty: 'Inga mallar här än.',
            card: (w, h, c) => `${w} × ${h} pärlor, ${c} färg${c > 1 ? 'er' : ''}`,
            cardAlt: (n, w, h) => `Pärlplattemall ${n}, ${w} gånger ${h} pärlor`,
            steps: 'Från foto till pärlplatta',
            more: 'Fler sidor på svenska',
            faq: 'Vanliga frågor',
            english: 'De andra verktygen — kandi, vävstol, peyote, korsstygn — finns på {link}.',
            englishLink: 'den engelska sidan',
            patternTitle: 'Min mall',
            footer: {
                makers: 'Mallgeneratorer', maker: b => `${b} mallar`,
                charts: 'Färgkartor', chart: b => `${b} färgkarta`,
                tools: 'Fler verktyg',
                patterns: 'Mallar', all: 'Alla mallar', themes: 'Teman A till Ö',
                easy: 'Lätta mallar', medium: 'Medelsvåra mallar', hard: 'Svåra mallar',
                languages: 'Språk',
            },
        },
    },
    da: {
        code: 'da', prefix: '/da', hreflang: 'da', name: 'Dansk',
        ui: {
            nav: {home: 'Perleplader', designer: 'Designer', beadwork: 'Perlearbejde', letters: 'Bogstaver', patterns: 'Mønstre', colors: 'Farver'},
            pager: {prev: 'Forrige', next: 'Næste', of: (p, n) => `Side ${p} af ${n}`},
            empty: 'Der er ingen mønstre her endnu.',
            card: (w, h, c) => `${w} × ${h} perler, ${c} farve${c > 1 ? 'r' : ''}`,
            cardAlt: (n, w, h) => `Perlepladesmønster ${n}, ${w} gange ${h} perler`,
            steps: 'Fra foto til perleplade',
            more: 'Flere sider på dansk',
            faq: 'Ofte stillede spørgsmål',
            english: 'De andre værktøjer — kandi, perlevæv, peyote, korssting — findes på {link}.',
            englishLink: 'den engelske side',
            patternTitle: 'Mit mønster',
            footer: {
                makers: 'Mønstergeneratorer', maker: b => `${b} mønstre`,
                charts: 'Farvekort', chart: b => `${b} farvekort`,
                tools: 'Flere værktøjer',
                patterns: 'Mønstre', all: 'Alle mønstre', themes: 'Temaer fra A til Å',
                easy: 'Lette mønstre', medium: 'Mellemsvære mønstre', hard: 'Svære mønstre',
                languages: 'Sprog',
            },
        },
    },
    no: {
        code: 'no', prefix: '/no', hreflang: 'nb', name: 'Norsk',
        ui: {
            nav: {home: 'Perlebrett', designer: 'Designer', beadwork: 'Perlearbeid', letters: 'Bokstaver', patterns: 'Mønstre', colors: 'Farger'},
            pager: {prev: 'Forrige', next: 'Neste', of: (p, n) => `Side ${p} av ${n}`},
            empty: 'Ingen mønstre her ennå.',
            card: (w, h, c) => `${w} × ${h} perler, ${c} farge${c > 1 ? 'r' : ''}`,
            cardAlt: (n, w, h) => `Perlemønster ${n}, ${w} ganger ${h} perler`,
            steps: 'Fra foto til perlebrett',
            more: 'Flere sider på norsk',
            faq: 'Vanlige spørsmål',
            english: 'De andre verktøyene — kandi, perlevev, peyote, korssting — finnes på {link}.',
            englishLink: 'den engelske siden',
            patternTitle: 'Mitt mønster',
            footer: {
                makers: 'Mønstergeneratorer', maker: b => `${b} mønstre`,
                charts: 'Fargekart', chart: b => `${b} fargekart`,
                tools: 'Flere verktøy',
                patterns: 'Mønstre', all: 'Alle mønstre', themes: 'Temaer fra A til Å',
                easy: 'Lette mønstre', medium: 'Middels mønstre', hard: 'Vanskelige mønstre',
                languages: 'Språk',
            },
        },
    },
    it: {
        code: 'it', prefix: '/it', hreflang: 'it', name: 'Italiano',
        ui: {
            nav: {home: 'Hama beads', designer: 'Editor', beadwork: 'Perline', letters: 'Lettere', patterns: 'Schemi', colors: 'Colori'},
            pager: {prev: 'Precedente', next: 'Successiva', of: (p, n) => `Pagina ${p} di ${n}`},
            empty: 'Non ci sono ancora schemi qui.',
            card: (w, h, c) => `${w} × ${h} perline, ${c} color${c > 1 ? 'i' : 'e'}`,
            cardAlt: (n, w, h) => `Schema hama beads ${n}, ${w} per ${h} perline`,
            steps: 'Dalla foto alla base',
            more: 'Altre pagine in italiano',
            faq: 'Domande frequenti',
            english: 'Gli altri strumenti — kandi, telaio, peyote, punto croce — sono sul {link}.',
            englishLink: 'sito in inglese',
            patternTitle: 'Il mio schema',
            footer: {
                makers: 'Generatori di schemi', maker: b => `Schemi ${b}`,
                charts: 'Tabelle colori', chart: b => `Tabella colori ${b}`,
                tools: 'Altri strumenti',
                patterns: 'Schemi', all: 'Tutti gli schemi', themes: 'Temi dalla A alla Z',
                easy: 'Schemi facili', medium: 'Schemi medi', hard: 'Schemi difficili',
                languages: 'Lingua',
            },
        },
    },
}

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[]
export const isLocale = (v: unknown): v is Locale => LOCALE_CODES.includes(v as Locale)

// The sentence that points at the English site, split around its link.
export function englishParts(ui: LocaleUi) {
    const [before = '', after = ''] = ui.english.split('{link}')
    return {before, after}
}
