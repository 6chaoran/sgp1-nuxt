<template>
  <span
    class="group relative inline-flex"
    tabindex="0"
    :aria-describedby="tooltipId"
  >
    <slot />
    <span
      :id="tooltipId"
      role="tooltip"
      :class="[
        'pointer-events-none absolute z-50 w-max max-w-64 rounded-md bg-neutral-900 px-2.5 py-1.5',
        'text-xs font-medium leading-4 text-white opacity-0 shadow-overlay transition-opacity duration-fast',
        'group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100',
        positionClasses[position],
      ]"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

withDefaults(defineProps<{
  text: string
  position?: TooltipPosition
}>(), {
  position: 'top',
})

const tooltipId = `tooltip-${useId()}`

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
}
</script>
