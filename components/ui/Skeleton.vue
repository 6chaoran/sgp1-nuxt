<template>
  <span
    aria-hidden="true"
    :class="[
      'block animate-pulse bg-neutral-200 motion-reduce:animate-none',
      shape === 'circle' ? 'rounded-full' : 'rounded-md',
    ]"
    :style="{ width, height }"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: string
  shape?: 'rectangle' | 'circle'
}>(), {
  width: '100%',
  height: '1rem',
  shape: 'rectangle',
})
</script>
