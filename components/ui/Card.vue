<template>
  <component
    :is="as"
    :class="[
      'rounded-lg border border-neutral-200 bg-neutral-0',
      padded ? 'p-4 sm:p-6' : '',
      elevated ? 'shadow-soft' : 'shadow-control',
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
  padded?: boolean
  elevated?: boolean
}>(), {
  as: 'section',
  padded: true,
  elevated: false,
})
</script>
