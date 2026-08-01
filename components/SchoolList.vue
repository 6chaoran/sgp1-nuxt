<template>
  <div>
    <div class="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7">
      <aside class="hidden lg:block" aria-label="School filters">
        <div class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-xl border border-neutral-200 bg-neutral-0 p-5 shadow-control">
          <SchoolFilterFields
            v-model:area="area"
            v-model:phase="phase"
            v-model:sap="sap"
            v-model:gep="gep"
            v-model:boys="boys"
            v-model:girls="girls"
            v-model:affiliated="affiliated"
            :location-status="locationStatus"
            :location-message="locationMessage"
            @request-location="requestLocation"
            @clear-location="clearLocation"
          />

          <button
            type="button"
            class="mt-3 inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300 dark:hover:text-brand-200"
            @click="resetFilters"
          >
            Clear all filters
          </button>
        </div>
      </aside>

      <div class="min-w-0">
        <section
          class="relative overflow-hidden rounded-xl border border-neutral-200 bg-[hsl(var(--color-warm-surface))] px-5 py-7 sm:px-8 sm:py-9"
          aria-labelledby="discovery-heading"
        >
          <div class="relative z-10 max-w-2xl">
            <p class="text-sm font-semibold text-brand-700 dark:text-brand-300">
              Singapore Primary 1 registration
            </p>
            <h1
              id="discovery-heading"
              class="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              Plan with past registration data
            </h1>
            <p class="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
              Spot the patterns behind past ballots. Compare schools and admission
              phases to plan your little ones’ next move with greater clarity.
            </p>
          </div>
          <img
            src="/school-planning-illustration-transparent.png"
            width="1200"
            height="600"
            class="absolute -bottom-10 right-0 hidden h-56 w-[28rem] object-contain object-right xl:block"
            alt=""
          >
        </section>

        <div class="relative mt-6">
          <UiTextField
            v-model="searchQuery"
            type="search"
            label="Search schools"
            placeholder="Search by school name, address, or area"
            clearable
            autocomplete="off"
          />
        </div>

        <div class="mt-3 flex items-end gap-3 lg:hidden">
          <UiButton
            ref="mobileFiltersTrigger"
            variant="secondary"
            class="flex-1"
            @click="openMobileFilters"
          >
            <template #leading>
              <AdjustmentsHorizontalIcon class="h-5 w-5" aria-hidden="true" />
            </template>
            Filters
            <span
              v-if="nonDefaultFilterCount"
              class="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-800 dark:bg-brand-900 dark:text-brand-200"
            >
              {{ nonDefaultFilterCount }}
            </span>
          </UiButton>
          <div class="min-w-0 flex-1">
            <UiSelectField
              v-model="sort"
              label="Sort results"
              :options="sortOptions"
            />
          </div>
        </div>

        <div
          class="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-brand-100 bg-brand-50/70 p-3 dark:border-brand-900 dark:bg-brand-950/70"
          aria-label="Active filters"
        >
          <span class="mr-1 text-sm font-semibold text-neutral-700">Active filters:</span>
          <UiFilterChip
            v-if="area !== 'All'"
            :label="`Area: ${area}`"
            removable
            @remove="area = 'All'"
          />
          <UiBadge v-else variant="neutral">All areas</UiBadge>
          <UiFilterChip
            v-if="phase !== defaultPhase"
            :label="`Admission phase: ${phase}`"
            removable
            @remove="phase = defaultPhase"
          />
          <UiBadge v-else variant="neutral">Phase {{ defaultPhase }}</UiBadge>
          <UiFilterChip
            v-if="sap"
            label="SAP"
            removable
            @remove="sap = false"
          />
          <UiFilterChip
            v-if="gep"
            label="GEP"
            removable
            @remove="gep = false"
          />
          <UiFilterChip
            v-if="boys"
            label="Boys"
            removable
            @remove="boys = false"
          />
          <UiFilterChip
            v-if="girls"
            label="Girls"
            removable
            @remove="girls = false"
          />
          <UiFilterChip
            v-if="affiliated"
            label="Affiliated"
            removable
            @remove="affiliated = false"
          />
          <UiFilterChip
            v-if="sort === 'distance' && locationStatus === 'ready'"
            label="Nearest first"
            removable
            @remove="sort = 'name'"
          />
          <button
            v-if="hasResettableState"
            type="button"
            class="ml-auto min-h-11 rounded-md px-2 text-sm font-semibold text-brand-700 hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300 dark:hover:text-brand-100"
            @click="resetAll"
          >
            Reset all
          </button>
        </div>

        <div class="mt-6 items-end justify-between gap-5 sm:flex">
          <div>
            <p
              class="text-lg font-bold text-neutral-900"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ resultSummary }}
            </p>
            <div class="mt-2 flex max-w-xl items-start gap-2 text-sm leading-5 text-neutral-600">
              <InformationCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <p>
                <strong class="font-semibold text-neutral-800">Historical allocation rate</strong>
                is places taken divided by applications for {{ phase }}. It
                describes a past result, not a forecast or guarantee.
              </p>
            </div>
          </div>
          <div class="mt-4 hidden w-52 shrink-0 lg:block">
            <UiSelectField
              v-model="sort"
              label="Sort results"
              :options="sortOptions"
            />
          </div>
        </div>

        <UiStatusMessage
          v-if="locationStatus === 'denied'"
          class="mt-5"
          variant="warning"
          title="Location permission was denied"
        >
          Enable location access in your browser settings, then try again.
          <template #action>
            <UiButton size="sm" variant="secondary" @click="requestLocation">
              Try location again
            </UiButton>
          </template>
        </UiStatusMessage>
        <UiStatusMessage
          v-else-if="locationStatus === 'unavailable' || locationStatus === 'error'"
          class="mt-5"
          variant="warning"
          title="Location is unavailable"
        >
          {{ locationMessage }}
          <template #action>
            <UiButton size="sm" variant="secondary" @click="requestLocation">
              Retry
            </UiButton>
          </template>
        </UiStatusMessage>

        <div
          v-if="isLoading"
          class="mt-6 space-y-3"
          role="status"
          aria-live="polite"
          aria-label="Loading schools"
        >
          <span class="sr-only">Loading school results</span>
          <div
            v-for="index in 5"
            :key="index"
            class="flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-0 p-4"
          >
            <UiSkeleton width="3rem" height="3rem" shape="circle" />
            <div class="flex-1 space-y-2">
              <UiSkeleton width="45%" height="1rem" />
              <UiSkeleton width="70%" height="0.75rem" />
            </div>
            <UiSkeleton width="4rem" height="1.5rem" />
          </div>
        </div>

        <UiStatusMessage
          v-else-if="loadError"
          class="mt-6"
          variant="error"
          title="We couldn’t load school information"
        >
          Check your connection and try again.
          <template #action>
            <UiButton size="sm" variant="secondary" @click="reloadPage">
              Reload schools
            </UiButton>
          </template>
        </UiStatusMessage>

        <UiStatusMessage
          v-else-if="sortedSchools.length === 0"
          class="mt-6"
          variant="empty"
          title="No schools match these filters"
        >
          Try a broader search, choose another area, or reset the school
          attributes.
          <template #action>
            <UiButton size="sm" variant="secondary" @click="resetAll">
              Reset search and filters
            </UiButton>
          </template>
        </UiStatusMessage>

        <div v-else class="mt-6">
          <div class="hidden xl:block">
            <div
              class="grid grid-cols-[minmax(16rem,2.4fr)_minmax(7rem,0.8fr)_minmax(13rem,1.4fr)_minmax(9rem,0.8fr)_1.5rem] gap-4 border-b border-neutral-300 px-3 pb-3 text-xs font-semibold text-neutral-600"
            >
              <span>School</span>
              <span>Area</span>
              <span>Address</span>
              <span class="text-right">
                Historical rate<br>
                <span class="font-normal">({{ phase }})</span>
              </span>
              <span class="sr-only">Open school</span>
            </div>
            <ul role="list" class="divide-y divide-neutral-200">
              <li v-for="school in sortedSchools" :key="school.sid">
                <NuxtLink
                  :to="`/schools/${school.sid}`"
                  class="group grid min-h-28 grid-cols-[minmax(16rem,2.4fr)_minmax(7rem,0.8fr)_minmax(13rem,1.4fr)_minmax(9rem,0.8fr)_1.5rem] items-center gap-4 rounded-md px-3 py-4 transition-colors hover:bg-neutral-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                >
                  <SchoolIdentity
                    :school="school"
                    :phase="phase"
                    :failed="failedLogos.has(school.sid)"
                    @logo-error="markLogoFailed(school.sid)"
                  />
                  <span class="text-sm text-neutral-600">{{ school.area }}</span>
                  <span class="text-sm leading-5 text-neutral-600">
                    {{ school.address }}
                    <span
                      v-if="distanceFor(school) !== null"
                      class="mt-1 block text-xs font-medium text-brand-700 dark:text-brand-300"
                    >
                      {{ formatDistance(distanceFor(school)) }} away
                    </span>
                  </span>
                  <span class="text-right text-lg font-semibold tabular-nums text-neutral-900">
                    {{ formatRate(rateFor(school)) }}
                  </span>
                  <ChevronRightIcon
                    class="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                    aria-hidden="true"
                  />
                </NuxtLink>
              </li>
            </ul>
          </div>

          <ul role="list" class="space-y-3 xl:hidden">
            <li v-for="school in sortedSchools" :key="school.sid">
              <NuxtLink
                :to="`/schools/${school.sid}`"
                class="block rounded-xl border border-neutral-200 bg-neutral-0 p-4 shadow-control transition-colors hover:border-brand-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
              >
                <div class="flex items-start gap-3">
                  <SchoolLogo
                    :school="school"
                    :failed="failedLogos.has(school.sid)"
                    @logo-error="markLogoFailed(school.sid)"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <h2 class="text-sm font-bold leading-5 text-neutral-900">
                          {{ school.name }}
                        </h2>
                        <p class="mt-0.5 text-xs leading-5 text-neutral-600">
                          {{ school.area }}<span class="hidden sm:inline"> · {{ school.address }}</span>
                        </p>
                      </div>
                      <div class="shrink-0 text-right">
                        <p class="text-lg font-semibold tabular-nums text-neutral-900">
                          {{ formatRate(rateFor(school)) }}
                        </p>
                        <p class="text-[0.6875rem] font-medium text-neutral-500">
                          {{ phase }} historical
                        </p>
                      </div>
                    </div>
                    <SchoolBadges :school="school" class="mt-2" />
                    <p
                      v-if="distanceFor(school) !== null"
                      class="mt-1 text-xs font-semibold text-brand-700 dark:text-brand-300"
                    >
                      {{ formatDistance(distanceFor(school)) }} away
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <TransitionRoot
      as="template"
      :show="mobileFiltersOpen"
      @after-leave="restoreMobileFiltersFocus"
    >
      <Dialog
        as="div"
        class="fixed inset-0 z-50 lg:hidden"
        @close="mobileFiltersOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity duration-normal ease-product"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity duration-normal ease-product"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-neutral-950/40" />
        </TransitionChild>
        <div class="fixed inset-0 flex items-end sm:items-stretch sm:justify-end">
          <TransitionChild
            as="template"
            enter="transition-transform duration-slow ease-product"
            enter-from="translate-y-full sm:translate-x-full sm:translate-y-0"
            enter-to="translate-y-0 sm:translate-x-0"
            leave="transition-transform duration-slow ease-product"
            leave-from="translate-y-0 sm:translate-x-0"
            leave-to="translate-y-full sm:translate-x-full sm:translate-y-0"
          >
            <DialogPanel class="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-neutral-0 p-5 shadow-overlay sm:h-full sm:max-h-none sm:max-w-sm sm:rounded-none">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle as="h2" class="text-lg font-bold text-neutral-900">
                    Filter schools
                  </DialogTitle>
                  <DialogDescription class="mt-1 text-sm text-neutral-600">
                    Narrow results by area, phase, and school attributes.
                  </DialogDescription>
                </div>
                <UiIconButton label="Close filters" @click="mobileFiltersOpen = false">
                  <XMarkIcon />
                </UiIconButton>
              </div>

              <div class="mt-6">
                <SchoolFilterFields
                  v-model:area="area"
                  v-model:phase="phase"
                  v-model:sap="sap"
                  v-model:gep="gep"
                  v-model:boys="boys"
                  v-model:girls="girls"
                  v-model:affiliated="affiliated"
                  :location-status="locationStatus"
                  :location-message="locationMessage"
                  @request-location="requestLocation"
                  @clear-location="clearLocation"
                />
              </div>

              <div class="sticky bottom-0 -mx-5 mt-7 flex gap-3 border-t border-neutral-200 bg-neutral-0 px-5 pb-1 pt-4">
                <UiButton variant="secondary" class="flex-1" @click="resetFilters">
                  Clear
                </UiButton>
                <UiButton class="flex-1" @click="mobileFiltersOpen = false">
                  Show {{ sortedSchools.length }} schools
                </UiButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ref as dbRef } from 'firebase/database'
