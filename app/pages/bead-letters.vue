<script setup lang="ts">
import type {Brand} from '~/helper/beads/brands'
import {normalise, textToSource} from '~/helper/beads/font'
import {nearestBead, type SourceGrid} from '~/helper/beads/pattern'
import {hexToRgb} from '~/helper/color'

const LETTER_FAQ = [
    {q: 'Which characters work?', a: "A to Z, 0 to 9, spaces and ! ? . , ' : - + &. Type <3 for a heart. Other characters are left out."},
    {q: 'Can I use it for Perler beads or friendship bracelets?', a: 'Yes. Change "Make it as" to fuse beads, bead loom, friendship bracelet or any other craft, and the colours are matched to that craft\'s beads or floss.'},
    {q: 'How long will my word be?', a: 'Most letters are 5 beads wide plus the space you choose, so a 4-letter word with 1 bead between letters is about 23 beads long, plus the border.'},
]
const seoDesc = 'Type a name or word and get it as a 7-bead-tall letter pattern for kandi cuffs, Perler and Hama pegboards or friendship bracelets. Free, with counts.'
useSeo({
    title: 'Bead letters: words as bead patterns',
    description: seoDesc,
    path: '/bead-letters',
    image: '/og/letters.png',
    jsonLd: [ldTool('Bead letter generator', seoDesc, '/bead-letters'), ldFaq(LETTER_FAQ)],
})

// What the user asked for; `letter` / `background` are those snapped to a real
// bead of the current palette, so the picker and the pattern always agree.
const KEY = 'bap:letters'
const EXAMPLES = ['PLUR', 'LOVE', 'BFF', 'HELLO', 'I <3 U', 'TEAM\nBRIDE']
const text = ref('PLUR')
const wish = reactive({letter: '#E8489B', background: '#FFFFFF' as string | null})
const letter = ref('#E8489B')
const background = ref<string | null>('#FFFFFF')
const spacing = ref(1)
const padding = ref(1)
const brand = shallowRef<Brand | null>(null)

function snap() {
    const b = brand.value
    if (!b) return
    letter.value = b.beads[nearestBead(b, wish.letter)]!.hex
    background.value = wish.background ? b.beads[nearestBead(b, wish.background)]!.hex : null
}
function onPalette(b: Brand) { brand.value = b; snap() }
function setLetter(hex: string | null) { if (hex) { wish.letter = hex; letter.value = hex } }
function setBackground(hex: string | null) { wish.background = hex; background.value = hex }
function swapColours() {
    if (!background.value) return
    const l = letter.value
    setLetter(background.value)
    setBackground(l)
}

// Characters the font has no glyph for, shown so they don't vanish silently.
const dropped = computed(() => {
    const kept = new Set(normalise(text.value))
    return [...new Set(text.value.toUpperCase().replace(/<3/g, '').split(''))].filter(c => c.trim() && !kept.has(c))
})
const letters = computed(() => normalise(text.value).replace(/\s/g, '').length)

// An empty board while nothing is typed, so the controls stay in place.
const blank: SourceGrid = {width: 23, height: 9, cells: new Array(23 * 9).fill(null)}
const source = computed(() => textToSource({
    text: text.value,
    letter: hexToRgb(letter.value),
    background: background.value ? hexToRgb(background.value) : null,
    spacing: spacing.value,
    padding: background.value ? padding.value : 0,
}) ?? blank)

onMounted(() => {
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || 'null')
        if (s) {
            text.value = s.text ?? text.value
            Object.assign(wish, s.wish || {})
            spacing.value = s.spacing ?? 1
            padding.value = s.padding ?? 1
            snap()
        }
    } catch { /* first visit */ }
})
watch([text, () => ({...wish}), spacing, padding], () => {
    try { localStorage.setItem(KEY, JSON.stringify({text: text.value, wish, spacing: spacing.value, padding: padding.value})) } catch { /* private mode */ }
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="wrap">
        <p class="crumbs"><NuxtLink to="/beadwork">Beadwork</NuxtLink> / Bead letters</p>
        <h1>Bead letters</h1>
        <p>Type a name or a word and get it as a bead pattern, 7 beads tall. Make it for kandi, pegboards, loom or a friendship bracelet.</p>
      </div>
    </section>
    <div class="wrap">
      <PatternWorkbench :source="source" initial-craft="kandi" craft-switch :title="text.replace(/\s+/g, ' ').trim() || 'Bead letters'" @palette="onPalette">
        <template #controls="{brand: b}">
          <div class="field letters-text">
            <label for="lt">Text <output>{{ letters }} letter{{ letters === 1 ? '' : 's' }}</output></label>
            <textarea id="lt" v-model="text" rows="2" maxlength="60" spellcheck="false" autocomplete="off" placeholder="Type a word" />
            <p class="muted small">New line for a second row. Type &lt;3 for a heart.</p>
            <p v-if="dropped.length" class="error small">Left out: {{ dropped.join(' ') }}</p>
            <div class="tags" role="group" aria-label="Examples">
              <button v-for="ex in EXAMPLES" :key="ex" type="button" class="tag" :aria-pressed="text === ex" @click="text = ex">{{ ex.replace('\n', ' / ') }}</button>
            </div>
          </div>

          <div class="field">
            <span class="label">Colours
              <button type="button" class="btn btn-small btn-icon" :disabled="!background" title="Swap letter and background colours" aria-label="Swap colours" @click="swapColours"><Icon name="swap" /></button>
            </span>
            <BeadColorPick :model-value="letter" label="Letters" :brand="b" @update:model-value="setLetter" />
            <BeadColorPick :model-value="background" label="Background" :brand="b" allow-none @update:model-value="setBackground" />
          </div>

          <div class="field">
            <span class="label">Space between letters</span>
            <div class="seg" role="group" aria-label="Space between letters">
              <button v-for="n in [0, 1, 2]" :key="n" type="button" :aria-pressed="spacing === n" @click="spacing = n">{{ n }}</button>
            </div>
          </div>
          <div v-if="background" class="field">
            <span class="label">Border</span>
            <div class="seg" role="group" aria-label="Border">
              <button v-for="n in [0, 1, 2, 3]" :key="n" type="button" :aria-pressed="padding === n" @click="padding = n">{{ n }}</button>
            </div>
          </div>
          <hr class="side-rule">
        </template>
      </PatternWorkbench>
    </div>
    <section class="section">
      <div class="wrap">
        <h2>Frequently asked questions</h2>
        <div class="faq">
          <details v-for="f in LETTER_FAQ" :key="f.q"><summary>{{ f.q }}</summary><p>{{ f.a }}</p></details>
        </div>
      </div>
    </section>
  </div>
</template>
