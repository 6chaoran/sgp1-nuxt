<template>
    <div class="flex flex-row">
    </div>
    <ul role="list" class="divide-y divide-gray-100">
        <li v-for="school in schools" :key="school.school_id" class="relative flex justify-between gap-x-6 py-5">

            <div class="flex gap-x-4">

                <div class="min-w-0 flex-auto">
                    <div class="mt-1 flex items-center gap-x-1.5">
                        <div class="flex-none rounded-full bg-emerald-500/20 p-1">
                            <div class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <p class="text-sm sm:text-base lfont-semibold leading-6 text-gray-900"><a :href="`/area/${school.name}`">{{ school.name }}</a></p>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-x-4">
                <div class="hidden sm:flex sm:flex-col sm:items-end">
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

const data = getAreaList()
const schools = data.filter(x => x.name != "All")
</script>