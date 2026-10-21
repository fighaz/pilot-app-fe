<script setup lang="ts">
import { computed } from 'vue'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, type Plugin, type TooltipItem } from 'chart.js'
import { Line } from 'vue-chartjs'
import type { SummaryPoint } from '~/types/api'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  points: SummaryPoint[]
  limit: number
  yMax: number
  today: string
}>()

const labels = computed(() => props.points.map((point) => point.date.slice(8)))
const values = computed(() => props.points.map((point) => point.rollingSum))
const todayIndex = computed(() => props.points.findIndex((point) => point.date === props.today))

/** Draws a subtle vertical marker behind the "today" column. */
const todayMarkerPlugin: Plugin<'line'> = {
  id: 'todayMarker',
  beforeDatasetsDraw(chart) {
    const index = todayIndex.value
    if (index < 0) return
    const { ctx, chartArea, scales } = chart
    const x = scales.x.getPixelForValue(index)
    ctx.save()
    ctx.strokeStyle = 'rgba(14, 33, 56, 0.18)'
    ctx.setLineDash([4, 4])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.bottom)
    ctx.stroke()
    ctx.restore()
  },
}

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Rolling sum',
      data: values.value,
      borderColor: '#22C5E8',
      backgroundColor: (context: { chart: Chart }) => {
        const { ctx, chartArea } = context.chart
        if (!chartArea) return 'rgba(34, 197, 232, 0.15)'
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(34, 197, 232, 0.28)')
        gradient.addColorStop(1, 'rgba(34, 197, 232, 0.02)')
        return gradient
      },
      fill: true,
      tension: 0.35,
      borderWidth: 2.5,
      pointRadius: 2.5,
      pointHoverRadius: 5,
      pointBackgroundColor: '#22C5E8',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
    },
    {
      label: 'Limit',
      data: props.points.map(() => props.limit),
      borderColor: '#E63757',
      borderWidth: 2,
      borderDash: [6, 5],
      pointRadius: 0,
      pointHitRadius: 0,
      fill: false,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 8 } },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0E2138',
      padding: 10,
      cornerRadius: 10,
      titleFont: { weight: 700 as const, size: 12 },
      bodyFont: { size: 12 },
      displayColors: false,
      filter: (item: { datasetIndex: number }) => item.datasetIndex === 0,
      callbacks: {
        title: (items: TooltipItem<'line'>[]) => {
          const point = props.points[items[0]?.dataIndex]
          return point ? formatShortDate(point.date) : ''
        },
        label: (item: TooltipItem<'line'>) =>
          `${(item.parsed.y ?? 0).toFixed(1)} hours (rolling window)`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { color: '#E5E7EB' },
      ticks: {
        color: '#6B7280',
        font: { size: 10, weight: 600 },
        maxRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
      suggestedMax: props.yMax,
      grid: { color: 'rgba(14, 33, 56, 0.06)' },
      border: { display: false },
      ticks: {
        color: '#6B7280',
        font: { size: 10, weight: 600 },
        maxTicksLimit: 5,
        callback: (value: string | number) => `${value}`,
      },
    },
  },
}))
</script>

<template>
  <div class="chart-wrap">
    <ClientOnly>
      <div class="chart-area">
        <Line :data="chartData" :options="chartOptions" :plugins="[todayMarkerPlugin]" />
      </div>
      <template #fallback>
        <div class="chart-skeleton skeleton" />
      </template>
    </ClientOnly>
    <div class="chart-legend">
      <span class="legend-item"><i class="dot accent" /> Rolling sum</span>
      <span class="legend-item"><i class="dot limit" /> Limit {{ limit }} h</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-wrap {
  height: 240px;
  display: flex;
  flex-direction: column;
}

.chart-area {
  flex: 1;
  min-height: 0;
  position: relative;
}

.chart-skeleton {
  width: 100%;
  flex: 1;
}

.chart-legend {
  display: flex;
  gap: 14px;
  justify-content: center;
  padding-top: 8px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
}

.dot {
  width: 10px;
  height: 3px;
  border-radius: 2px;

  &.accent {
    background: #22c5e8;
  }

  &.limit {
    background: #e63757;
  }
}
</style>
