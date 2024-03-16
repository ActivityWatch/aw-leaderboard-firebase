<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AWLHeader />
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Logged in as {{ user.email }}</p>
    <StackedBarChart :summary="summaries" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useScreenTimeStore } from '@/stores/screentime'
import AWLHeader from '@/components/Header.vue'
import router from '@/router'
import StackedBarChart from './StackedBarChart.vue'

const { user, isAuthenticated, logout } = useAuthStore()
const { fetchSummary, summary } = useScreenTimeStore()
fetchSummary()
const summaries = summary

if (!isAuthenticated) {
  logout()
  router.push({ name: 'Login' })
}

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
