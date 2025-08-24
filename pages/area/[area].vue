<template>
  <div class="-mx-4">
    <v-breadcrumbs :items="items" color="indigo-darken-3" divider="/"> <span class="text-gray-600">&nbsp;&nbsp;/</span>
      <template v-slot:prepend>
        <v-icon size="small" icon="mdi-home" color="indigo-600"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
  <div>{{ schoolsForDisplay.length }} schools in total</div>
  <ul role="list" class="divide-y divide-gray-100">
    <li v-for="school in schoolsForDisplay" :key="school.school_id" class="relative flex justify-between gap-x-6 py-5">
      <div class="flex gap-x-4">
        <img class="h-12 w-12 flex-none rounded-full bg-gray-50" loading="lazy" width="48px" height="48px"
          :src="school.logo_url2 ? '/school_logo/' + school.logo_url2 : school.logo_url"
          :alt="'logo of ' + school.name" />
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
            <a :href="`/schools/${school.school_id}`">
              <span class="absolute inset-x-0 -top-px bottom-0" />
              {{ school.name }}
            </a>
            <span v-if="school['type_gep']"
              class="inline-flex items-center rounded-full bg-purple-50 mx-2 px-2 py-1 text-xs font-medium text-purple-600 ring-1 ring-inset ring-purple-500/10">
              GEP
            </span>
            <span v-if="school.type_sap"
              class="inline-flex items-center rounded-full bg-purple-50 mx-2 px-2 py-1 text-xs font-medium text-purple-600 ring-1 ring-inset ring-purple-500/10">
              SAP
            </span>
            <span v-if="school['type_girls-only']"
              class="inline-flex items-center rounded-full bg-pink-50 mx-2 px-2 py-1 text-xs font-medium text-pink-600 ring-1 ring-inset ring-pink-500/10">
              Girls
            </span>
            <span v-if="school['type_boys-only']"
              class="inline-flex items-center rounded-full bg-blue-50 mx-2 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10">
              Boys
            </span>
            <span v-if="school['affiliations']"
              class="inline-flex items-center rounded-full bg-blue-50 mx-2 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/10">
              Affil.
            </span>
            <v-tooltip v-if="school['affiliations']" activator="parent" location="right">{{ school['affiliations']
              }}</v-tooltip>

          </p>
          <div class="mt-1 flex items-center gap-x-1.5 sm:hidden">
            <div class="flex-none rounded-full bg-emerald-500/20 p-1">
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p class="text-xs leading-5 text-gray-500">{{ school.area }} |</p>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 22 20">
                <path
                  d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <!-- rating -->
              <p class="text-xs text-gray-500 dark:text-white">{{ school.review_rating_avg ?
      school.review_rating_avg.toFixed(2) : 'N/A' }}</p>
            </div>
          </div>
          <p class="mt-1 flex text-xs leading-5 text-gray-500">
            {{ school.address }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-x-4">
        <div class="hidden sm:flex sm:flex-col sm:items-end">
          <p class="text-sm leading-6 text-gray-900"><a :href="`${school.website}`"
              class="relative truncate hover:underline">{{ school.website }}</a></p>
          <p v-if="school.role" class="mt-1 text-xs leading-5 text-gray-500">
            <span
              class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
              <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx="3" cy="3" r="3" />
              </svg>
              Badge
            </span>
          </p>
          <div v-else class="mt-1 flex items-center gap-x-1.5">
            <div class="flex-none rounded-full bg-emerald-500/20 p-1">
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p class="text-xs leading-5 text-gray-500">{{ school.area }}</p>
          </div>
        </div>
        <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const route = useRoute();
const id = route.params.area
const { data } = await useFetch('/api/list_school')
const schools = ref(data.value.filter(x => x.school_id != 'juying'))
const schoolsForDisplay = computed(() => {
  return schools.value.filter((x) => x.area.toLowerCase() == id)
})

const items = computed(() => {
  return [
    {
      title: 'School List',
      disabled: false,
      href: '/',
    },
    {
      title: schoolsForDisplay.value[0].area,
      disabled: true,
      href: '/',
    }
  ]
})

</script>