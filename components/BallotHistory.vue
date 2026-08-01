<template>
  <div>
    <UiStatusMessage
      v-if="filteredRows.length === 0"
      variant="empty"
      title="No history is available for this selection"
    >
      Choose another registration year or show all phases.
    </UiStatusMessage>

    <template v-else>
      <UiCard class="p-0">
        <div class="border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-lg font-bold text-neutral-900">
                {{ year }} registration results
              </h3>
              <p class="mt-1 text-sm text-neutral-600">
                {{ phaseFocus === 'all' ? 'All recorded phases' : `Phase ${phaseFocus}` }}
              </p>
            </div>
            <UiBadge class="self-start" variant="neutral">
              Historical data
            </UiBadge>
          </div>
        </div>

        <div class="hidden lg:block">
          <table class="w-full table-fixed">
            <thead class="border-b border-neutral-200 bg-neutral-50">
              <tr class="text-left text-xs font-semibold text-neutral-600">
                <th class="w-[16%] px-6 py-3.5" scope="col">Phase</th>
                <th class="w-[14%] px-3 py-3.5 text-right" scope="col">Vacancy</th>
                <th class="w-[14%] px-3 py-3.5 text-right" scope="col">Applied</th>
                <th class="w-[14%] px-3 py-3.5 text-right" scope="col">Taken</th>
                <th class="w-[18%] px-3 py-3.5 text-center" scope="col">Ballot</th>
                <th class="w-[24%] px-6 py-3.5 text-right" scope="col">
                  Historical allocation rate
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr
                v-for="row in visibleRows"
                :key="row.phase"
                class="text-sm text-neutral-600"
              >
                <th class="px-6 py-4 text-left font-bold text-neutral-900" scope="row">
                  Phase {{ displayPhase(row.phase) }}
                </th>
                <td class="px-3 py-4 text-right tabular-nums">{{ displayValue(row.vacancy) }}</td>
                <td class="px-3 py-4 text-right tabular-nums">{{ displayValue(row.applied) }}</td>
                <td class="px-3 py-4 text-right tabular-nums">{{ displayValue(row.taken) }}</td>
                <td class="px-3 py-4 text-center">
                  <UiBadge v-if="hasValue(row.ballot)" variant="warning">
                    {{ row.ballot }}
                  </UiBadge>
                  <span v-else>—</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="tabular-nums">
                    {{ formatRate(row) }}
                  </span>
                </td>
              </tr>
              <tr v-if="foldedRows.length">
                <td colspan="6" class="px-6 py-2">
                  <button
                    type="button"
                    class="flex min-h-11 w-full items-center justify-between gap-3 rounded-md text-left text-sm font-semibold text-brand-700 hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300 dark:hover:text-brand-100"
                    :aria-expanded="showRowsWithoutRate"
                    @click="showRowsWithoutRate = !showRowsWithoutRate"
                  >
                    <span>{{ foldedRowsLabel }}</span>
                    <ChevronDownIcon
                      class="h-5 w-5 shrink-0 transition-transform"
                      :class="{ 'rotate-180': showRowsWithoutRate }"
                      aria-hidden="true"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul role="list" class="divide-y divide-neutral-200 lg:hidden">
          <li v-for="row in visibleRows" :key="row.phase" class="p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-bold text-neutral-900">
                  Phase {{ displayPhase(row.phase) }}
                </p>
                <UiBadge v-if="hasValue(row.ballot)" class="mt-2" variant="warning">
                  Ballot: {{ row.ballot }}
                </UiBadge>
              </div>
              <div class="text-right">
                <p class="font-semibold tabular-nums text-neutral-900">
                  {{ formatRate(row) }}
                </p>
                <p class="mt-0.5 text-xs font-medium text-neutral-500">
                  Historical rate
                </p>
              </div>
            </div>
            <dl class="mt-4 grid grid-cols-3 gap-2">
              <div class="rounded-md bg-neutral-50 p-3">
                <dt class="text-xs font-medium text-neutral-500">Vacancy</dt>
                <dd class="mt-1 font-semibold tabular-nums text-neutral-900">
                  {{ displayValue(row.vacancy) }}
                </dd>
              </div>
              <div class="rounded-md bg-neutral-50 p-3">
                <dt class="text-xs font-medium text-neutral-500">Applied</dt>
                <dd class="mt-1 font-semibold tabular-nums text-neutral-900">
                  {{ displayValue(row.applied) }}
                </dd>
              </div>
              <div class="rounded-md bg-neutral-50 p-3">
                <dt class="text-xs font-medium text-neutral-500">Taken</dt>
                <dd class="mt-1 font-semibold tabular-nums text-neutral-900">
                  {{ displayValue(row.taken) }}
                </dd>
              </div>
            </dl>
          </li>
          <li v-if="foldedRows.length" class="px-5 py-2">
            <button
              type="button"
              class="flex min-h-11 w-full items-center justify-between gap-3 rounded-md text-left text-sm font-semibold text-brand-700 hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300 dark:hover:text-brand-100"
              :aria-expanded="showRowsWithoutRate"
              @click="showRowsWithoutRate = !showRowsWithoutRate"
            >
              <span>{{ foldedRowsLabel }}</span>
              <ChevronDownIcon
                class="h-5 w-5 shrink-0 transition-transform"
                :class="{ 'rotate-180': showRowsWithoutRate }"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </UiCard>

      <UiCard class="mt-6" aria-label="How to read these results">
        <button
          type="button"
          class="flex min-h-11 w-full items-center gap-3 rounded-md text-left sm:hidden"
          :aria-expanded="definitionsOpen"
          aria-controls="result-definitions"
          @click="definitionsOpen = !definitionsOpen"
        >
          <InformationCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <span class="flex-1 font-bold text-neutral-900">How to read these results</span>
          <ChevronDownIcon
            class="h-5 w-5 shrink-0 text-neutral-500 transition-transform"
            :class="{ 'rotate-180': definitionsOpen }"
            aria-hidden="true"
          />
        </button>

        <div class="hidden items-start gap-3 sm:flex">
          <InformationCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <h3 class="font-bold text-neutral-900">How to read these results</h3>
        </div>

        <div
          id="result-definitions"
          class="sm:block"
          :class="definitionsOpen ? 'block' : 'hidden'"
        >
          <p class="mt-3 text-sm leading-6 text-neutral-600 sm:mt-1 sm:pl-8">
            Historical allocation rate is places taken divided by applications.
            A higher past rate is not a promise of future admission.
          </p>

          <dl class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="item in metricDefinitions" :key="item.term">
              <dt class="text-sm font-semibold text-neutral-800">{{ item.term }}</dt>
              <dd class="mt-1 text-sm leading-6 text-neutral-600">{{ item.definition }}</dd>
            </div>
          </dl>

          <details class="mt-5 border-t border-neutral-200 pt-4">
            <summary class="flex min-h-11 cursor-pointer items-center rounded-md text-sm font-semibold text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300">
              Admission phases and ballot notation
            </summary>
            <div class="mt-3 text-sm leading-6 text-neutral-600">
              <ul class="list-disc space-y-2 pl-5" role="list">
              <li>
                <strong class="font-semibold text-neutral-800">Phase 1:</strong>
                For children who have a sibling studying at the school.
              </li>
              <li>
                <strong class="font-semibold text-neutral-800">Phases 2A and 2B:</strong>
                For children who meet defined priority-group criteria.
              </li>
              <li>
                <strong class="font-semibold text-neutral-800">Phase 2C:</strong>
                The main open phase, followed by Phase 2C Supplementary.
              </li>
              <li>
                <strong class="font-semibold text-neutral-800">Phase 3:</strong>
                For children who are not Singapore Citizens or Permanent Residents.
              </li>
              <li>
                <strong class="font-semibold text-neutral-800">Ballot notation:</strong>
                Preserves the group notation from the source record. For example,
                <strong class="font-semibold text-neutral-800">SC&lt;1</strong> means
                Singapore Citizen applicants living within 1 km of the school.
              </li>
              <li>
                <strong class="font-semibold text-neutral-800">Dash (—):</strong>
                No ballot notation was recorded for that phase.
              </li>
              </ul>
              <p class="mt-4 rounded-md bg-neutral-50 px-3 py-2.5">
                Eligibility rules can change. Check current MOE guidance when
                planning for an upcoming registration exercise.
              </p>
            </div>
          </details>
        </div>
      </UiCard>

      <UiCard class="mt-6" aria-labelledby="trend-heading">
        <div>
          <p class="text-sm font-semibold text-brand-700 dark:text-brand-300">Across registration years</p>
          <h3 id="trend-heading" class="mt-1 text-lg font-bold text-neutral-900">
            Historical allocation-rate trend
          </h3>
          <p class="mt-1 text-sm leading-6 text-neutral-600">
            Compare recorded rates over time. Missing points mean the dataset
            has no usable rate for that year and phase.
          </p>
        </div>
        <Chart
          class="mt-5"
          :data="ballotHistoryData"
          :phase-focus="phaseFocus"
        />
      </UiCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDownIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

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

