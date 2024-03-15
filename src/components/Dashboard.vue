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
import type { ChartDataset } from '@/types'
import { defineComponent, ref} from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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

const { user, isAuthenticated, logout } = useAuthStore()
const { fetchSummary, summary } = useScreenTimeStore()
const chartData = ref({
  labels: [] as string[],
  datasets: [] as ChartDataset[]
})
const colors = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)'
]
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
    data: categoryValues[category],
    backgroundColor: colors[index % colors.length]
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
