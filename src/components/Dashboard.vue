<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AWLHeader />
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Logged in as {{ user.email }}</p>
    <StackedBarChart id="chart" :summary="summaries" />
    <PieChart id="pie" :summaries="summaries" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useScreenTimeStore } from '@/stores/screentime'
import AWLHeader from '@/components/Header.vue'
import router from '@/router'
import StackedBarChart from './StackedBarChart.vue'
import PieChart from './PieChart.vue'

const { user, isAuthenticated, logout } = useAuthStore()
const { fetchSummary, summary } = useScreenTimeStore()
fetchSummary()
const summaries = summary

if (!isAuthenticated) {
  logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
/* TODO: Better styling, maybe after switching to tailwind */
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#chart {
  padding: 16px;
}
#pie {
  padding: 16px;
  width: 50%;
  height: 50%;
}
</style>
