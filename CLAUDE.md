# CLAUDE.md

EasyBeadPattern.com: turn an image, a word, or a pixel art from the shared library into a bead
pattern for fuse beads (Perler, Hama, Artkal S, Nabbi, MARD) or beadwork (kandi, bead loom,
peyote, brick stitch, alpha friendship bracelets), with counts, PNG and a printable PDF.

## Commands

```bash
bun install
bun run dev        # http://localhost:3010 (already in the backend CORS allowlist)
bun run test       # bun:test, pure helpers only (tests/)
bun run typecheck  # nuxi typecheck (vue-tsc, TypeScript 5.x; TS 7 breaks vue-tsc)
bun run build
bun run palettes   # rebuild app/data/beads.json from data/beadcolors/*.csv
bun run deploy     # manual build + ship to the VPS (CI normally does it)
```

## Deploy

Repo `git@github.com:comficker/easybeadpattern_frontend.git`, pushed via the `github.com-comficker`
SSH alias. Push to `main` → `.github/workflows/deploy.yml` builds on GitHub (never on the 2 GB VPS),
rsyncs `.output/` to `/home/frontend/easybeadpattern`, swaps it in and restarts pm2
`easybeadpattern` (:4015, `NUXT_PUBLIC_SITE_URL=https://easybeadpattern.com`), then smoke-tests.
Needs repo secret `SSH_PRIVATE_KEY`. nginx: `/etc/nginx/sites-available/easybeadpattern_web`
(apex canonical, www/http → 301, `/_nuxt` from disk with gzip_static, gzip for HTML/JSON).
TLS: Let's Encrypt via certbot (auto-renew). DNS on Cloudflare, currently DNS-only (grey cloud).

## How it works

- **No new backend model.** Library patterns are `SharedPage` rows from `ninosaur_backend`
  `/coloring/shared-pages/` (the same data simplepixelart uses), read-only. `map_numbers` keys are
  `"x_y"` → index into `colors`.
- **Catalog** (`server/utils/catalog.ts`): Nitro fetches every public original (`full_schema`) plus
  all tags once an hour and derives tag counts, co-occurring tags, sizes, colour counts and a
  difficulty level (`levelOf`). Listing pages and filters read `/api/patterns` and `/api/facets`,
  not the backend. The catalog is also the gate: a pattern page 404s unless the art is in it.
- **SEO pages:** `/patterns/tag` (A–Z), `/patterns/tag/[tag]`, `/patterns/size/[WxH]`,
  `/patterns/level/[easy|medium|hard]`. Empty → 404; fewer than `MIN_INDEX` (3) patterns →
  `noindex, follow` and left out of the sitemap. Intros come from real stats (`utils/listing.ts`).
- Everything is converted to a brand-agnostic `SourceGrid` (RGB or null per cell), then
  `matchToBeads()` maps it to one brand. Stored data never holds a brand; switching brand re-matches.
- Matching (`app/helper/beads/pattern.ts`): CIEDE2000 on a CIE76 shortlist; colour reduction
  drops the bead with the least `√cells × distance²` so small distinct details (eyes) survive;
  optional Floyd–Steinberg. Clear/glitter/glow/pearl/neon beads (`special`) are excluded by default.
- Image → cells reuses `app/helper/pixel/reconstruct.ts`, **copied** from simplepixelart
  (no shared package in this monorepo). Keep it in sync by hand.
- **Brush / eraser** (`PatternWorkbench` + `BeadCanvas`): hand edits are `Edits` (cell → hex or
  null), applied after matching and swaps by `applyEdits()`. Stored as colours so they survive a
  brand switch and a colour-limit change; reset when the grid size changes. Undo keeps one
  snapshot per stroke (50 max). Keys: V select, B brush, E eraser, Alt-click picks, Ctrl+Z / Ctrl+Shift+Z.
- Canvas draws each bead from a cached sprite (`beadSprite` in `draw.ts`) and redraws at most
  once per frame; per-bead gradients were too slow for brush strokes on 87 × 87.
- Boards are 29 × 29 (`BOARD` in `brands.ts`); labels A1, A2 … B1.
- **Crafts** (`app/helper/beads/crafts.ts`): each craft is config, not code: palettes, layout
  (`square` | `peyote` offset columns | `brick` offset rows), bead shape, cell size in mm (sets the
  drawn aspect and cm size; `null` = 1:1, no cm), width presets, boards (fuse only), written-chart
  order (`wordChart()` in `pattern.ts`) and landing copy/FAQ. `/[slug]` serves both fuse brand and
  craft landings. Geometry for offsets lives in `draw.ts` (`canvasSize`, `cellOrigin`, `cellAt`);
  offset layouts sample images by box average (`sampleBoxes` in `source.ts`).
