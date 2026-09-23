<script setup lang="ts">
// A swatch button that opens the beads of the current palette: the colour
// picked is always a real bead. `allowNone` adds a "no beads" choice.
import type {Brand} from '~/helper/beads/brands'

const props = defineProps<{ label: string; brand: Brand; allowNone?: boolean }>()
const model = defineModel<string | null>({required: true})
const open = ref(false)
const root = ref<HTMLElement>()
const bead = computed(() => (model.value ? props.brand.beads.find(b => b.hex === model.value) : null))

function pick(hex: string | null) {
    model.value = hex
    open.value = false
}
function onDoc(e: PointerEvent) {
    if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div ref="root" class="bead-pick">
    <button type="button" class="bead-pick-btn" :aria-expanded="open" @click="open = !open">
      <span v-if="model" class="bead-dot" :style="{background: model}" />
      <span v-else class="gap-dot" />
      <span class="bead-pick-text">
        <span class="bead-pick-label">{{ label }}</span>
        <span class="bead-pick-name">{{ model ? (bead ? `${bead.code} ${bead.name}` : 'Custom') : 'None' }}</span>
      </span>
      <Icon name="arrow-down" class="chev" />
    </button>
    <div v-if="open" class="bead-pick-pop" role="dialog" :aria-label="`${label} colour`">
      <div class="swatches">
        <button v-if="allowNone" type="button" class="swatch-none" :aria-pressed="!model" aria-label="No beads" title="None" @click="pick(null)" />
        <button
          v-for="b in brand.beads" :key="b.code" type="button"
          :style="{background: b.hex}" :title="`${b.code} ${b.name}`" :aria-label="`${b.code} ${b.name}`"
          :aria-pressed="b.hex === model" @click="pick(b.hex)"
        />
      </div>
    </div>
  </div>
</template>
