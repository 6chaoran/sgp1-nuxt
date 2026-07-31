<template>
  <div>
    <label
      v-if="label"
      :for="fieldId"
      class="ui-label"
    >
      {{ label }}
      <span v-if="optional" class="font-normal text-neutral-500">(optional)</span>
    </label>
    <div :class="['relative', label ? 'mt-1.5' : '']">
      <MagnifyingGlassIcon
        v-if="type === 'search'"
        class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      />
      <input
        :id="fieldId"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="Boolean(error) || undefined"
        :aria-describedby="descriptionId"
        :class="[
          'ui-control',
          type === 'search' ? 'pl-10' : '',
          clearable && modelValue ? 'pr-11' : '',
          error ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-600/15' : '',
        ]"
        @input="onInput"
      >
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
        :aria-label="`Clear ${label || 'field'}`"
        @click="$emit('update:modelValue', '')"
      >
        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
    <p
      v-if="error"
      :id="descriptionId"
      class="ui-error-text"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="descriptionId"
      class="ui-help-text"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id?: string
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  type?: 'text' | 'search' | 'email' | 'tel' | 'url'
  disabled?: boolean
  clearable?: boolean
  optional?: boolean
}>(), {
  id: undefined,
  modelValue: '',
  label: '',
  placeholder: '',
  hint: '',
  error: '',
  type: 'text',
  disabled: false,
  clearable: false,
  optional: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const fieldId = computed(() => props.id || `field-${generatedId}`)
const descriptionId = computed(() => {
  if (!props.error && !props.hint) {
    return undefined
  }
  return `${fieldId.value}-description`
})

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
