<template>
  <TransitionRoot as="template" :show="appStore.showReviewModel">
    <Dialog as="div" class="relative z-10" @close="appStore.showReviewModel = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      </TransitionChild>
      <div class="fixed top-[8rem] inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="w-full transform overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900 ">Google Maps Review
                    </DialogTitle>
                    <div class="mt-2">
                      <ul role="list" class="divide-y divide-gray-100">
                        <li v-for="(review, i) in reviews" class="text-left text-sm text-gray-500 gap-x-6 py-5"
                          :key="i">
                          <v-col class="-mb-2">
                            <v-row>
                              <strong>{{ review.username }}</strong>
                              <v-spacer></v-spacer>{{ datediff(review.timestamp) }}
                            </v-row>
                            <v-row class="mb-1"><v-rating :model-value="review.rating" :size="14" :length="5"
                                color="yellow-darken-2" density="comfortable" readonly></v-rating></v-row>
                            <v-row>{{ review.caption }}</v-row>
                          </v-col>
                        </li>
                      </ul>

                    </div>
                  </div>
                </div>

              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="appStore.showReviewModel = false" ref="cancelButtonRef">Close</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
// import { $on } from 'vue-happy-bus';
const appStore = useAppStore()
const props = defineProps({
  schoolId: String,
  reviews: {
    type: Array,
    default: () => []
  }
})

const datediff = (date) => {
  const today = new Date()
  const ts = new Date(date)
  const diff = new Date(today.getTime() - ts.getTime())
  const days = diff.getUTCDate()
  const months = diff.getUTCMonth()
  const years = diff.getUTCFullYear() - 1970
  // console.log(`${ts} ${years} ${months} ${days}`)
  if (years == 0 && months == 0 && days < 7) {
    const unit = days == 1 ? 'day' : 'days'
    return `${days} ${unit} ago`
  } else if (years == 0 && months == 0) {
    const weeks = (days / 7).toFixed(0)
    const unit = weeks == 1 ? 'week' : 'weeks'
    return `${weeks} ${unit} ago`
  } else if (years == 0) {
    const unit = months == 1 ? 'month' : 'months'
    return `${months} ${unit} ago`
  } else {
    const unit = years == 1 ? 'year' : 'years'
    return `${years} ${unit} ago`
  }
}

</script>