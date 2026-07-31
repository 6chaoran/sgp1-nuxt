<template>
  <div>
    <div
      v-if="isLoading"
      class="space-y-6"
      role="status"
      aria-live="polite"
      aria-label="Loading school history"
    >
      <span class="sr-only">Loading school history</span>
      <UiSkeleton width="14rem" height="1rem" />
      <UiCard class="space-y-4">
        <div class="flex items-center gap-4">
          <UiSkeleton width="4.5rem" height="4.5rem" shape="circle" />
          <div class="flex-1 space-y-3">
            <UiSkeleton width="45%" height="1.75rem" />
            <UiSkeleton width="65%" height="1rem" />
          </div>
        </div>
      </UiCard>
      <UiSkeleton width="100%" height="22rem" />
    </div>

    <UiStatusMessage
      v-else-if="loadError"
      variant="error"
      title="We couldn’t load this school’s history"
    >
      Check your connection and try again.
      <template #action>
        <UiButton size="sm" variant="secondary" @click="reloadPage">
          Reload school
        </UiButton>
      </template>
    </UiStatusMessage>

    <UiStatusMessage
      v-else-if="!profile"
      variant="empty"
      title="School record not found"
    >
      This school may have been renamed or removed from the dataset.
      <template #action>
        <NuxtLink
          to="/"
          class="inline-flex min-h-11 items-center rounded-md border border-neutral-300 bg-neutral-0 px-3 text-sm font-semibold text-neutral-800 shadow-control hover:bg-neutral-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
        >
          Back to school research
        </NuxtLink>
      </template>
    </UiStatusMessage>

    <template v-else>
      <SchoolProfile :profile="profile" />

      <section class="mt-7" aria-labelledby="history-heading">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold text-brand-700 dark:text-brand-300">
              Historical registration outcomes
            </p>
            <h2
              id="history-heading"
              class="mt-1 whitespace-nowrap text-lg font-bold tracking-tight text-neutral-900 sm:text-2xl"
            >
              Review results by year and phase
            </h2>
            <p class="mt-2 text-sm leading-6 text-neutral-600">
              These figures describe past registration rounds. They do not
              predict or guarantee a future outcome.
            </p>
          </div>

          <UiCard class="grid gap-4 sm:grid-cols-2 lg:w-[30rem]">
            <UiSelectField
              v-model="selectedYear"
              label="Registration year"
              :options="yearOptions"
              :disabled="yearOptions.length === 0"
            />
            <UiSelectField
              v-model="phaseFocus"
              label="Show admission phase"
              :options="phaseOptions"
            />
          </UiCard>
        </div>

        <BallotHistory
          class="mt-6"
          :ballot-history-data="ballot || {}"
          :year="selectedYear"
          :phase-focus="phaseFocus"
        />
      </section>

      <ReviewModal :school-id="id" :reviews="reviews" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref as dbRef } from 'firebase/database'
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

interface SchoolProfileRecord {
  sid?: string
  name: string
  area?: string
  address?: string
  website?: string
  googlemap_url?: string
  logo_url?: string
  logo_url2?: string
  review_num?: number
  review_rating_avg?: number
  type_sap?: boolean
  type_gep?: boolean
  'type_boys-only'?: boolean
  'type_girls-only'?: boolean
  affiliations?: string
}

interface BallotRow {
  phase: string
  year?: string | number
  vacancy?: string | number
  applied?: string | number
  taken?: string | number
  ballot?: string
  odds?: string | number
}

type BallotHistoryRecord = Record<string, Record<string, BallotRow>>

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const db = useDatabase()
const ballotState = useDatabaseObject<BallotHistoryRecord>(dbRef(db, `application_odds/${id}`))
const profileState = useDatabaseObject<SchoolProfileRecord>(dbRef(db, `school_profile/${id}`))
const reviewsState = useDatabaseList(dbRef(db, `school_review/${id}`))

const ballot = computed(() => ballotState.value || null)
const profile = computed(() => profileState.value || null)
const reviews = computed(() => reviewsState.value || [])
const isLoading = computed(() => ballotState.pending.value || profileState.pending.value)
const loadError = computed(() => ballotState.error.value || profileState.error.value)

const allYears = computed(() => (
  Object.keys(ballot.value || {}).sort((left, right) => Number(right) - Number(left))
))
const yearOptions = computed(() => allYears.value.map(year => ({
  label: year,
  value: year,
})))

const readQuery = (key: string) => {
  const value = route.query[key]
  return Array.isArray(value) ? value[0] : value
}

const selectedYear = ref(readQuery('year') || '')
const phaseFocus = ref(readQuery('phase') || 'all')
const phaseOptions = [
  { label: 'All phases', value: 'all' },
  { label: 'Phase 1', value: '1' },
  { label: 'Phase 2A', value: '2A' },
  { label: 'Phase 2B', value: '2B' },
  { label: 'Phase 2C', value: '2C' },
  { label: 'Phase 2C Supplementary', value: '2C(S)' },
  { label: 'Phase 3', value: '3' },
]

watch(allYears, (years) => {
  if (years.length > 0 && !years.includes(selectedYear.value)) {
    selectedYear.value = years[0]
  }
}, { immediate: true })

watch([selectedYear, phaseFocus], () => {
  const query: Record<string, string> = {}
  if (selectedYear.value && selectedYear.value !== allYears.value[0]) {
    query.year = selectedYear.value
  }
  if (phaseFocus.value !== 'all') {
    query.phase = phaseFocus.value
  }

  const currentYear = readQuery('year') || ''
  const currentPhase = readQuery('phase') || ''
  if (
    currentYear === (query.year || '')
    && currentPhase === (query.phase || '')
  ) {
    return
  }
  router.replace({ query })
})

watch(() => route.fullPath, () => {
  const routeYear = readQuery('year')
  const routePhase = readQuery('phase')
  selectedYear.value = routeYear && allYears.value.includes(routeYear)
    ? routeYear
    : allYears.value[0] || ''
  phaseFocus.value = phaseOptions.some(option => option.value === routePhase)
    ? routePhase || 'all'
    : 'all'
})

const reloadPage = () => window.location.reload()
const schoolName = computed(() => profile.value?.name || 'Primary school')

useSeoMeta({
  title: computed(() => `${schoolName.value} ballot history`),
  description: computed(() => `Review historical Primary 1 ballot information for ${schoolName.value}, including registration years and admission phases.`),
  ogTitle: computed(() => `${schoolName.value} ballot history | SGP1`),
  ogDescription: computed(() => `Explore past Primary 1 registration outcomes for ${schoolName.value}.`),
})
</script>
