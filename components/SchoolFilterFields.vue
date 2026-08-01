<template>
  <div class="space-y-6">
    <section class="border-b border-neutral-200 pb-5" aria-labelledby="distance-filter-title">
      <div class="flex items-center gap-2">
        <MapPinIcon class="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        <p id="distance-filter-title" class="text-sm font-semibold text-neutral-800">
          Distance
        </p>
      </div>
      <p class="mt-2 text-xs leading-5 text-neutral-500">
        Distance is an estimate from your current location. It is calculated
        on this device and is not stored.
      </p>

      <UiButton
        v-if="locationStatus !== 'ready'"
        class="mt-3"
        block
        :loading="locationStatus === 'requesting'"
        @click="$emit('requestLocation')"
      >
        <template #leading>
          <MapPinIcon class="h-5 w-5" aria-hidden="true" />
        </template>
        {{ locationStatus === 'requesting' ? 'Requesting location' : 'Allow location access' }}
      </UiButton>

      <div v-else class="mt-3 rounded-lg border border-success-100 bg-success-50 p-3">
        <div class="flex items-start gap-2 text-sm text-success-700">
          <CheckCircleIcon class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p class="font-semibold">Distance sorting is available</p>
        </div>
        <button
          type="button"
          class="mt-1 inline-flex min-h-11 items-center rounded-md text-xs font-semibold text-success-700 underline underline-offset-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-success-600/20"
          @click="$emit('clearLocation')"
        >
          Stop using location
        </button>
      </div>

      <p
        v-if="locationStatus !== 'idle' && locationStatus !== 'ready'"
        class="mt-2 text-xs leading-5 text-neutral-500"
        aria-live="polite"
      >
        {{ locationMessage }}
      </p>
      <div class="mt-3 flex items-start gap-2 text-xs leading-5 text-neutral-500">
        <LockClosedIcon class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>Your location stays on your device.</p>
      </div>
    </section>

    <UiSelectField
      v-model="area"
      label="Area"
      :options="areaOptions"
    />

    <UiSelectField
      v-model="phase"
      label="Admission phase"
      hint="Historical rates use the selected registration phase."
      :options="phaseOptions"
    />

    <fieldset>
      <legend class="text-sm font-semibold text-neutral-800">
        School attributes
      </legend>
      <p class="mt-1 text-xs leading-5 text-neutral-500">
        Choose any attributes that matter to your family.
      </p>
      <div class="mt-3 space-y-2">
        <label
          v-for="option in attributeOptions"
          :key="option.key"
          class="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40 dark:hover:bg-brand-950/40"
        >
          <input
            v-model="option.model.value"
            type="checkbox"
            :aria-label="option.label"
            class="mt-0.5 h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
          >
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-neutral-800">
              {{ option.label }}
            </span>
            <span class="mt-0.5 block text-xs leading-4 text-neutral-500">
              {{ option.description }}
            </span>
          </span>
        </label>
      </div>
    </fieldset>

  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  LockClosedIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

type LocationStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'unavailable' | 'error'

defineProps<{
  locationStatus: LocationStatus
  locationMessage: string
}>()

defineEmits<{
  requestLocation: []
  clearLocation: []
}>()

const area = defineModel<string>('area', { required: true })
const phase = defineModel<string>('phase', { required: true })
const sap = defineModel<boolean>('sap', { required: true })
const gep = defineModel<boolean>('gep', { required: true })
const boys = defineModel<boolean>('boys', { required: true })
const girls = defineModel<boolean>('girls', { required: true })
const affiliated = defineModel<boolean>('affiliated', { required: true })

const areaOptions = getAreaList().map(option => ({
  label: option.name === 'All' ? 'All areas' : String(option.name),
  value: String(option.name),
}))

const phaseOptions = ['2A', '2B', '2C', '2C(S)', '3'].map(value => ({
  label: `Phase ${value}`,
  value,
}))

const attributeOptions = [
  {
    key: 'sap',
    label: 'SAP',
    description: 'Special Assistance Plan school.',
    model: sap,
  },
  {
    key: 'gep',
    label: 'GEP',
    description: 'Offers the Gifted Education Programme.',
    model: gep,
  },
  {
    key: 'boys',
    label: 'Boys',
    description: 'Boys-only primary school.',
    model: boys,
  },
  {
    key: 'girls',
    label: 'Girls',
    description: 'Girls-only primary school.',
    model: girls,
  },
  {
    key: 'affiliated',
    label: 'Affiliated',
    description: 'Has a listed secondary-school affiliation.',
    model: affiliated,
  },
]
</script>
