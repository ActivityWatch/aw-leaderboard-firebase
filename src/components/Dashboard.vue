<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AWLHeader />
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Logged in as {{ user.email }}</p>
    <Bar :data="chartData" :options="chartOptions" id="chart" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useScreenTimeStore } from '@/stores/screentime'
import AWLHeader from '@/components/Header.vue'
import router from '@/router'
import { Bar } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import autocolors from 'chartjs-plugin-autocolors';
import type { ChartDataset } from '@/types'
import { defineComponent, ref} from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, autocolors)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    },
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

const { user, isAuthenticated, logout } = useAuthStore()
const { fetchSummary, summary } = useScreenTimeStore()
const chartData = ref({
  labels: [] as string[],
  datasets: [] as ChartDataset[]
})

fetchSummary()
const summaries = summary
const uniqueDates = Array.from(new Set(summaries?.map((summary) => summary?.date)))
const uniqueDatesSorted = uniqueDates.sort((a, b) => {
  const dateA = new Date(a)
  const dateB = new Date(b)
  return dateA.getTime() - dateB.getTime()
})
const uniqueCategoriesSet: Set<string> = new Set()
summaries?.forEach((summary) => {
  for (const category in summary?.category_totals) {
    uniqueCategoriesSet.add(category)
  }
})
const uniqueCategories = Array.from(uniqueCategoriesSet)
chartData.value.labels = uniqueDatesSorted
const categoryValues: { [key: string]: number[] } = {}

uniqueCategories.forEach((category) => {
  categoryValues[category] = new Array(uniqueDatesSorted.length).fill(0)
})

summaries?.forEach((summary) => {
  for (const category in summary?.category_totals) {
    const dateIndex = uniqueDatesSorted.indexOf(summary?.date)
    categoryValues[category][dateIndex] = summary?.category_totals[category]
  }
})
chartData.value.datasets = uniqueCategories.map((category, index) => {
  return {
    label: category,
    data: categoryValues[category]
  }
})

if (!isAuthenticated) {
  logout()
  router.push({ name: 'Login' })
}

defineComponent({
  components: {
    AWLHeader
  }
})
</script>

<style>
/* TODO: 
make the charts responsive
*/
#chart {
  height: 50% !important;
  width: 90% !important;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}
</style>
