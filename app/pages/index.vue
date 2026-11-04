<script setup lang="ts">
import {CRAFTS} from '~/helper/beads/crafts'
import {DE_FOR_EN, deAlternates} from '~/helper/de'

const fuse = CRAFTS.fuse
useSeo({
    title: fuse.metaTitle,
    description: fuse.metaDescription,
    path: '/',
    image: '/og/default.png',
    alternates: deAlternates(DE_FOR_EN('/')!),
    jsonLd: [ldTool('EasyBeadPattern bead pattern maker', fuse.metaDescription, '/'), ldFaq(fuse.faq)],
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="wrap">
        <h1>Turn any image into a bead pattern</h1>
        <p>Matched to real Perler, Hama, Artkal, Nabbi and MARD colours, with a bead count and a printable page for every pegboard.</p>
      </div>
    </section>
    <div class="wrap">
      <PatternWorkbench storage-key="bap:maker" title="My bead pattern" />
    </div>
    <MakerSections />
  </div>
</template>