- **Palettes** (`brands.ts`, built by `bun run palettes`): fuse brands from beadcolors (MIT); `dmc`
  exported from the backend's `apps/coloring/dmc.py`; `pony` and `seed` are our own generic
  palettes with no brand codes. There is no licensed Miyuki Delica / Toho dataset: two GitHub repos
  have Delica data but no licence, so don't copy them.
- **Bead letters** (`font.ts`, `/bead-letters`): our own 5 × 7 font; text → SourceGrid → any craft.
- Pattern pages take `?craft=` to open as that craft; canonical stays the plain URL.
- **Editor**: select / brush / eraser / fill (`floodRegion`), zoom 1–8× (Ctrl/⌘-wheel, +/−/0,
  space- or middle-drag pans). The board (`.bench-stage`) is always square and the side panels are
  `contain: size` so they never stretch it. `/designer` is a blank board (`?art=<id_string>` opens a
  saved one).
- **Build mode** (`BuildMode.vue`): tap beads as placed; fuse works board by board, beadwork row by
  row from `wordChart().cells`. Progress is a bitset in localStorage keyed by `patternKey()`.
- **My colours** (`useInventory`): owned codes per palette in localStorage; `matchToBeads({only})`.
- **Accounts**: Google sign-in through the backend (`/auth/google?state=<origin>/auth/callback`),
  tokens in `bap_token` / `bap_refresh` cookies (`useAuth`). Save = POST/PATCH
  `/coloring/shared-pages/` with `meta.origin = "easybeadpattern"`; sharing PATCHes `status: public`, which
  the backend turns into `pending` review for non-staff. `/my-patterns` lists the user's arts.
- **SEO** (`composables/useSeo.ts`): every page calls `useSeo` with title, description, path,
  image and JSON-LD. It drops the " · EasyBeadPattern" suffix when a title would pass 60 chars and
  clips descriptions to 158. Helpers: `ldTool`, `ldFaq`, `ldBreadcrumbs`, `ldItemList`; WebSite +
  Organization come from `app.vue`. Listing pages put the page number in title and description,
  404 past the last page, and use the first pattern's image. Share cards in `public/og/` are
  rendered by `bun run og` (`scripts/og.mjs`, needs local Chrome); re-run after changing titles,
  crafts, brands or guides. Sitemap includes image entries for patterns. Rubik is self-hosted.
- **Performance** (Lighthouse mobile 96–99, desktop 99–100, a11y/BP/SEO 100): all CSS is inlined
  (`features.inlineStyles`), so keep styles in `main.css`, not in `<style scoped>` of client-only
  components (those can't be inlined and block render). Rubik has a metric-matched fallback
  (`Rubik Fallback`) so the font swap causes no layout shift. Don't wrap small inline elements in
  `<ClientOnly>` inside grids: its SSR placeholder takes a grid cell and shifts layout. Keep the
  SSR payload small: `/api/facets` has no per-tag related lists (theme pages use `/api/tags/:id`).
  HTML is not compressed by Nitro; nginx must gzip it. Accent is `#D6336A` (AA with white text).
- **Guides** (`app/helper/guides.ts`): brand facts are computed from palette data; craft advice
  stays general.
- **Design system**: tokens at the top of `main.css` (type 12–22 + h1, 4-px spacing, controls
  28/32/40, radii 8/12/pill). No one-off sizes and no inline styles. Icons are Iconsax "linear"
  SVGs in `public/icons/` via `<Icon name>` (CSS mask, `currentColor`); add new ones with
  `scripts/render-icons.mjs`.
- All conversion, PNG and PDF (jsPDF) run in the browser. The converter autosaves to
  localStorage (`bap:maker`).

## Layout

- `app/helper/` pure TS (relative imports so `bun test` works without Nuxt aliases)
- `app/components/PatternWorkbench.vue` the settings | pegboard | bead list tool, used by the
  maker (image mode) and pattern pages (`source` prop)
- `app/pages/`: `/`, `/[brand]-bead-pattern-maker` (via `[slug].vue`), `/patterns` and the
  listing pages above, `/patterns/[id]`, `/colors`, `/colors/[brand]`
- `server/api/` catalog endpoints, `server/routes/sitemap.xml.ts`

## Conventions

- Design tokens live on `:root` in `app/assets/css/main.css` (light + dark). Pills for actions,
  panels flush with 1px dividers; the only decoration is the bead rendering itself.
- Bead data: github.com/maxcleme/beadcolors (MIT), credited in the footer.
