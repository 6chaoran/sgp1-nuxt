<template>
  <div>
    <label
      v-if="label"
      :for="fieldId"
      class="ui-label"
    >
      {{ label }}
    </label>
    <div :class="['relative', label ? 'mt-1.5' : '']">
      <select
        :id="fieldId"
        v-model="selectedValue"
        v-bind="$attrs"
        :disabled="disabled"
        :aria-invalid="Boolean(error) || undefined"
        :aria-describedby="descriptionId"
        :class="[
          'ui-control appearance-none pr-10',
          error ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-600/15' : '',
        ]"
      >
        <option v-if="placeholder" disabled :value="null">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <ChevronUpDownIcon
        class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      />
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
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'

defineOptions({ inheritAttrs: false })

type SelectValue = string | number | boolean | null

const props = withDefaults(defineProps<{
  id?: string
  modelValue?: SelectValue
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  options: Array<{ label: string, value: SelectValue, disabled?: boolean }>
}>(), {
  id: undefined,
  modelValue: null,
  label: '',
  placeholder: '',
  hint: '',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
}>()

const generatedId = useId()
const fieldId = computed(() => props.id || `select-${generatedId}`)
const descriptionId = computed(() => {
  if (!props.error && !props.hint) {
    return undefined
  }
  return `${fieldId.value}-description`
})

const selectedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
