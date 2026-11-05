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
    // Links to the English site for the tools that are not translated.
    englishNote: string
    englishLink: string
    // Title of the saved pattern inside the workbench.
    patternTitle: string
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
            englishNote: 'Alle Werkzeuge — Kandi, Webrahmen, Peyote, Kreuzstich — gibt es auf',
            englishLink: 'der englischen Seite',
            patternTitle: 'Meine Vorlage',
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
            englishNote: 'カンディ、ビーズ織り、ペヨーテ、クロスステッチなどの道具は',
            englishLink: '英語版のページ',
            patternTitle: 'わたしの図案',
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
            englishNote: 'As outras ferramentas — kandi, tear, peyote, ponto cruz — estão',
            englishLink: 'na versão em inglês',
            patternTitle: 'Meu molde',
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
            englishNote: 'Les autres outils — kandi, métier à tisser, peyote, point de croix — sont sur',
            englishLink: 'la version anglaise',
            patternTitle: 'Mon modèle',
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
            englishNote: 'Las demás herramientas — kandi, telar, peyote, punto de cruz — están en',
            englishLink: 'la versión en inglés',
            patternTitle: 'Mi plantilla',
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
            englishNote: 'De andere tools — kandi, weefraam, peyote, kruissteek — staan op',
            englishLink: 'de Engelse site',
            patternTitle: 'Mijn patroon',
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
            englishNote: 'Pozostałe narzędzia — kandi, krosno, peyote, haft krzyżykowy — są na',
            englishLink: 'stronie angielskiej',
            patternTitle: 'Mój wzór',
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
            englishNote: 'De andra verktygen — kandi, vävstol, peyote, korsstygn — finns på',
            englishLink: 'den engelska sidan',
            patternTitle: 'Min mall',
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
            englishNote: 'De andre værktøjer — kandi, perlevæv, peyote, korssting — findes på',
            englishLink: 'den engelske side',
            patternTitle: 'Mit mønster',
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
            englishNote: 'De andre verktøyene — kandi, perlevev, peyote, korssting — finnes på',
            englishLink: 'den engelske siden',
            patternTitle: 'Mitt mønster',
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
            englishNote: 'Gli altri strumenti — kandi, telaio, peyote, punto croce — sono sul',
            englishLink: 'sito in inglese',
            patternTitle: 'Il mio schema',
        },
    },
}

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[]
export const isLocale = (v: unknown): v is Locale => LOCALE_CODES.includes(v as Locale)
