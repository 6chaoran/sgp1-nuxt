<template>
  <div class="flex items-center">
    <StarIcon class="h-4 w-4 text-yellow-300" aria-hidden="true" />
    <p class="ml-1 mt-0.5 text-sm font-bold text-gray-900">{{ Number(avg) === avg ? avg.toFixed(2) : 'N/A' }}</p>
    <span v-if="count > 0" class="mx-1.5 h-1 w-1 rounded-full bg-gray-500" />
    <button
      v-if="count > 0"
      type="button"
      class="inline-flex min-h-11 items-center rounded-md px-1 text-sm font-medium text-neutral-900 underline hover:no-underline focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
      @click="showResults"
    >
      {{ count }} reviews
    </button>
  </div>

</template>
<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'

defineOptions({ name: 'SchoolRating' })

// import { $emit } from 'vue-happy-bus'
const appStore = useAppStore()
const showResults = () => appStore.toggleReviewModal()
withDefaults(defineProps<{
  count?: number
  avg?: number
}>(), {
  count: 0,
  avg: 0,
})
</script>
