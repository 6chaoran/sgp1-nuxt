<template>
  <div class="flex min-w-0 items-center gap-3">
    <SchoolLogo
      :school="school"
      :failed="failed"
      @logo-error="$emit('logoError')"
    />
    <div class="min-w-0">
      <p class="truncate text-sm font-bold text-neutral-900">
        {{ school.name }}
      </p>
      <SchoolBadges :school="school" class="mt-1.5" />
      <div class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
        <span>
          {{ school['type_boys-only'] || school['type_girls-only'] ? 'Single-sex' : 'Co-ed' }}
        </span>
        <span v-if="rating !== null" class="inline-flex items-center gap-1">
          <StarIcon class="h-4 w-4 text-warning-600" aria-hidden="true" />
          {{ rating.toFixed(2) }}
        </span>
        <span class="inline-flex items-center gap-1 text-brand-700 dark:text-brand-300">
          <ReceiptPercentIcon class="h-4 w-4" aria-hidden="true" />
          Phase {{ phase }} · {{ formattedRate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReceiptPercentIcon, StarIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  school: {
    name: string
    logo_url?: string
    logo_url2?: string
    review_rating_avg?: number
    type_sap?: boolean
    type_gep?: boolean
    'type_boys-only'?: boolean
    'type_girls-only'?: boolean
    affiliations?: string
    odds?: Record<string, number | string | null>
  }
  phase: string
  failed?: boolean
}>()

defineEmits<{
  logoError: []
}>()

const rating = computed(() => {
  const value = Number(props.school.review_rating_avg)
  return Number.isFinite(value) && value > 0 ? value : null
})

const formattedRate = computed(() => {
  const value = props.school.odds?.[props.phase]
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? `${(numericValue * 100).toFixed(0)}%` : 'N/A'
})
</script>
