<script setup lang="ts">
import type {Bead} from '~/helper/beads/brands'
import type {BeadCount} from '~/helper/beads/pattern'

const props = defineProps<{
    counts: BeadCount[]
    beads: Bead[]
    brandName: string
    unit?: 'bead' | 'knot'
}>()
const focus = defineModel<number | null>('focus', {default: null})
const emit = defineEmits<{ swap: [from: number, to: number] }>()

const total = computed(() => props.counts.reduce((s, c) => s + c.count, 0))
const selected = computed(() => (focus.value != null ? props.beads[focus.value] : null))
const selectedCount = computed(() => props.counts.find(c => c.index === focus.value)?.count ?? 0)

function toggle(i: number) {
    focus.value = focus.value === i ? null : i
}

function swapTo(to: number) {
    if (focus.value == null) return
    emit('swap', focus.value, to)
    focus.value = to >= 0 ? to : null
}
</script>

<template>
  <div class="field beadlist-field">
    <div class="beadlist-head">
      <h2 class="panel-title">{{ unit === 'knot' ? 'Floss to buy' : 'Beads to buy' }}</h2>
      <span class="beadlist-total">{{ total.toLocaleString() }} {{ unit ?? 'bead' }}{{ total === 1 ? '' : 's' }}, {{ counts.length }} colour{{ counts.length === 1 ? '' : 's' }}</span>
    </div>
    <ul v-if="counts.length" class="beadlist" role="listbox" :aria-label="`${brandName} colours in this pattern`">
      <li
        v-for="c in counts"
        :key="c.index"
        class="bead-row"
        role="option"
        :aria-selected="focus === c.index"
        tabindex="0"
        @click="toggle(c.index)"
        @keydown.enter.prevent="toggle(c.index)"
        @keydown.space.prevent="toggle(c.index)"
      >
        <span class="bead-dot" :style="{background: beads[c.index]!.hex}" />
        <span>
          <span class="code">{{ beads[c.index]!.code }}</span>
          <span class="name">{{ beads[c.index]!.name }}</span>
        </span>
        <span class="count">{{ c.count }}</span>
      </li>
    </ul>
    <p v-else class="muted small">Add an image to see what you need.</p>
  </div>

  <div v-if="selected" class="swap-panel">
    <div class="beadlist-head">
      <h2 class="panel-title">Swap {{ selected.code }}</h2>
      <button class="btn btn-small" :title="`Remove all ${selectedCount}`" @click="swapTo(-1)"><Icon name="trash" />Remove {{ selectedCount }}</button>
    </div>
    <p class="muted small">Pick the {{ brandName }} colour to use instead.</p>
    <div class="swatches">
      <button
        v-for="(b, i) in beads"
        :key="b.code"
        :style="{background: b.hex}"
        :title="`${b.code} ${b.name}`"
        :aria-label="`Use ${b.code} ${b.name}`"
        @click="swapTo(i)"
      />
    </div>
  </div>
</template>
