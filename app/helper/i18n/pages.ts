// The translated pages, written by hand per language rather than generated.
// Every title, description, step and answer is read through before shipping:
// FreeConvert left "Quell-Ziel-Konverter" in two thirds of its German meta
// descriptions, and that is the mistake this file exists to avoid.
//
// Each language gets three pages: the maker on its head term, one brand page,
// and the pattern gallery. German has five because it shipped first.
import type {BrandId} from '../beads/brands'
import type {Locale} from './locales'

export interface LocalePage {
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

// --- German -----------------------------------------------------------------
const DE_STEPS = [
    {title: 'Bild hochladen', text: 'Foto, Zeichnung oder Pixel-Art. Die Umwandlung läuft im Browser, das Bild wird nicht hochgeladen.'},
    {title: 'Größe und Farben wählen', text: 'Lege fest, wie viele Stiftplatten die Vorlage füllt und wie viele Farben du kaufen willst. Jede Farbe ist eine echte Perle.'},
    {title: 'Farben aufräumen', text: 'Klicke eine Farbe in der Liste an, um zu sehen, wo sie liegt, und tausche sie gegen eine andere Perle oder nimm sie heraus.'},
    {title: 'Drucken und stecken', text: 'Das PDF hat eine Seite pro Stiftplatte mit einer nummerierten Farbe in jedem Stift, dazu die Einkaufsliste aller Perlen.'},
]
const DE_FAQ = [
    {q: 'Wie groß ist eine Stiftplatte?', a: 'Die Vorlage wird in große quadratische Platten zu 29 × 29 Stiften geteilt. Eine Vorlage mit 58 Perlen Breite füllt 2 × 2 Platten. Bei 5-mm-Perlen ist eine Platte etwa 14,5 cm breit.'},
    {q: 'Welche Marken kann ich verwenden?', a: 'Perler, Hama, Artkal, Nabbi und MARD. Du kannst die Marke jederzeit wechseln, dann wird die Vorlage neu auf die echten Farben dieser Marke abgestimmt.'},
    {q: 'Warum sind Glitzer- und Neonperlen zuerst aus?', a: 'Sie sehen nach dem Bügeln anders aus, deshalb kann eine am Bildschirm passende Farbe auf der Platte falsch wirken. Schalte sie bei Bedarf in den Einstellungen dazu.'},
    {q: 'Was macht Dithering?', a: 'Es mischt zwei benachbarte Farben zu einem Punktmuster und täuscht so die Farben dazwischen vor. Das hilft bei Fotos und Verläufen, lässt flache Comic-Bilder aber unruhig aussehen.'},
    {q: 'Wird mein Bild hochgeladen?', a: 'Nein. Die Umwandlung läuft in deinem Browser. Das zuletzt genutzte Bild bleibt nur in diesem Browser gespeichert.'},
]

// --- Japanese ---------------------------------------------------------------
const JA_STEPS = [
    {title: '画像を読み込む', text: '写真でもイラストでもドット絵でもかまいません。変換はブラウザ内で行われ、画像がアップロードされることはありません。'},
    {title: '大きさと色数を決める', text: 'プレート何枚分にするか、何色まで使うかを選びます。どの色も実際に買えるビーズです。'},
    {title: '色を整える', text: '色一覧をクリックするとその色の位置が光ります。別のビーズに置き換えたり、取り除いたりできます。'},
    {title: '印刷して並べる', text: 'PDF はプレート 1 枚につき 1 ページ。各ピンに色番号が入り、必要なビーズの一覧も付きます。'},
]
const JA_FAQ = [
    {q: 'プレート 1 枚の大きさは？', a: '図案は 29 × 29 ピンの大きな四角いプレート単位で分割されます。幅 58 ビーズの図案なら 2 × 2 枚分です。5 mm ビーズなら 1 枚は約 14.5 cm です。'},
    {q: '対応しているメーカーは？', a: 'パーラービーズ、ハマ、アートカル、ナビ、MARD です。途中でメーカーを変えると、そのメーカーの実際の色で図案が作り直されます。'},
    {q: 'ラメや蛍光色が最初はオフなのはなぜ？', a: 'アイロンをかけると見え方が変わるため、画面上で近い色でも仕上がりがずれることがあります。必要なら設定でオンにしてください。'},
    {q: 'ディザリングとは？', a: '隣り合う 2 色を点状に混ぜて中間色に見せる方法です。写真やグラデーションには有効ですが、ベタ塗りのイラストでは粒が目立ちます。'},
    {q: '画像はアップロードされますか？', a: 'いいえ。変換はブラウザの中だけで行われ、最後に使った画像もこのブラウザにしか残りません。'},
]

// --- Portuguese -------------------------------------------------------------
const PT_STEPS = [
    {title: 'Envie uma imagem', text: 'Foto, desenho ou pixel art. A conversão acontece no seu navegador e a imagem não é enviada para lugar nenhum.'},
    {title: 'Escolha tamanho e cores', text: 'Defina quantas placas o molde ocupa e quantas cores quer comprar. Cada cor é uma conta que existe de verdade.'},
    {title: 'Ajuste as cores', text: 'Clique numa cor da lista para ver onde ela fica, depois troque por outra conta ou remova.'},
    {title: 'Imprima e monte', text: 'O PDF traz uma página por placa, com um número de cor em cada pino, e a lista de contas que você precisa comprar.'},
]
const PT_FAQ = [
    {q: 'Qual o tamanho de uma placa?', a: 'O molde é dividido em placas quadradas grandes de 29 × 29 pinos. Um molde de 58 contas de largura ocupa 2 × 2 placas. Com contas de 5 mm, uma placa tem cerca de 14,5 cm.'},
    {q: 'Quais marcas posso usar?', a: 'Perler, Hama, Artkal, Nabbi e MARD. Troque de marca quando quiser: o molde é recalculado para as cores reais daquela marca.'},
    {q: 'Por que contas com glitter e neon vêm desligadas?', a: 'Elas mudam de aparência depois de passar o ferro, então uma cor que combina na tela pode ficar errada na placa. Ligue nas opções se quiser usá-las.'},
    {q: 'O que faz o dithering?', a: 'Mistura duas cores vizinhas em pontinhos para simular os tons entre elas. Ajuda em fotos e degradês, mas deixa desenhos chapados com aspecto granulado.'},
    {q: 'Minha imagem é enviada para algum servidor?', a: 'Não. A conversão roda no seu navegador, e a última imagem usada fica guardada só nele.'},
]

// --- French -----------------------------------------------------------------
const FR_STEPS = [
    {title: 'Ajoutez une image', text: 'Photo, dessin ou pixel art. La conversion se fait dans votre navigateur : l’image n’est jamais envoyée.'},
    {title: 'Choisissez taille et couleurs', text: 'Décidez combien de plaques le modèle occupe et combien de couleurs acheter. Chaque couleur est une perle qui existe vraiment.'},
    {title: 'Affinez les couleurs', text: 'Cliquez sur une couleur de la liste pour voir où elle se trouve, puis remplacez-la par une autre perle ou retirez-la.'},
    {title: 'Imprimez et placez', text: 'Le PDF contient une page par plaque, avec un numéro de couleur sur chaque picot, et la liste des perles à acheter.'},
]
const FR_FAQ = [
    {q: 'Quelle est la taille d’une plaque ?', a: 'Le modèle est découpé en grandes plaques carrées de 29 × 29 picots. Un modèle de 58 perles de large occupe 2 × 2 plaques. Avec des perles de 5 mm, une plaque fait environ 14,5 cm.'},
    {q: 'Quelles marques puis-je utiliser ?', a: 'Perler, Hama, Artkal, Nabbi et MARD. Changez de marque quand vous voulez : le modèle est recalculé avec les vraies couleurs de cette marque.'},
    {q: 'Pourquoi les perles pailletées et fluo sont-elles désactivées ?', a: 'Elles changent d’aspect après le repassage, donc une couleur qui semble juste à l’écran peut être fausse sur la plaque. Activez-les dans les options si vous en avez.'},
    {q: 'À quoi sert le tramage ?', a: 'Il mélange deux couleurs voisines en semis de points pour imiter les teintes intermédiaires. Utile pour les photos et les dégradés, bruyant sur les aplats.'},
    {q: 'Mon image est-elle envoyée quelque part ?', a: 'Non. La conversion a lieu dans votre navigateur, et la dernière image utilisée n’est conservée que sur cet appareil.'},
]

// --- Spanish ----------------------------------------------------------------
const ES_STEPS = [
    {title: 'Sube una imagen', text: 'Foto, dibujo o pixel art. La conversión ocurre en tu navegador y la imagen no se sube a ningún sitio.'},
    {title: 'Elige tamaño y colores', text: 'Decide cuántas placas ocupa la plantilla y cuántos colores quieres comprar. Cada color es una cuenta que existe de verdad.'},
    {title: 'Ajusta los colores', text: 'Haz clic en un color de la lista para ver dónde cae, y cámbialo por otra cuenta o quítalo.'},
    {title: 'Imprime y monta', text: 'El PDF trae una página por placa, con un número de color en cada pincho, y la lista de cuentas que necesitas.'},
]
const ES_FAQ = [
    {q: '¿Cuánto mide una placa?', a: 'La plantilla se divide en placas cuadradas grandes de 29 × 29 pinchos. Una plantilla de 58 cuentas de ancho ocupa 2 × 2 placas. Con cuentas de 5 mm, una placa mide unos 14,5 cm.'},
    {q: '¿Qué marcas puedo usar?', a: 'Perler, Hama, Artkal, Nabbi y MARD. Cambia de marca cuando quieras: la plantilla se recalcula con los colores reales de esa marca.'},
    {q: '¿Por qué las cuentas con purpurina y neón están desactivadas?', a: 'Cambian de aspecto al plancharlas, así que un color que encaja en pantalla puede quedar mal en la placa. Actívalas en las opciones si las tienes.'},
    {q: '¿Qué hace el tramado?', a: 'Mezcla dos colores vecinos en un patrón de puntos para simular los tonos intermedios. Va bien con fotos y degradados, y mal con dibujos planos.'},
    {q: '¿Se sube mi imagen a algún servidor?', a: 'No. La conversión se ejecuta en tu navegador y la última imagen usada se queda solo ahí.'},
]

// --- Dutch ------------------------------------------------------------------
const NL_STEPS = [
    {title: 'Voeg een afbeelding toe', text: 'Foto, tekening of pixelart. Het omzetten gebeurt in je browser; de afbeelding wordt nergens heen gestuurd.'},
    {title: 'Kies formaat en kleuren', text: 'Bepaal hoeveel grondplaten het patroon vult en hoeveel kleuren je wilt kopen. Elke kleur is een kraal die echt bestaat.'},
    {title: 'Werk de kleuren bij', text: 'Klik op een kleur in de lijst om te zien waar die ligt, en ruil hem om voor een andere kraal of haal hem weg.'},
    {title: 'Print en leg', text: 'De PDF heeft één pagina per grondplaat, met een kleurnummer op elke pin, plus het lijstje kralen dat je nodig hebt.'},
]
const NL_FAQ = [
    {q: 'Hoe groot is één grondplaat?', a: 'Het patroon wordt verdeeld over grote vierkante platen van 29 × 29 pinnen. Een patroon van 58 kralen breed vult 2 × 2 platen. Met kralen van 5 mm is één plaat ongeveer 14,5 cm.'},
    {q: 'Welke merken kan ik gebruiken?', a: 'Perler, Hama, Artkal, Nabbi en MARD. Wissel wanneer je wilt van merk: het patroon wordt opnieuw berekend met de echte kleuren van dat merk.'},
    {q: 'Waarom staan glitter- en neonkralen uit?', a: 'Ze zien er na het strijken anders uit, dus een kleur die op het scherm klopt kan op de plaat misstaan. Zet ze aan bij de opties als je ze hebt.'},
    {q: 'Wat doet dithering?', a: 'Het mengt twee naburige kleuren in een puntpatroon om de tinten ertussen na te bootsen. Handig bij foto’s en verlopen, rommelig bij vlakke tekeningen.'},
    {q: 'Wordt mijn afbeelding geüpload?', a: 'Nee. Het omzetten gebeurt in je browser en de laatst gebruikte afbeelding blijft alleen daar staan.'},
]

// --- Polish -----------------------------------------------------------------
const PL_STEPS = [
    {title: 'Wczytaj obraz', text: 'Zdjęcie, rysunek albo pixel art. Konwersja działa w przeglądarce, obraz nigdzie nie jest wysyłany.'},
    {title: 'Wybierz rozmiar i kolory', text: 'Zdecyduj, ile podkładek zajmie wzór i ile kolorów chcesz kupić. Każdy kolor to koralik, który naprawdę istnieje.'},
    {title: 'Popraw kolory', text: 'Kliknij kolor na liście, żeby zobaczyć, gdzie leży, a potem zamień go na inny koralik albo usuń.'},
    {title: 'Wydrukuj i układaj', text: 'PDF ma jedną stronę na podkładkę, z numerem koloru przy każdym bolcu, oraz listę koralików do kupienia.'},
]
const PL_FAQ = [
    {q: 'Jak duża jest jedna podkładka?', a: 'Wzór dzieli się na duże kwadratowe podkładki 29 × 29 bolców. Wzór o szerokości 58 koralików zajmuje 2 × 2 podkładki. Przy koralikach 5 mm jedna podkładka ma około 14,5 cm.'},
    {q: 'Jakich marek mogę używać?', a: 'Perler, Hama, Artkal, Nabbi i MARD. Markę można zmienić w każdej chwili — wzór zostanie przeliczony na prawdziwe kolory tej marki.'},
    {q: 'Dlaczego koraliki brokatowe i neonowe są wyłączone?', a: 'Po prasowaniu wyglądają inaczej, więc kolor pasujący na ekranie może zawieść na podkładce. Włącz je w opcjach, jeśli je masz.'},
    {q: 'Co robi dithering?', a: 'Miesza dwa sąsiednie kolory w deseń z kropek, żeby udać odcienie pośrednie. Pomaga przy zdjęciach i gradientach, szkodzi płaskim rysunkom.'},
    {q: 'Czy mój obraz jest wysyłany na serwer?', a: 'Nie. Konwersja działa w przeglądarce, a ostatnio użyty obraz zostaje tylko na tym urządzeniu.'},
]

// --- Swedish ----------------------------------------------------------------
const SV_STEPS = [
    {title: 'Lägg till en bild', text: 'Foto, teckning eller pixelkonst. Omvandlingen sker i din webbläsare och bilden skickas aldrig vidare.'},
    {title: 'Välj storlek och färger', text: 'Bestäm hur många pärlplattor mallen fyller och hur många färger du vill köpa. Varje färg är en pärla som finns på riktigt.'},
    {title: 'Putsa färgerna', text: 'Klicka på en färg i listan för att se var den ligger, och byt ut den mot en annan pärla eller ta bort den.'},
    {title: 'Skriv ut och lägg', text: 'PDF:en har en sida per platta, med ett färgnummer på varje pigg, och listan över pärlor du behöver.'},
]
const SV_FAQ = [
    {q: 'Hur stor är en pärlplatta?', a: 'Mallen delas upp i stora fyrkantiga plattor med 29 × 29 piggar. En mall som är 58 pärlor bred fyller 2 × 2 plattor. Med 5 mm-pärlor är en platta ungefär 14,5 cm.'},
    {q: 'Vilka märken kan jag använda?', a: 'Perler, Hama, Artkal, Nabbi och MARD. Byt märke när du vill — mallen räknas om mot det märkets riktiga färger.'},
    {q: 'Varför är glitter- och neonpärlor avstängda?', a: 'De ser annorlunda ut efter strykningen, så en färg som stämmer på skärmen kan bli fel på plattan. Slå på dem under alternativen om du har dem.'},
    {q: 'Vad gör dithering?', a: 'Den blandar två närliggande färger i ett punktmönster för att härma tonerna emellan. Bra för foton och övergångar, stökigt för platta motiv.'},
    {q: 'Laddas min bild upp?', a: 'Nej. Omvandlingen sker i din webbläsare, och den senast använda bilden stannar bara där.'},
]

// --- Danish -----------------------------------------------------------------
const DA_STEPS = [
    {title: 'Tilføj et billede', text: 'Foto, tegning eller pixelkunst. Omdannelsen sker i din browser, og billedet bliver aldrig sendt videre.'},
    {title: 'Vælg størrelse og farver', text: 'Bestem hvor mange perleplader mønsteret fylder, og hvor mange farver du vil købe. Hver farve er en perle, der findes i virkeligheden.'},
    {title: 'Ret farverne til', text: 'Klik på en farve i listen for at se, hvor den ligger, og byt den ud med en anden perle eller tag den væk.'},
    {title: 'Print og læg', text: 'PDF’en har én side per plade med et farvenummer ved hver pind, plus listen over de perler, du skal bruge.'},
]
const DA_FAQ = [
    {q: 'Hvor stor er én perleplade?', a: 'Mønsteret deles op i store firkantede plader på 29 × 29 pinde. Et mønster på 58 perler i bredden fylder 2 × 2 plader. Med 5 mm-perler er én plade cirka 14,5 cm.'},
    {q: 'Hvilke mærker kan jeg bruge?', a: 'Perler, Hama, Artkal, Nabbi og MARD. Skift mærke når du vil — mønsteret bliver regnet om efter det mærkes rigtige farver.'},
    {q: 'Hvorfor er glimmer- og neonperler slået fra?', a: 'De ser anderledes ud efter strygning, så en farve, der passer på skærmen, kan ramme forkert på pladen. Slå dem til under indstillinger, hvis du har dem.'},
    {q: 'Hvad gør dithering?', a: 'Den blander to nabofarver i et punktmønster for at efterligne tonerne imellem. Godt til fotos og overgange, uroligt på flade motiver.'},
    {q: 'Bliver mit billede uploadet?', a: 'Nej. Omdannelsen kører i din browser, og det sidst brugte billede blíver kun liggende dér.'},
]

// --- Norwegian --------------------------------------------------------------
const NO_STEPS = [
    {title: 'Legg til et bilde', text: 'Foto, tegning eller pikselkunst. Omgjøringen skjer i nettleseren din, og bildet blir aldri sendt videre.'},
    {title: 'Velg størrelse og farger', text: 'Bestem hvor mange perlebrett mønsteret fyller, og hvor mange farger du vil kjøpe. Hver farge er en perle som finnes på ekte.'},
    {title: 'Rydd opp i fargene', text: 'Klikk på en farge i listen for å se hvor den ligger, og bytt den ut med en annen perle eller fjern den.'},
    {title: 'Skriv ut og legg', text: 'PDF-en har én side per brett, med et fargenummer ved hver pigg, og listen over perlene du trenger.'},
]
const NO_FAQ = [
    {q: 'Hvor stort er ett perlebrett?', a: 'Mønsteret deles i store firkantede brett på 29 × 29 pigger. Et mønster som er 58 perler bredt fyller 2 × 2 brett. Med 5 mm-perler er ett brett omtrent 14,5 cm.'},
    {q: 'Hvilke merker kan jeg bruke?', a: 'Perler, Hama, Artkal, Nabbi og MARD. Bytt merke når du vil — mønsteret regnes om etter de ekte fargene til det merket.'},
    {q: 'Hvorfor er glitter- og neonperler av?', a: 'De ser annerledes ut etter strykingen, så en farge som stemmer på skjermen kan bomme på brettet. Slå dem på under valgene hvis du har dem.'},
    {q: 'Hva gjør dithering?', a: 'Den blander to nabofarger i et punktmønster for å herme tonene imellom. Bra for foto og overganger, urolig på flate motiver.'},
    {q: 'Blir bildet mitt lastet opp?', a: 'Nei. Omgjøringen skjer i nettleseren din, og det sist brukte bildet blir bare liggende der.'},
]

// --- Italian ----------------------------------------------------------------
const IT_STEPS = [
    {title: 'Carica un’immagine', text: 'Foto, disegno o pixel art. La conversione avviene nel browser e l’immagine non viene mai inviata altrove.'},
    {title: 'Scegli misura e colori', text: 'Decidi quante basi occupa lo schema e quanti colori vuoi comprare. Ogni colore è una perlina che esiste davvero.'},
    {title: 'Sistema i colori', text: 'Clicca un colore nell’elenco per vedere dove cade, poi sostituiscilo con un’altra perlina oppure toglilo.'},
    {title: 'Stampa e componi', text: 'Il PDF ha una pagina per base, con un numero di colore su ogni pioletto, e l’elenco delle perline da comprare.'},
]
const IT_FAQ = [
    {q: 'Quanto misura una base?', a: 'Lo schema viene diviso in grandi basi quadrate da 29 × 29 pioletti. Uno schema largo 58 perline occupa 2 × 2 basi. Con perline da 5 mm una base misura circa 14,5 cm.'},
    {q: 'Quali marche posso usare?', a: 'Perler, Hama, Artkal, Nabbi e MARD. Cambia marca quando vuoi: lo schema viene ricalcolato sui colori reali di quella marca.'},
    {q: 'Perché le perline glitter e fluo sono disattivate?', a: 'Dopo la stiratura cambiano aspetto, quindi un colore giusto a schermo può risultare sbagliato sulla base. Attivale nelle opzioni se le hai.'},
    {q: 'A cosa serve il dithering?', a: 'Mescola due colori vicini in un retino di punti per simulare le tonalità intermedie. Utile per foto e sfumature, disturbante sui disegni piatti.'},
    {q: 'La mia immagine viene caricata online?', a: 'No. La conversione gira nel browser e l’ultima immagine usata resta soltanto lì.'},
]

// Slugs are ASCII without diacritics; titles and headings keep them.
export const PAGES: Record<Locale, LocalePage[]> = {
    de: [
        {slug: 'buegelperlen-vorlagen', en: '/', kind: 'maker',
            h1: 'Bügelperlen Vorlagen aus Fotos erstellen',
            intro: 'Lade ein Bild hoch und erhalte eine Vorlage in echten Perler-, Hama-, Artkal-, Nabbi- oder MARD-Farben, mit Perlenzahl je Farbe und einer Druckseite für jede Stiftplatte.',
            metaTitle: 'Bügelperlen Vorlagen erstellen',
            metaDescription: 'Mach aus jedem Foto eine Bügelperlen-Vorlage in echten Perler-, Hama- oder Artkal-Farben, mit Perlenzahl und Druckseite je Platte. Kostenlos, ohne Anmeldung.',
            steps: DE_STEPS, faq: DE_FAQ},
        {slug: 'hama-buegelperlen-vorlagen', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Hama Bügelperlen Vorlagen erstellen',
            intro: 'Dein Bild wird auf die echten Hama-Midi-Farben mit ihren H-Nummern abgestimmt, damit die Einkaufsliste genau zu den Döschen im Laden passt.',
            metaTitle: 'Hama Vorlagen aus Fotos erstellen',
            metaDescription: 'Mach aus einem Foto eine Hama-Bügelperlen-Vorlage, abgestimmt auf die echten Hama-Midi-Farben mit H-Nummern, mit Perlenzahl und Druckseite je Platte.',
            steps: DE_STEPS, faq: DE_FAQ},
        {slug: 'perler-buegelperlen-vorlagen', en: '/perler-bead-pattern-maker', kind: 'maker', brand: 'perler',
            h1: 'Perler Bügelperlen Vorlagen erstellen',
            intro: 'Dein Bild wird auf die echten Perler-Midi-Farben abgestimmt, nach Produktnummer und Farbname, mit Perlenzahl je Farbe.',
            metaTitle: 'Perler Vorlagen aus Fotos erstellen',
            metaDescription: 'Mach aus einem Foto eine Perler-Bügelperlen-Vorlage, abgestimmt auf echte Perler-Midi-Farben, mit Perlenzahl je Farbe und Druckseite je Stiftplatte.',
            steps: DE_STEPS, faq: DE_FAQ},
        {slug: 'artkal-buegelperlen-vorlagen', en: '/artkal-bead-pattern-maker', kind: 'maker', brand: 'artkal',
            h1: 'Artkal Bügelperlen Vorlagen erstellen',
            intro: 'Artkal S hat viele eng beieinander liegende Töne, deshalb eignen sich diese Perlen besonders für Fotos und Farbverläufe.',
            metaTitle: 'Artkal Vorlagen aus Fotos erstellen',
            metaDescription: 'Mach aus einem Foto eine Artkal-S-Vorlage. Die vielen nahen Farbtöne eignen sich für Fotos und Verläufe, mit Perlenzahl und Druckseite je Platte.',
            steps: DE_STEPS, faq: DE_FAQ},
        {slug: 'vorlagen', en: '/patterns', kind: 'gallery',
            h1: 'Kostenlose Bügelperlen Vorlagen',
            intro: 'Fertige Vorlagen zum Öffnen und Ausdrucken. Jede lässt sich in Perler-, Hama-, Artkal- oder MARD-Farben umrechnen, mit Perlenzahl und Seite je Stiftplatte.',
            metaTitle: 'Kostenlose Bügelperlen Vorlagen',
            metaDescription: 'Fertige Bügelperlen-Vorlagen zum Ausdrucken, in echten Perler-, Hama- oder Artkal-Farben, mit Perlenzahl je Farbe und einer Seite je Stiftplatte. Kostenlos.'},
    ],
    ja: [
        {slug: 'aironbiizu-zuan', en: '/', kind: 'maker',
            h1: '写真からアイロンビーズの図案をつくる',
            intro: '画像を読み込むと、パーラービーズ・ハマ・アートカル・ナビ・MARD の実際の色に合わせた図案になります。色ごとの必要数と、プレート 1 枚ごとの印刷ページ付き。',
            metaTitle: 'アイロンビーズ図案を無料でつくる',
            metaDescription: '写真をアイロンビーズの図案に変換。パーラービーズやハマの実際の色に合わせ、色ごとの必要数とプレートごとの印刷ページが付きます。登録不要・無料。',
            steps: JA_STEPS, faq: JA_FAQ},
        {slug: 'paarabiizu-zuan', en: '/perler-bead-pattern-maker', kind: 'maker', brand: 'perler',
            h1: 'パーラービーズの図案をつくる',
            intro: '画像をパーラービーズ ミディの実際の色に合わせます。製品番号と色名で照合するので、買い足すときに迷いません。',
            metaTitle: 'パーラービーズ図案メーカー',
            metaDescription: '写真からパーラービーズの図案を作成。ミディ 5 mm の実際の色に合わせ、色ごとの必要数とプレートごとの印刷ページが付きます。無料。',
            steps: JA_STEPS, faq: JA_FAQ},
        {slug: 'muryou-zuan', en: '/patterns', kind: 'gallery',
            h1: '無料のアイロンビーズ図案',
            intro: 'そのまま開いて印刷できる図案集です。どれでもパーラービーズ・ハマ・アートカル・MARD の色に置き換えられ、必要数とプレートごとのページが付きます。',
            metaTitle: 'アイロンビーズ図案 無料',
            metaDescription: '印刷してすぐ使える無料のアイロンビーズ図案。パーラービーズやハマの実際の色に置き換えられ、色ごとの必要数とプレートごとのページが付きます。'},
    ],
    pt: [
        {slug: 'hama-beads-moldes', en: '/', kind: 'maker',
            h1: 'Transforme uma foto em molde de hama beads',
            intro: 'Envie uma imagem e receba um molde nas cores reais de Perler, Hama, Artkal, Nabbi ou MARD, com a contagem por cor e uma página impressa para cada placa.',
            metaTitle: 'Moldes de hama beads a partir de fotos',
            metaDescription: 'Transforme qualquer foto num molde de hama beads com as cores reais de Perler, Hama ou Artkal, contagem por cor e uma página por placa. Grátis, sem cadastro.',
            steps: PT_STEPS, faq: PT_FAQ},
        {slug: 'perler-beads-moldes', en: '/perler-bead-pattern-maker', kind: 'maker', brand: 'perler',
            h1: 'Moldes de Perler beads',
            intro: 'Sua imagem é ajustada às cores reais da linha Perler Midi, pelo número do produto e pelo nome da cor, com a contagem de contas por cor.',
            metaTitle: 'Gerador de moldes Perler beads',
            metaDescription: 'Crie um molde de Perler beads a partir de uma foto, ajustado às cores reais da linha Midi de 5 mm, com contagem por cor e uma página por placa. Grátis.',
            steps: PT_STEPS, faq: PT_FAQ},
        {slug: 'moldes', en: '/patterns', kind: 'gallery',
            h1: 'Moldes de hama beads grátis',
            intro: 'Moldes prontos para abrir e imprimir. Qualquer um pode ser convertido para as cores de Perler, Hama, Artkal ou MARD, com contagem e uma página por placa.',
            metaTitle: 'Moldes de hama beads grátis',
            metaDescription: 'Moldes de hama beads prontos para imprimir, nas cores reais de Perler, Hama ou Artkal, com a contagem por cor e uma página para cada placa. Grátis.'},
    ],
    fr: [
        {slug: 'perles-a-repasser-modele', en: '/', kind: 'maker',
            h1: 'Créer un modèle de perles à repasser à partir d’une photo',
            intro: 'Ajoutez une image et obtenez un modèle dans les vraies couleurs Perler, Hama, Artkal, Nabbi ou MARD, avec le nombre de perles par couleur et une page par plaque.',
            metaTitle: 'Modèle de perles à repasser gratuit',
            metaDescription: 'Transformez une photo en modèle de perles à repasser dans les vraies couleurs Hama, Perler ou Artkal, avec le nombre de perles et une page par plaque.',
            steps: FR_STEPS, faq: FR_FAQ},
        {slug: 'modele-perles-hama', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Créer un modèle de perles Hama',
            intro: 'Votre image est ajustée aux vraies couleurs Hama Midi, repérées par leurs codes H, pour que la liste d’achat corresponde aux boîtes du magasin.',
            metaTitle: 'Modèle de perles Hama à imprimer',
            metaDescription: 'Créez un modèle de perles Hama à partir d’une photo, ajusté aux vraies couleurs Hama Midi avec leurs codes H, avec le nombre de perles et une page par plaque.',
            steps: FR_STEPS, faq: FR_FAQ},
        {slug: 'modeles', en: '/patterns', kind: 'gallery',
            h1: 'Modèles de perles à repasser gratuits',
            intro: 'Des modèles prêts à ouvrir et à imprimer. Chacun se convertit aux couleurs Perler, Hama, Artkal ou MARD, avec le comptage et une page par plaque.',
            metaTitle: 'Modèles de perles à repasser gratuits',
            metaDescription: 'Modèles de perles à repasser prêts à imprimer, dans les vraies couleurs Hama, Perler ou Artkal, avec le nombre de perles par couleur et une page par plaque.'},
    ],
    es: [
        {slug: 'hama-beads-plantillas', en: '/', kind: 'maker',
            h1: 'Convierte una foto en plantilla de hama beads',
            intro: 'Sube una imagen y obtén una plantilla con los colores reales de Perler, Hama, Artkal, Nabbi o MARD, con el recuento por color y una página por placa.',
            metaTitle: 'Plantillas de hama beads desde fotos',
            metaDescription: 'Convierte una foto en una plantilla de hama beads con los colores reales de Hama, Perler o Artkal, con recuento por color y una página por placa. Gratis.',
            steps: ES_STEPS, faq: ES_FAQ},
        {slug: 'perler-beads-plantillas', en: '/perler-bead-pattern-maker', kind: 'maker', brand: 'perler',
            h1: 'Plantillas de Perler beads',
            intro: 'Tu imagen se ajusta a los colores reales de la línea Perler Midi, por número de producto y nombre de color, con el recuento de cuentas por color.',
            metaTitle: 'Generador de plantillas Perler beads',
            metaDescription: 'Crea una plantilla de Perler beads desde una foto, ajustada a los colores reales de la línea Midi de 5 mm, con recuento por color y una página por placa.',
            steps: ES_STEPS, faq: ES_FAQ},
        {slug: 'plantillas', en: '/patterns', kind: 'gallery',
            h1: 'Plantillas de hama beads gratis',
            intro: 'Plantillas listas para abrir e imprimir. Cualquiera se convierte a los colores de Perler, Hama, Artkal o MARD, con recuento y una página por placa.',
            metaTitle: 'Plantillas de hama beads gratis',
            metaDescription: 'Plantillas de hama beads listas para imprimir, con los colores reales de Hama, Perler o Artkal, el recuento por color y una página para cada placa. Gratis.'},
    ],
    nl: [
        {slug: 'strijkkralen-patronen', en: '/', kind: 'maker',
            h1: 'Maak een strijkkralen patroon van een foto',
            intro: 'Voeg een afbeelding toe en krijg een patroon in de echte kleuren van Perler, Hama, Artkal, Nabbi of MARD, met het aantal kralen per kleur en een pagina per grondplaat.',
            metaTitle: 'Strijkkralen patronen van je foto',
            metaDescription: 'Maak van elke foto een strijkkralen patroon in de echte kleuren van Hama, Perler of Artkal, met het aantal kralen per kleur en een pagina per plaat. Gratis.',
            steps: NL_STEPS, faq: NL_FAQ},
        {slug: 'hama-kralen-patronen', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Hama kralen patronen maken',
            intro: 'Je afbeelding wordt afgestemd op de echte Hama Midi kleuren met hun H-codes, zodat het boodschappenlijstje klopt met de doosjes in de winkel.',
            metaTitle: 'Hama kralen patroon maken',
            metaDescription: 'Maak een Hama kralen patroon van een foto, afgestemd op de echte Hama Midi kleuren met H-codes, met het aantal kralen per kleur en een pagina per plaat.',
            steps: NL_STEPS, faq: NL_FAQ},
        {slug: 'patronen', en: '/patterns', kind: 'gallery',
            h1: 'Gratis strijkkralen patronen',
            intro: 'Kant-en-klare patronen om te openen en af te drukken. Elk patroon is om te zetten naar de kleuren van Perler, Hama, Artkal of MARD, met telling per plaat.',
            metaTitle: 'Gratis strijkkralen patronen',
            metaDescription: 'Strijkkralen patronen klaar om af te drukken, in de echte kleuren van Hama, Perler of Artkal, met het aantal kralen per kleur en een pagina per grondplaat.'},
    ],
    pl: [
        {slug: 'koraliki-do-prasowania-wzory', en: '/', kind: 'maker',
            h1: 'Zrób wzór z koralików do prasowania ze zdjęcia',
            intro: 'Wczytaj obraz, a dostaniesz wzór w prawdziwych kolorach Perler, Hama, Artkal, Nabbi albo MARD, z liczbą koralików w każdym kolorze i stroną na każdą podkładkę.',
            metaTitle: 'Wzory z koralików do prasowania',
            metaDescription: 'Zamień zdjęcie we wzór z koralików do prasowania w prawdziwych kolorach Hama, Perler lub Artkal, z liczbą koralików i stroną na podkładkę. Za darmo.',
            steps: PL_STEPS, faq: PL_FAQ},
        {slug: 'hama-koraliki-wzory', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Wzory z koralików Hama',
            intro: 'Twój obraz zostaje dopasowany do prawdziwych kolorów Hama Midi z ich kodami H, więc lista zakupów zgadza się z pudełkami w sklepie.',
            metaTitle: 'Wzory Hama z własnego zdjęcia',
            metaDescription: 'Zrób wzór z koralików Hama ze zdjęcia, dopasowany do prawdziwych kolorów Hama Midi z kodami H, z liczbą koralików i stroną na każdą podkładkę.',
            steps: PL_STEPS, faq: PL_FAQ},
        {slug: 'wzory', en: '/patterns', kind: 'gallery',
            h1: 'Darmowe wzory z koralików do prasowania',
            intro: 'Gotowe wzory do otwarcia i wydruku. Każdy można przeliczyć na kolory Perler, Hama, Artkal albo MARD, z liczbą koralików i stroną na podkładkę.',
            metaTitle: 'Darmowe wzory z koralików',
            metaDescription: 'Gotowe do druku wzory z koralików do prasowania w prawdziwych kolorach Hama, Perler lub Artkal, z liczbą koralików w każdym kolorze i stroną na podkładkę.'},
    ],
    sv: [
        {slug: 'parlplattor-mallar', en: '/', kind: 'maker',
            h1: 'Gör en pärlplattemall av ett foto',
            intro: 'Lägg till en bild och få en mall i de riktiga färgerna från Perler, Hama, Artkal, Nabbi eller MARD, med antal pärlor per färg och en sida per platta.',
            metaTitle: 'Pärlplattor mallar från dina foton',
            metaDescription: 'Gör om ett foto till en pärlplattemall i de riktiga färgerna från Hama, Perler eller Artkal, med antal pärlor per färg och en sida per platta. Gratis.',
            steps: SV_STEPS, faq: SV_FAQ},
        {slug: 'hama-parlor-mallar', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Mallar för Hama pärlor',
            intro: 'Bilden matchas mot de riktiga Hama Midi-färgerna med sina H-koder, så att inköpslistan stämmer med burkarna i butiken.',
            metaTitle: 'Hama pärlor mall från foto',
            metaDescription: 'Gör en mall för Hama pärlor av ett foto, matchad mot de riktiga Hama Midi-färgerna med H-koder, med antal pärlor per färg och en sida per platta.',
            steps: SV_STEPS, faq: SV_FAQ},
        {slug: 'mallar', en: '/patterns', kind: 'gallery',
            h1: 'Gratis mallar till pärlplattor',
            intro: 'Färdiga mallar att öppna och skriva ut. Alla går att räkna om till färgerna från Perler, Hama, Artkal eller MARD, med antal och en sida per platta.',
            metaTitle: 'Gratis mallar till pärlplattor',
            metaDescription: 'Färdiga pärlplattemallar att skriva ut, i de riktiga färgerna från Hama, Perler eller Artkal, med antal pärlor per färg och en sida för varje platta.'},
    ],
    da: [
        {slug: 'perleplader-moenstre', en: '/', kind: 'maker',
            h1: 'Lav et perlepladesmønster ud fra et foto',
            intro: 'Tilføj et billede og få et mønster i de rigtige farver fra Perler, Hama, Artkal, Nabbi eller MARD, med antal perler per farve og en side per plade.',
            metaTitle: 'Perleplader mønstre fra dine fotos',
            metaDescription: 'Lav et perlepladesmønster ud fra et foto i de rigtige farver fra Hama, Perler eller Artkal, med antal perler per farve og en side per plade. Gratis.',
            steps: DA_STEPS, faq: DA_FAQ},
        {slug: 'hama-perler-moenstre', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Mønstre til Hama perler',
            intro: 'Billedet bliver matchet mod de rigtige Hama Midi-farver med deres H-koder, så indkøbslisten passer til æskerne i butikken.',
            metaTitle: 'Hama perler mønster fra foto',
            metaDescription: 'Lav et mønster til Hama perler ud fra et foto, matchet mod de rigtige Hama Midi-farver med H-koder, med antal perler per farve og en side per plade.',
            steps: DA_STEPS, faq: DA_FAQ},
        {slug: 'moenstre', en: '/patterns', kind: 'gallery',
            h1: 'Gratis mønstre til perleplader',
            intro: 'Færdige mønstre til at åbne og printe. Alle kan regnes om til farverne fra Perler, Hama, Artkal eller MARD, med antal og en side per plade.',
            metaTitle: 'Gratis mønstre til perleplader',
            metaDescription: 'Færdige perlepladesmønstre til print, i de rigtige farver fra Hama, Perler eller Artkal, med antal perler per farve og en side til hver plade.'},
    ],
    no: [
        {slug: 'perlebrett-moenstre', en: '/', kind: 'maker',
            h1: 'Lag et perlemønster fra et foto',
            intro: 'Legg til et bilde og få et mønster i de ekte fargene fra Perler, Hama, Artkal, Nabbi eller MARD, med antall perler per farge og én side per brett.',
            metaTitle: 'Perlebrett mønstre fra bildene dine',
            metaDescription: 'Lag et perlemønster fra et foto i de ekte fargene fra Hama, Perler eller Artkal, med antall perler per farge og én side per brett. Gratis.',
            steps: NO_STEPS, faq: NO_FAQ},
        {slug: 'hama-perler-moenstre', en: '/hama-bead-pattern-maker', kind: 'maker', brand: 'hama',
            h1: 'Mønstre til Hama perler',
            intro: 'Bildet blir matchet mot de ekte Hama Midi-fargene med H-kodene sine, så handlelisten stemmer med boksene i butikken.',
            metaTitle: 'Hama perler mønster fra foto',
            metaDescription: 'Lag et mønster til Hama perler fra et foto, matchet mot de ekte Hama Midi-fargene med H-koder, med antall perler per farge og én side per brett.',
            steps: NO_STEPS, faq: NO_FAQ},
        {slug: 'moenstre', en: '/patterns', kind: 'gallery',
            h1: 'Gratis mønstre til perlebrett',
            intro: 'Ferdige mønstre du kan åpne og skrive ut. Alle kan regnes om til fargene fra Perler, Hama, Artkal eller MARD, med antall og én side per brett.',
            metaTitle: 'Gratis mønstre til perlebrett',
            metaDescription: 'Ferdige perlemønstre til utskrift, i de ekte fargene fra Hama, Perler eller Artkal, med antall perler per farge og én side for hvert brett.'},
    ],
    it: [
        {slug: 'hama-beads-schemi', en: '/', kind: 'maker',
            h1: 'Trasforma una foto in uno schema hama beads',
            intro: 'Carica un’immagine e ottieni uno schema nei colori reali di Perler, Hama, Artkal, Nabbi o MARD, con il conteggio per colore e una pagina per ogni base.',
            metaTitle: 'Schemi hama beads dalle tue foto',
            metaDescription: 'Trasforma una foto in uno schema hama beads nei colori reali di Hama, Perler o Artkal, con il conteggio per colore e una pagina per base. Gratis.',
            steps: IT_STEPS, faq: IT_FAQ},
        {slug: 'perler-beads-schemi', en: '/perler-bead-pattern-maker', kind: 'maker', brand: 'perler',
            h1: 'Schemi per Perler beads',
            intro: 'L’immagine viene adattata ai colori reali della linea Perler Midi, per codice prodotto e nome colore, con il conteggio delle perline per colore.',
            metaTitle: 'Generatore di schemi Perler beads',
            metaDescription: 'Crea uno schema Perler beads da una foto, adattato ai colori reali della linea Midi da 5 mm, con il conteggio per colore e una pagina per ogni base.',
            steps: IT_STEPS, faq: IT_FAQ},
        {slug: 'schemi', en: '/patterns', kind: 'gallery',
            h1: 'Schemi hama beads gratis',
            intro: 'Schemi pronti da aprire e stampare. Ognuno si converte nei colori di Perler, Hama, Artkal o MARD, con il conteggio e una pagina per ogni base.',
            metaTitle: 'Schemi hama beads gratis',
            metaDescription: 'Schemi hama beads pronti da stampare, nei colori reali di Hama, Perler o Artkal, con il conteggio per colore e una pagina per ogni base. Gratis.'},
    ],
}

import {LOCALES, LOCALE_CODES, type Locale as L} from './locales'

export const localePath = (locale: L, page: LocalePage) => `${LOCALES[locale].prefix}/${page.slug}`
export const pageIn = (locale: L, slug: string) => PAGES[locale].find(p => p.slug === slug) ?? null

// Every language that has this English page, plus English itself. English is
// also x-default. Used from both sides so the pair is always declared twice.
export function alternatesFor(en: string) {
    const out = [{lang: 'en', path: en}]
    for (const code of LOCALE_CODES) {
        const p = PAGES[code].find(x => x.en === en)
        if (p) out.push({lang: LOCALES[code].hreflang, path: localePath(code, p)})
    }
    return out
}

// All translations of one English page, for the language list on a page.
export const translationsOf = (en: string) => LOCALE_CODES
    .map(code => ({code, page: PAGES[code].find(p => p.en === en)}))
    .filter((x): x is {code: L; page: LocalePage} => !!x.page)

export const ALL_LOCALE_PATHS = LOCALE_CODES.flatMap(c => PAGES[c].map(p => localePath(c, p)))