const props = defineProps<{
  ballotHistoryData: BallotHistoryRecord
  year: string
  phaseFocus: string
}>()

const definitionsOpen = ref(false)

const phaseOrder = ['1', '2A', '2A(1)', '2A(2)', '2B', '2C', '2C(S)', '3']
const normalizePhase = (phase: string) => phase.replace(/^Phase\s+/i, '')

const rows = computed(() => {
  const selected = props.ballotHistoryData?.[String(props.year)]
  if (!selected) {
    return []
  }
  return Object.values(selected)
    .map(row => ({ ...row, phase: normalizePhase(row.phase) }))
    .sort((left, right) => (
      phaseOrder.indexOf(left.phase) - phaseOrder.indexOf(right.phase)
    ))
})

const filteredRows = computed(() => (
  props.phaseFocus === 'all'
    ? rows.value
    : rows.value.filter(row => (
        props.phaseFocus === '2A'
          ? row.phase.startsWith('2A')
          : row.phase === props.phaseFocus
      ))
))

const displayPhase = (phase: string) => phase === '2C(S)' ? '2C Supplementary' : phase
const hasValue = (value: unknown) => value !== null && value !== undefined && value !== '' && value !== '-'
const displayValue = (value: unknown) => hasValue(value) ? String(value) : '—'
const numericValue = (value: unknown) => {
  if (!hasValue(value)) {
    return null
  }
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}
const formatRate = (row: BallotRow) => {
  const applied = numericValue(row.applied)
  const taken = numericValue(row.taken)
  if (applied === null || applied <= 0 || taken === null) {
    return 'N/A'
  }
  return `${Math.round((taken / applied) * 100)}%`
}

