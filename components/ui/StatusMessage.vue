<template>
  <div
    :role="variant === 'error' ? 'alert' : 'status'"
    :class="[
      'flex items-start gap-3 rounded-lg border p-4 text-sm',
      variants[variant].container,
    ]"
  >
    <component
      :is="variants[variant].icon"
      :class="['mt-0.5 h-5 w-5 shrink-0', variants[variant].iconColor]"
      aria-hidden="true"
    />
    <div class="min-w-0">
      <p v-if="title" class="font-semibold">
        {{ title }}
      </p>
      <div :class="title ? 'mt-1' : ''">
        <slot />
      </div>
      <div v-if="$slots.action" class="mt-3">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

type StatusVariant = 'info' | 'success' | 'warning' | 'error' | 'empty'

withDefaults(defineProps<{
  variant?: StatusVariant
  title?: string
}>(), {
  variant: 'info',
  title: '',
})

const variants = {
  info: {
    container: 'border-info-100 bg-info-50 text-info-700',
    icon: InformationCircleIcon,
    iconColor: 'text-info-600',
  },
  success: {
    container: 'border-success-100 bg-success-50 text-success-700',
    icon: CheckCircleIcon,
    iconColor: 'text-success-600',
  },
  warning: {
    container: 'border-warning-100 bg-warning-50 text-warning-700',
    icon: ExclamationTriangleIcon,
    iconColor: 'text-warning-600',
  },
  error: {
    container: 'border-danger-100 bg-danger-50 text-danger-700',
    icon: XCircleIcon,
    iconColor: 'text-danger-600',
  },
  empty: {
    container: 'border-neutral-200 bg-neutral-50 text-neutral-700',
    icon: MagnifyingGlassIcon,
    iconColor: 'text-neutral-500',
  },
} satisfies Record<StatusVariant, {
  container: string
  icon: typeof InformationCircleIcon
  iconColor: string
}>
</script>
