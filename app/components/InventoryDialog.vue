<script setup lang="ts">
import {getBrand, type PaletteId} from '~/helper/beads/brands'

const props = defineProps<{ palette: PaletteId }>()
const open = defineModel<boolean>('open', {default: false})
const dlg = ref<HTMLDialogElement>()
const brand = computed(() => getBrand(props.palette))
const {owned, codes, set, toggle} = useInventory(computed(() => props.palette))

watch(open, v => {
    if (v) dlg.value?.showModal()
    else dlg.value?.close()
})
</script>

<template>
  <dialog ref="dlg" class="dialog" :aria-label="`My ${brand.name} colours`" @close="open = false">
    <header class="dialog-head">
      <div>
        <h2>My {{ brand.name }} colours</h2>
        <p class="muted small">{{ codes.length }} of {{ brand.beads.length }} picked. Patterns can then use only these.</p>
      </div>
      <button class="btn btn-small btn-icon" aria-label="Close" title="Close" @click="open = false"><Icon name="close" /></button>
    </header>
    <div class="inv-grid">
      <button
        v-for="b in brand.beads"
        :key="b.code"
        class="inv-item"
        :aria-pressed="owned.has(b.code)"
        :title="`${b.code} ${b.name}`"
        @click="toggle(b.code)"
      >
        <span class="bead-dot" :style="{background: b.hex}" />
        <span class="inv-code">{{ b.code }}</span>
        <Icon v-if="owned.has(b.code)" name="tick" class="inv-tick" />
      </button>
    </div>
    <footer class="dialog-foot">
      <button class="btn btn-small" @click="set(brand.beads.map(b => b.code))">Select all</button>
      <button class="btn btn-small" @click="set([])">Clear</button>
      <span class="spacer" />
      <button class="btn btn-primary" @click="open = false">Done</button>
    </footer>
  </dialog>
</template>
