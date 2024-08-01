<template>
  <canvas ref="canvasRef" width="width" height="height"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { ScreenTimeSummary } from '@/types'
import autocolors from 'chartjs-plugin-autocolors'
import { Chart as ChartJS, ArcElement, PieController } from 'chart.js'

ChartJS.register(autocolors, ArcElement, PieController)

interface Props {
  summaries: ScreenTimeSummary[] | null
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement>()

const getChartData = () => {
  const uniqueCategoriesSet: Set<string> = new Set()
  props.summaries?.forEach((summary) => {
    for (const category in summary.categoryTotals) {
      uniqueCategoriesSet.add(category)
    }
  })
  const uniqueCategories = Array.from(uniqueCategoriesSet)
  const categoryTotals: number[] = []
  for (const category of uniqueCategories) {
    const categoryTotal = props.summaries?.reduce((acc, summary) => {
      return acc + (summary.categoryTotals[category] || 0)
    }, 0)
    categoryTotals.push(categoryTotal || 0)
  }
  return {
    labels: uniqueCategories,
    datasets: [
      {
        label: 'Category time',
        data: categoryTotals
      }
    ]
  }
}

const renderChart = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ChartJS.getChart(canvas)?.destroy()

  new ChartJS(ctx, {
    type: 'pie',
    data: getChartData(),
    options: {
      responsive: true,
      plugins: {
        autocolors: {
          enabled: true,
          mode: 'data'
        }
      }
    }
  })
}

watch(
  () => props.summaries,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      renderChart()
    }
  },
  { deep: true }
)

onMounted(() => {
  renderChart()
})
</script>
