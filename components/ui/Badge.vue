<template>
  <span :class="badgeClasses">
    <span
      v-if="dot"
      class="h-1.5 w-1.5 rounded-full bg-current"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>

<script setup lang="ts">
type BadgeVariant = 'brand' | 'neutral' | 'success' | 'warning' | 'info'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
  dot?: boolean
}>(), {
  variant: 'neutral',
  dot: false,
})

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/15 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-400/25',
  neutral: 'bg-neutral-100 text-neutral-700 ring-neutral-600/10',
  success: 'bg-success-50 text-success-700 ring-success-600/15',
  warning: 'bg-warning-50 text-warning-700 ring-warning-600/15',
  info: 'bg-info-50 text-info-700 ring-info-600/15',
}

const badgeClasses = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold leading-4 ring-1 ring-inset',
  variants[props.variant],
])
</script>
