<template>
  <div>
    <nav aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        <li>
          <NuxtLink
            to="/"
            class="inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-brand-700 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300 dark:hover:text-brand-200"
          >
            <HomeIcon class="h-4 w-4" aria-hidden="true" />
            School research
          </NuxtLink>
        </li>
        <li v-if="profile.area" class="flex items-center gap-2">
          <ChevronRightIcon class="h-4 w-4 text-neutral-400" aria-hidden="true" />
          <NuxtLink
            :to="`/area/${encodeURIComponent(profile.area)}`"
            class="inline-flex min-h-11 items-center rounded-md font-semibold text-brand-700 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300 dark:hover:text-brand-200"
          >
            {{ profile.area }}
          </NuxtLink>
        </li>
        <li class="flex min-w-0 items-center gap-2" aria-current="page">
          <ChevronRightIcon class="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <span class="truncate text-neutral-500">{{ profile.name }}</span>
        </li>
      </ol>
    </nav>

    <UiCard class="mt-4 overflow-hidden p-0" elevated>
      <div class="bg-[hsl(var(--color-warm-surface))] p-5 sm:p-7">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex min-w-0 items-start gap-4 sm:gap-5">
            <SchoolLogo
              :school="profile"
              size="lg"
              :failed="logoFailed"
              @logo-error="logoFailed = true"
            />
            <div class="min-w-0">
              <p class="text-sm font-semibold text-brand-700 dark:text-brand-300">
                {{ profile.area || 'Singapore primary school' }}
              </p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                {{ profile.name }}
              </h1>
              <SchoolBadges :school="profile" class="mt-3" />
            </div>
          </div>

          <aside
            v-if="hasReviewRating"
            class="rounded-lg border border-neutral-200 bg-neutral-0/80 px-3 py-2.5 sm:px-4 sm:py-3 lg:w-52"
            aria-label="Secondary review information"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Google reviews
            </p>
            <Rating
              class="mt-1"
              :count="profile.review_num || 0"
              :avg="profile.review_rating_avg || 0"
            />
            <p class="mt-1 hidden text-xs leading-5 text-neutral-500 sm:block">
              General reviews are separate from registration history.
            </p>
          </aside>
        </div>
      </div>

      <button
        type="button"
        class="flex min-h-12 w-full items-center justify-between gap-3 border-t border-neutral-200 px-5 text-left text-sm font-semibold text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-500/20 sm:hidden dark:text-brand-300"
        :aria-expanded="schoolDetailsOpen"
        aria-controls="school-profile-details"
        @click="schoolDetailsOpen = !schoolDetailsOpen"
      >
        <span>Location and school links</span>
        <ChevronDownIcon
          class="h-5 w-5 shrink-0 transition-transform"
          :class="{ 'rotate-180': schoolDetailsOpen }"
          aria-hidden="true"
        />
      </button>

      <div
        id="school-profile-details"
        class="gap-5 p-5 sm:grid sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
        :class="schoolDetailsOpen ? 'grid' : 'hidden'"
      >
        <div>
          <div v-if="profile.address" class="flex items-start gap-3">
            <MapPinIcon class="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <div>
              <p class="text-sm font-semibold text-neutral-800">Address</p>
              <p class="mt-1 text-sm leading-6 text-neutral-600">{{ profile.address }}</p>
            </div>
          </div>

          <div
            v-if="profile.affiliations && profile.affiliations !== '-'"
            class="mt-4 flex items-start gap-3"
          >
            <BuildingLibraryIcon class="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <div>
              <p class="text-sm font-semibold text-neutral-800">Secondary-school affiliation</p>
              <p class="mt-1 text-sm leading-6 text-neutral-600">{{ profile.affiliations }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a
            v-if="profile.googlemap_url"
            :href="profile.googlemap_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-neutral-0 px-4 text-sm font-semibold text-neutral-800 shadow-control hover:bg-neutral-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
          >
            <MapIcon class="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            Open map
            <ArrowTopRightOnSquareIcon class="h-4 w-4 text-neutral-400" aria-hidden="true" />
          </a>
          <a
            v-if="profile.website"
            :href="profile.website"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-control hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
          >
            School website
            <ArrowTopRightOnSquareIcon class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowTopRightOnSquareIcon,
  BuildingLibraryIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  MapIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

interface Profile {
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

const props = defineProps<{
  profile: Profile
}>()

const logoFailed = ref(false)
const schoolDetailsOpen = ref(false)
const hasReviewRating = computed(() => (
  Number.isFinite(Number(props.profile.review_rating_avg))
  && Number(props.profile.review_num) > 0
))
</script>
