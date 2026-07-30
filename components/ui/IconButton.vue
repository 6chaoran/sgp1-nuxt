<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type IconButtonVariant = 'primary' | 'secondary' | 'ghost'
type IconButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  disabled?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
})

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'border-transparent bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border-neutral-300 bg-neutral-0 text-neutral-700 shadow-control hover:bg-neutral-50',
  ghost: 'border-transparent bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-11 w-11',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
}

const buttonClasses = computed(() => [
  'inline-flex shrink-0 items-center justify-center rounded-md border transition-colors duration-fast ease-product',
  'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 disabled:cursor-not-allowed disabled:opacity-55',
  '[&>svg]:h-5 [&>svg]:w-5',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>
