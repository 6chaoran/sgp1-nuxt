<template>
  <div
    v-if="activeAnnouncement"
    class="border-b border-info-100 bg-info-50 text-info-700"
    role="status"
    aria-live="polite"
  >
    <UiContainer class="flex items-start gap-3 py-3 sm:items-center">
      <InformationCircleIcon
        class="mt-0.5 h-5 w-5 shrink-0 text-info-600 sm:mt-0"
        aria-hidden="true"
      />
      <p class="text-sm leading-6">
        <span class="font-semibold">Current update:</span>
        {{ activeAnnouncement.message }}
      </p>
    </UiContainer>
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ref as dbRef } from 'firebase/database'
import { useDatabase, useDatabaseList } from 'vuefire'

interface Announcement {
  effective_date: string
  expire_date: string
  message: string
}

const singaporeTimeZone = 'Asia/Singapore'
const singaporeUtcOffsetMs = 8 * 60 * 60 * 1000
const oneDayMs = 24 * 60 * 60 * 1000
const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: singaporeTimeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const formatSingaporeDate = (date: Date) => dateFormatter.format(date)
const isIsoDate = (value: unknown): value is string => (
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
)

const db = useDatabase()
const announcements = useDatabaseList<Announcement>(dbRef(db, 'announcements'))
const currentDate = ref(formatSingaporeDate(new Date()))
let midnightTimer: number | undefined

const activeAnnouncement = computed(() => announcements.value
  .filter(announcement => (
    typeof announcement.message === 'string'
    && announcement.message.trim().length > 0
    && isIsoDate(announcement.effective_date)
    && isIsoDate(announcement.expire_date)
    && announcement.effective_date <= currentDate.value
    && announcement.expire_date >= currentDate.value
  ))
  .sort((left, right) => right.effective_date.localeCompare(left.effective_date))[0] || null)

const scheduleMidnightRefresh = () => {
  const now = Date.now()
  const nextSingaporeMidnight = (
    Math.floor((now + singaporeUtcOffsetMs) / oneDayMs) + 1
  ) * oneDayMs - singaporeUtcOffsetMs

  midnightTimer = window.setTimeout(() => {
    currentDate.value = formatSingaporeDate(new Date())
    scheduleMidnightRefresh()
  }, nextSingaporeMidnight - now + 100)
}

onMounted(scheduleMidnightRefresh)

onBeforeUnmount(() => {
  if (midnightTimer !== undefined) {
    window.clearTimeout(midnightTimer)
  }
})
</script>