import { useDatabase, useDatabaseList } from 'vuefire'
import { getLoc, haversineDistance } from '../utils/geo'

type LocationStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'unavailable' | 'error'
type SortValue = 'name' | 'rate-desc' | 'rate-asc' | 'distance'

interface School {
  id?: string
  sid: string
  name: string
  area: string
  address: string
  logo_url?: string
  logo_url2?: string
  review_rating_avg?: number
  type_sap?: boolean
  type_gep?: boolean
  'type_girls-only'?: boolean
  'type_boys-only'?: boolean
  affiliations?: string
  odds?: Record<string, number | string | null>
  latlon?: {
    lat: number
    lon: number
  }
}

const props = withDefaults(defineProps<{
  selectedArea?: string
}>(), {
  selectedArea: 'All',
})

const defaultPhase = '2C'
const route = useRoute()
const router = useRouter()
const db = useDatabase()
const schoolsFull = useDatabaseList<School>(dbRef(db, 'school_profile'))
const isLoading = schoolsFull.pending
const loadError = schoolsFull.error

const readQuery = (key: string) => {
  const value = route.query[key]
  return Array.isArray(value) ? value[0] : value
}

const searchQuery = ref(readQuery('q') || '')
const area = ref(readQuery('area') || props.selectedArea)
const phase = ref(readQuery('phase') || defaultPhase)
const sap = ref(readQuery('sap') === '1')
const gep = ref(readQuery('gep') === '1')
const boys = ref(readQuery('boys') === '1')
const girls = ref(readQuery('girls') === '1')
const affiliated = ref(readQuery('affiliated') === '1')
const sort = ref<SortValue>((readQuery('sort') as SortValue) || 'name')
const mobileFiltersOpen = ref(false)
const locationStatus = ref<LocationStatus>('idle')
const locationErrorMessage = ref('')
const userLatitude = ref<number | null>(null)
const userLongitude = ref<number | null>(null)
const failedLogos = reactive(new Set<string>())
const syncingFromRoute = ref(false)
const mobileFiltersTrigger = ref<{ $el?: HTMLButtonElement } | null>(null)
let mobileFiltersTriggerElement: HTMLElement | null = null
let queryTimer: ReturnType<typeof setTimeout> | undefined

