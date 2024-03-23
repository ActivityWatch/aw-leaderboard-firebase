<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script lang="ts" setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import autocolors from 'chartjs-plugin-autocolors'
import { Bar } from 'vue-chartjs'
import type { ChartDataset } from '@/types'
import type { ScreenTimeSummary } from '@/types'
import { ref } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, autocolors)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  },
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}

const chartData = ref({
  labels: [] as string[],
  datasets: [] as ChartDataset[]
})

const props = defineProps({
  summary: {
    type: Array as () => ScreenTimeSummary[] | null,
    required: true
  }
})
const summaries = ref(props.summary)

const uniqueDates = Array.from(new Set(summaries.value?.map((summary) => summary?.date)))
const uniqueDatesSorted = uniqueDates.sort((a, b) => {
  const dateA = new Date(a)
  const dateB = new Date(b)
  return dateA.getTime() - dateB.getTime()
})
const uniqueWeekDays = uniqueDatesSorted.map((date) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', { weekday: 'short' })
})
const uniqueCategoriesSet: Set<string> = new Set()
summaries.value?.forEach((summary) => {
  for (const category in summary?.categoryTotals) {
    uniqueCategoriesSet.add(category)
  }
})
const uniqueCategories = Array.from(uniqueCategoriesSet)
chartData.value.labels = uniqueWeekDays
const categoryValues: { [key: string]: number[] } = {}

uniqueCategories.forEach((category) => {
  categoryValues[category] = new Array(uniqueDatesSorted.length).fill(0)
})

summaries.value?.forEach((summary) => {
  for (const category in summary?.categoryTotals) {
    const dateIndex = uniqueDatesSorted.indexOf(summary?.date)
    categoryValues[category][dateIndex] = summary?.categoryTotals[category]
  }
})
chartData.value.datasets = uniqueCategories.map((category) => {
  return {
    label: category,
    data: categoryValues[category]
  }
})
</script>
