<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="buttonClasses"
  >
    <ArrowPathIcon
      v-if="loading"
      class="h-4 w-4 animate-spin"
      aria-hidden="true"
    />
    <slot v-else name="leading" />
    <span><slot /></span>
    <slot name="trailing" />
  </button>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border-neutral-300 bg-neutral-0 text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'border-transparent bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-950 dark:active:bg-brand-900',
  danger: 'border-transparent bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 dark:hover:bg-danger-600 dark:active:bg-danger-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 py-2 text-sm',
  md: 'min-h-11 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-5 py-3 text-base',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-md border font-semibold shadow-control',
  'transition-colors duration-fast ease-product focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25',
  'disabled:cursor-not-allowed disabled:opacity-55',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block ? 'w-full' : '',
])
</script>