const schools = computed(() => (
  schoolsFull.value.filter(school => school.odds && school.sid)
))

const normalizedSearch = computed(() => searchQuery.value.trim().toLocaleLowerCase('en-SG'))

const filteredSchools = computed(() => {
  const query = normalizedSearch.value

  return schools.value.filter((school) => {
    const matchesSearch = !query || [
      school.name,
      school.address,
      school.area,
    ].some(value => value?.toLocaleLowerCase('en-SG').includes(query))

    return matchesSearch
      && (area.value === 'All' || school.area === area.value)
      && (!sap.value || Boolean(school.type_sap))
      && (!gep.value || Boolean(school.type_gep))
      && (!boys.value || Boolean(school['type_boys-only']))
      && (!girls.value || Boolean(school['type_girls-only']))
      && (!affiliated.value || (school.affiliations && school.affiliations !== '-'))
  })
})

const rateFor = (school: School) => {
  const value = school.odds?.[phase.value]
  if (value === null || value === undefined || value === '') {
    return null
  }
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : null
}

const distanceFor = (school: School) => {
  if (
    locationStatus.value !== 'ready'
    || userLatitude.value === null
    || userLongitude.value === null
    || !school.latlon
  ) {
    return null
  }
  return haversineDistance(
    userLatitude.value,
    userLongitude.value,
    school.latlon.lat,
    school.latlon.lon,
    'km',
  )
}

