<template>
  <button
    type="button"
    :aria-label="removable ? `Remove ${label}` : label"
    :aria-pressed="removable ? undefined : active"
    :class="[
      'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold leading-4 ring-1 ring-inset',
      'transition-colors duration-fast ease-product focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
      active
        ? 'bg-neutral-100 text-neutral-700 ring-neutral-600/10 hover:bg-neutral-200'
        : 'bg-neutral-0 text-neutral-700 ring-neutral-600/20 hover:bg-neutral-50',
    ]"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
    <XMarkIcon
      v-if="removable"
      class="h-4 w-4"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = withDefaults(defineProps<{
  label: string
  active?: boolean
  removable?: boolean
}>(), {
  active: true,
  removable: false,
})

const emit = defineEmits<{
  click: []
  remove: []
}>()

const handleClick = () => {
  if (props.removable) {
    emit('remove')
    return
  }
  emit('click')
}
</script>
