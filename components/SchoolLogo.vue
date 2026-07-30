<template>
  <div
    :class="['flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-0 ring-1 ring-neutral-200', sizeClasses[size]]"
    :role="failed ? 'img' : undefined"
    :aria-label="failed ? `${school.name} logo unavailable` : undefined"
  >
    <img
      v-if="!failed"
      :src="logoSource"
      :width="size === 'lg' ? 72 : 48"
      :height="size === 'lg' ? 72 : 48"
      loading="lazy"
      class="h-full w-full object-contain"
      :alt="`${school.name} logo`"
      @error="$emit('logoError')"
    >
    <BuildingLibraryIcon
      v-else
      class="h-6 w-6 text-neutral-400"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { BuildingLibraryIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{
  school: {
    name: string
    logo_url?: string
    logo_url2?: string
  }
  failed?: boolean
  size?: 'sm' | 'lg'
}>(), {
  failed: false,
  size: 'sm',
})

defineEmits<{
  logoError: []
}>()

const logoSource = computed(() => (
  props.school.logo_url2
    ? `/school_logo/${props.school.logo_url2}`
    : props.school.logo_url || ''
))

const sizeClasses = {
  sm: 'h-12 w-12',
  lg: 'h-[4.5rem] w-[4.5rem]',
}
</script>