const sortedSchools = computed(() => (
  filteredSchools.value
    .map((school, index) => ({ school, index }))
    .sort((left, right) => {
      let comparison = 0
      if (sort.value === 'rate-desc' || sort.value === 'rate-asc') {
        const leftRate = rateFor(left.school)
        const rightRate = rateFor(right.school)
        if (leftRate === null || rightRate === null) {
          comparison = leftRate === rightRate ? 0 : leftRate === null ? 1 : -1
        } else {
          comparison = sort.value === 'rate-desc'
            ? rightRate - leftRate
            : leftRate - rightRate
        }
      } else if (sort.value === 'distance' && locationStatus.value === 'ready') {
        const leftDistance = distanceFor(left.school) ?? Number.POSITIVE_INFINITY
        const rightDistance = distanceFor(right.school) ?? Number.POSITIVE_INFINITY
        comparison = leftDistance - rightDistance
      } else {
        comparison = left.school.name.localeCompare(right.school.name, 'en-SG')
      }

      return comparison || left.index - right.index
    })
    .map(item => item.school)
))

const sortOptions = computed(() => [
  { label: 'School name', value: 'name' },
  { label: 'Highest historical rate', value: 'rate-desc' },
  { label: 'Lowest historical rate', value: 'rate-asc' },
  {
    label: locationStatus.value === 'ready' ? 'Nearest first' : 'Nearest first — enable location',
    value: 'distance',
    disabled: locationStatus.value !== 'ready',
  },
])

