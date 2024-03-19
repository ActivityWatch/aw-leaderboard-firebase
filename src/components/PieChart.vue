<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script lang="ts" setup>
import { Pie } from 'vue-chartjs'
import autocolors from 'chartjs-plugin-autocolors'
import { Chart as ChartJS, ArcElement, Tooltip, Title, plugins } from 'chart.js'
import type { ChartDataset } from '@/types'
import type { ScreenTimeSummary } from '@/types'
import { ref } from 'vue'
import type { AutocolorsOptions } from 'chartjs-plugin-autocolors'
ChartJS.register(autocolors, ArcElement, Tooltip, Title)

const props = defineProps({
  summaries: {
    type: Array as () => ScreenTimeSummary[] | null,
    required: true
  }
})
const chartData = ref({
  labels: [] as string[],
  datasets: [] as ChartDataset[]
})
const chartOptions = {
  responsive: true,
  title: {
    display: true,
    text: 'Category time'
  },
  plugins: {
    autocolors: {
      enabled: true,
      mode: 'dataset' as AutocolorsOptions['mode'],
    }
  }
}
const summaries = props.summaries
const uniqueCategoriesSet: Set<string> = new Set()
summaries?.forEach((summary) => {
  for (const category in summary.category_totals) {
    uniqueCategoriesSet.add(category)
  }
})
const uniqueCategories = Array.from(uniqueCategoriesSet)
const categoryTotals: number[] = []
for (const category of uniqueCategories) {
  const categoryTotal = summaries?.reduce((acc, summary) => {
    return acc + (summary.category_totals[category] || 0)
  }, 0)
  categoryTotals.push(categoryTotal || 0)
}

chartData.value.labels = uniqueCategories
chartData.value.datasets = [
  {
    label: 'Category time',
    data: categoryTotals
  }
]
</script>

<style scoped>
canvas {
  width: 400px;
  height: 400px;
}
</style>