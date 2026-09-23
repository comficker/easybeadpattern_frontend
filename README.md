# EasyBeadPattern

**[easybeadpattern.com](https://easybeadpattern.com)**: free bead pattern maker. Turn any image,
word or pixel art into a pattern for fuse beads or beadwork, matched to real bead colours, with a
bead count and a printable PDF.

- **Fuse beads:** Perler, Hama, Artkal S, Nabbi and MARD, split into 29 × 29 pegboards, one PDF page
  per board.
- **Beadwork:** kandi cuffs, bead loom, peyote (offset columns), brick stitch (offset rows) and alpha
  friendship bracelets (DMC floss), each with a written row-by-row chart.
- **Bead letters:** any word as a 7-bead-tall pattern for any craft.
- **Designer:** draw on a blank board with brush, fill and eraser; zoom and pan.
- **Build mode:** tick beads off as you place them, board by board or row by row.
- **My colours:** mark the beads you own and make patterns from those only.
- **Pattern library:** free patterns by theme, size and difficulty, colour charts, guides.

Everything that touches an image runs in the browser: pictures are never uploaded.

## Stack

Nuxt 4 (Vue 3, Nitro SSR), TypeScript, Canvas 2D, jsPDF. Pattern data, accounts and saving come from
the shared ninosaur backend (`https://touch.ninosaur.com`, `/coloring` and `/auth`).

## Develop

Needs Node 22 and [Bun](https://bun.sh).

```bash
bun install
bun run dev        # http://localhost:3010
bun run test       # unit tests (colour matching, charts, font, …)
bun run typecheck
bun run build
```

Other scripts:

| Script | What it does |
|---|---|
| `bun run palettes` | Rebuild `app/data/beads.json` from the palette CSVs in `data/` |
| `bun run og` | Render the social share cards in `public/og/` (needs local Chrome) |
| `bun run deploy` | Build locally and ship to the VPS by hand (CI normally does this) |

Environment (see `.env.example`): `NUXT_PUBLIC_API` (backend URL) and `NUXT_PUBLIC_SITE_URL`
(canonical site URL).

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: install, test, build on GitHub, then
upload `.output/` to the VPS, swap it in and restart the `easybeadpattern` pm2 process (port 4015,
behind nginx). The server never builds; the Nitro output is self-contained.

The workflow needs one repository secret, `SSH_PRIVATE_KEY`: the deploy key for
`root@45.76.181.237` (the same key the other frontends use).

## Credits

- Fuse bead colours: [beadcolors](https://github.com/maxcleme/beadcolors) (MIT).
- Icons: [Iconsax](https://iconsax.io) via `vue-iconsax` (MIT).
- Font: [Rubik](https://github.com/googlefonts/rubik) (SIL Open Font License).

Perler, Hama, Artkal, Nabbi, MARD, DMC, Miyuki and Toho are trademarks of their owners;
EasyBeadPattern is not affiliated with them.