const nonDefaultFilterCount = computed(() => [
  area.value !== 'All',
  phase.value !== defaultPhase,
  sap.value,
  gep.value,
  boys.value,
  girls.value,
  affiliated.value,
].filter(Boolean).length)

const hasResettableState = computed(() => (
  Boolean(searchQuery.value)
  || nonDefaultFilterCount.value > 0
  || sort.value !== 'name'
))

const resultSummary = computed(() => {
  const count = sortedSchools.value.length
  return `${count} matching ${count === 1 ? 'school' : 'schools'}`
})

const formatRate = (rate: number | null) => (
  rate === null ? 'N/A' : `${(rate * 100).toFixed(0)}%`
)

const formatDistance = (distance: number | null) => {
  if (distance === null) {
    return ''
  }
  return distance < 10 ? `${distance.toFixed(1)} km` : `${Math.round(distance)} km`
}

const locationMessage = computed(() => {
  if (locationStatus.value === 'requesting') {
    return 'Waiting for your browser’s location permission…'
  }
  if (locationStatus.value === 'ready') {
    return 'Distance is calculated on this device and is not stored.'
  }
  return locationErrorMessage.value
})

const openMobileFilters = () => {
  mobileFiltersTriggerElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : mobileFiltersTrigger.value?.$el || null
  mobileFiltersOpen.value = true
}
const restoreMobileFiltersFocus = () => {
  const trigger = mobileFiltersTriggerElement || mobileFiltersTrigger.value?.$el
  window.setTimeout(() => {
    if (trigger?.isConnected) {
      trigger.focus()
    }
  }, 0)
  mobileFiltersTriggerElement = null
}

