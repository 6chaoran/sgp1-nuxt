<template>
  <div>
    <div
      ref="chartContainer"
      class="h-80 w-full sm:h-96"
      role="img"
      :aria-label="chartLabel"
    />

    <details class="mt-4 border-t border-neutral-200 pt-4">
      <summary class="flex min-h-11 cursor-pointer items-center rounded-md text-sm font-semibold text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:text-brand-300">
        View chart data as a table
      </summary>
      <div class="mt-3 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-semibold text-neutral-600">
            <tr>
              <th class="px-3 py-2.5" scope="col">Year</th>
              <th
                v-for="phase in displayedPhases"
                :key="phase"
                class="px-3 py-2.5 text-right"
                scope="col"
              >
                Phase {{ phase }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr v-for="row in tableRows" :key="row.year">
              <th class="px-3 py-2.5 text-left font-semibold text-neutral-800" scope="row">
                {{ row.year }}
              </th>
              <td
                v-for="phase in displayedPhases"
                :key="phase"
                class="px-3 py-2.5 text-right tabular-nums text-neutral-600"
              >
                {{ formatRate(row.values[phase]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

defineOptions({ name: 'HistoricalChart' })

interface BallotRow {
  phase: string
  applied?: string | number
  taken?: string | number
}

type BallotHistoryRecord = Record<string, Record<string, BallotRow>>

const props = defineProps<{
  data: BallotHistoryRecord
  phaseFocus: string
}>()

echarts.use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
])

const chartContainer = ref<HTMLDivElement | null>(null)
const compactLayout = ref(false)
const prefersDark = ref(false)
let chart: ReturnType<typeof echarts.init> | null = null
let resizeObserver: ResizeObserver | null = null
let themeObserver: MutationObserver | null = null

const normalizePhase = (phase: string) => phase.replace(/^Phase\s+/i, '')
const years = computed(() => Object.keys(props.data || {}).sort((a, b) => Number(a) - Number(b)))
const displayedPhases = computed(() => (
  props.phaseFocus === 'all'
    ? ['2A', '2B', '2C']
    : [props.phaseFocus]
))
const phaseLineStyles: Record<string, 'solid' | 'dashed' | 'dotted'> = {
  '2A': 'dotted',
  '2B': 'dashed',
  '2C': 'solid',
}
const phaseSymbols: Record<string, 'circle' | 'diamond' | 'rect'> = {
  '2A': 'circle',
  '2B': 'diamond',
  '2C': 'rect',
}

const numericValue = (value: unknown) => {
  if (value === null || value === undefined || value === '' || value === '-') {
    return null
  }
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const allocationRate = (row: BallotRow) => {
  const applied = numericValue(row.applied)
  const taken = numericValue(row.taken)
  if (applied === null || applied <= 0 || taken === null) {
    return null
  }
  return taken / applied
}

const rateFor = (year: string, phase: string) => {
  const rows = Object.values(props.data?.[year] || {})
  const candidatePhases = phase === '2A'
    ? ['2A', '2A(1)', '2A(2)']
    : [phase]
  const row = candidatePhases
    .map(candidate => rows.find(item => normalizePhase(item.phase) === candidate))
    .find(Boolean)
  return row ? allocationRate(row) : null
}

const tableRows = computed(() => years.value.map(year => ({
  year,
  values: Object.fromEntries(
    displayedPhases.value.map(phase => [phase, rateFor(year, phase)]),
  ) as Record<string, number | null>,
})))

const formatRate = (value: number | null) => value === null ? 'N/A' : `${Math.round(value * 100)}%`
const chartLabel = computed(() => (
  `Historical allocation rates from ${years.value[0] || 'the first recorded year'} to ${years.value.at(-1) || 'the latest recorded year'} for ${displayedPhases.value.map(phase => `Phase ${phase}`).join(', ')}.`
))

const chartOptions = computed(() => {
  if (import.meta.server) {
    return {}
  }

  const rootStyles = getComputedStyle(document.documentElement)
  const colorToken = (name: string) => `hsl(${rootStyles.getPropertyValue(name).trim()})`

  return {
    backgroundColor: prefersDark.value ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
    color: [
      colorToken('--color-chart-1'),
      colorToken('--color-chart-2'),
      colorToken('--color-chart-3'),
      colorToken('--color-chart-4'),
    ],
    textStyle: {
      color: colorToken('--color-neutral-700'),
      fontFamily: rootStyles.getPropertyValue('--font-sans').trim(),
    },
    animationDuration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        triggerEmphasis: false,
      },
      valueFormatter: (value: unknown) => (
        typeof value === 'number' ? `${Math.round(value * 100)}%` : 'N/A'
      ),
    },
    grid: {
      left: compactLayout.value ? 0 : 48,
      right: compactLayout.value ? 0 : 20,
      top: 24,
      bottom: 56,
      containLabel: true,
    },
    legend: {
      data: displayedPhases.value.map(phase => `Phase ${phase}`),
      bottom: 4,
      textStyle: {
        color: colorToken('--color-neutral-600'),
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: years.value,
      axisLine: {
        lineStyle: { color: colorToken('--color-neutral-300') },
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      interval: 0.25,
      axisLabel: {
        formatter: (value: number) => `${Math.round(value * 100)}%`,
      },
      splitLine: {
        lineStyle: { color: colorToken('--color-chart-grid') },
      },
    },
    series: displayedPhases.value.map(phase => ({
      name: `Phase ${phase}`,
      data: years.value.map(year => rateFor(year, phase)),
      type: 'line',
      smooth: 0.25,
      connectNulls: false,
      symbol: phaseSymbols[phase] || 'circle',
      symbolSize: 7,
      lineStyle: {
        width: 3,
        type: phaseLineStyles[phase] || 'solid',
      },
      emphasis: { disabled: true },
    })),
  }
})

const renderChart = () => {
  if (!chartContainer.value) {
    return
  }
  if (!chart) {
    chart = echarts.init(chartContainer.value)
  }
  chart.setOption(chartOptions.value, true)
}

const resizeChart = () => {
  if (!chartContainer.value) {
    return
  }
  compactLayout.value = chartContainer.value.clientWidth < 640
  chart?.resize()
}

const updateColorScheme = () => {
  prefersDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  updateColorScheme()
  themeObserver = new MutationObserver(updateColorScheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  resizeChart()
  renderChart()
  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(resizeChart)
    resizeObserver.observe(chartContainer.value)
  }
})

watch(chartOptions, renderChart, { deep: true })

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>
