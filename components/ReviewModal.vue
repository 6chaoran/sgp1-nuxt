<template>
  <TransitionRoot
    as="template"
    :show="appStore.showReviewModel"
    @after-leave="restoreFocus"
  >
    <Dialog
      as="div"
      class="relative z-50"
      @close="closeDialog"
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
        <div class="fixed inset-0 bg-neutral-950/45" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto p-4 sm:p-6">
        <div class="flex min-h-full items-center justify-center">
          <TransitionChild
            as="template"
            enter="transition duration-normal ease-product"
            enter-from="translate-y-2 scale-95 opacity-0"
            enter-to="translate-y-0 scale-100 opacity-100"
            leave="transition duration-normal ease-product"
            leave-from="translate-y-0 scale-100 opacity-100"
            leave-to="translate-y-2 scale-95 opacity-0"
          >
            <DialogPanel
              class="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-neutral-0 text-left shadow-overlay sm:max-h-[min(44rem,calc(100vh-3rem))]"
            >
              <div class="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
                <div>
                  <DialogTitle as="h2" class="text-lg font-bold text-neutral-900">
                    Google Maps reviews
                  </DialogTitle>
                  <p class="mt-1 text-sm leading-5 text-neutral-600">
                    General reviews are separate from registration history.
                  </p>
                </div>
                <UiIconButton label="Close reviews" @click="closeDialog">
                  <XMarkIcon />
                </UiIconButton>
              </div>

              <div class="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
                <ul role="list" class="divide-y divide-neutral-200">
                  <li
                    v-for="(review, index) in reviews"
                    :key="review.id || `${review.username}-${index}`"
                    class="space-y-2 py-5 text-left text-sm text-neutral-600"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <strong class="min-w-0 break-words text-neutral-800">
                        {{ review.username || 'Google reviewer' }}
                      </strong>
                      <span class="shrink-0 text-xs text-neutral-500">
                        {{ datediff(review.timestamp) }}
                      </span>
                    </div>
                    <div
                      class="flex items-center gap-0.5"
                      role="img"
                      :aria-label="`${review.rating || 0} out of 5 stars`"
                    >
                      <StarIcon
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'h-4 w-4',
                          Number(review.rating) >= star ? 'text-warning-600' : 'text-neutral-300',
                        ]"
                        aria-hidden="true"
                      />
                    </div>
                    <p class="break-words leading-6">{{ review.caption }}</p>
                  </li>
                </ul>
              </div>

              <div class="border-t border-neutral-200 bg-neutral-50 px-5 py-3 sm:flex sm:justify-end sm:px-6">
                <UiButton block variant="secondary" class="sm:w-auto" @click="closeDialog">
                  Close
                </UiButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { StarIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Review {
  id?: string
  username?: string
  rating?: string | number
  timestamp?: string | number
  caption?: string
}

withDefaults(defineProps<{
  schoolId?: string
  reviews?: Review[]
}>(), {
  schoolId: '',
  reviews: () => [],
})

const appStore = useAppStore()
let triggerElement: HTMLElement | null = null
const closeDialog = () => {
  appStore.showReviewModel = false
}
const restoreFocus = () => {
  const trigger = triggerElement
  window.setTimeout(() => {
    if (trigger?.isConnected) {
      trigger.focus()
    }
  }, 0)
  triggerElement = null
}

watch(() => appStore.showReviewModel, (isOpen) => {
  if (isOpen && document.activeElement instanceof HTMLElement) {
    triggerElement = document.activeElement
  }
})

const datediff = (value: string | number | undefined) => {
  if (!value) {
    return 'Date unavailable'
  }

  const timestamp = new Date(value)
  if (Number.isNaN(timestamp.getTime())) {
    return 'Date unavailable'
  }

  const elapsedDays = Math.max(
    0,
    Math.floor((Date.now() - timestamp.getTime()) / 86_400_000),
  )
  if (elapsedDays < 7) {
    return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`
  }
  if (elapsedDays < 31) {
    const weeks = Math.max(1, Math.round(elapsedDays / 7))
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (elapsedDays < 365) {
    const months = Math.max(1, Math.round(elapsedDays / 30))
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  const years = Math.max(1, Math.round(elapsedDays / 365))
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}
</script>