const markLogoFailed = (sid: string) => {
  failedLogos.add(sid)
}

const requestLocation = async () => {
  locationStatus.value = 'requesting'
  locationErrorMessage.value = ''
  try {
    const { latitude, longitude } = await getLoc()
    userLatitude.value = latitude
    userLongitude.value = longitude
    locationStatus.value = 'ready'
    sort.value = 'distance'
  } catch (error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error
      ? Number((error as { code?: number }).code)
      : null

    if (code === 1) {
      locationStatus.value = 'denied'
      locationErrorMessage.value = 'Location permission was denied.'
    } else if (code === 2) {
      locationStatus.value = 'unavailable'
      locationErrorMessage.value = 'Your browser could not determine your location.'
    } else {
      locationStatus.value = 'error'
      locationErrorMessage.value = 'We could not access your location. Please try again.'
    }
  }
}

const clearLocation = () => {
  userLatitude.value = null
  userLongitude.value = null
  locationStatus.value = 'idle'
  locationErrorMessage.value = ''
  if (sort.value === 'distance') {
    sort.value = 'name'
  }
}

const resetFilters = () => {
  area.value = 'All'
  phase.value = defaultPhase
  sap.value = false
  gep.value = false
  boys.value = false
  girls.value = false
  affiliated.value = false
}

const resetAll = () => {
  searchQuery.value = ''
  sort.value = 'name'
  resetFilters()
}

const reloadPage = () => {
  window.location.reload()
}

const routeState = () => ({
  q: readQuery('q') || '',
  area: readQuery('area') || props.selectedArea,
  phase: readQuery('phase') || defaultPhase,
  sap: readQuery('sap') === '1',
  gep: readQuery('gep') === '1',
  boys: readQuery('boys') === '1',
  girls: readQuery('girls') === '1',
  affiliated: readQuery('affiliated') === '1',
  sort: (readQuery('sort') as SortValue) || 'name',
})

const applyRouteState = () => {
  syncingFromRoute.value = true
  const state = routeState()
  searchQuery.value = state.q
  area.value = state.area
  phase.value = state.phase
  sap.value = state.sap
  gep.value = state.gep
  boys.value = state.boys
  girls.value = state.girls
  affiliated.value = state.affiliated
  sort.value = state.sort === 'distance' && locationStatus.value !== 'ready'
    ? 'name'
    : state.sort
  nextTick(() => {
    syncingFromRoute.value = false
  })
}

const syncUrl = () => {
  if (syncingFromRoute.value) {
    return
  }
  clearTimeout(queryTimer)
  queryTimer = setTimeout(() => {
    const query: Record<string, string> = {}
    if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
    if (area.value !== 'All') query.area = area.value
    if (phase.value !== defaultPhase) query.phase = phase.value
    if (sap.value) query.sap = '1'
    if (gep.value) query.gep = '1'
    if (boys.value) query.boys = '1'
    if (girls.value) query.girls = '1'
    if (affiliated.value) query.affiliated = '1'
    if (sort.value !== 'name') query.sort = sort.value

    router.replace({ query })
  }, 180)
}

watch(
  [searchQuery, area, phase, sap, gep, boys, girls, affiliated, sort],
  syncUrl,
)
watch(
  () => route.fullPath.split('#')[0],
  applyRouteState,
)

onBeforeUnmount(() => clearTimeout(queryTimer))
</script>