const showRowsWithoutRate = ref(false)
const rowsWithoutRate = computed(() => (
  filteredRows.value.filter(row => formatRate(row) === 'N/A')
))
const visibleRows = computed(() => {
  if (props.phaseFocus !== 'all' || showRowsWithoutRate.value) {
    return filteredRows.value
  }
  return filteredRows.value.filter(row => formatRate(row) !== 'N/A')
})
const foldedRows = computed(() => (
  props.phaseFocus === 'all' ? rowsWithoutRate.value : []
))
const foldedRowsLabel = computed(() => {
  const count = foldedRows.value.length
  const action = showRowsWithoutRate.value ? 'Hide' : 'Show'
  return `${action} ${count} ${count === 1 ? 'phase' : 'phases'} without historical rates`
})

watch(
  [() => props.year, () => props.phaseFocus],
  () => {
    showRowsWithoutRate.value = false
  },
)

const metricDefinitions = [
  {
    term: 'Vacancy',
    definition: 'Places available at the start of the recorded phase.',
  },
  {
    term: 'Applied',
    definition: 'Applications recorded for that phase.',
  },
  {
    term: 'Taken',
    definition: 'Places allocated during the phase.',
  },
  {
    term: 'Ballot',
    definition: 'The priority group in which balloting was recorded.',
  },
  {
    term: 'Historical rate',
    definition: 'Places taken divided by applications for this past result.',
  },
  {
    term: 'Missing data',
    definition: 'A dash or N/A means no usable value is recorded.',
  },
]
</script>
