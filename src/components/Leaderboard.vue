<template>
  <AWLHeader />
  <div>
    <h1>Leaderboard</h1>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.userId">
          <td>{{ entry.userId }}</td>
          <td>{{ formatTime(entry.total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type ComputedRef } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { type ScreenTimeSummary } from '@/types'
import AWLHeader from '@/components/Header.vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const entries = ref([] as ScreenTimeSummary[] | null)
const { isAuthenticated } = useAuthStore()
if (!isAuthenticated) {
  router.push({ name: 'Login' })
}
onMounted(async () => {
  try {
    const { fetchLeaderboardData, leaderboardData } = useLeaderboardStore()
    fetchLeaderboardData()
    const leaderboardDataRef: ComputedRef = computed(() => leaderboardData)
    leaderboardDataRef.value.sort((a: { total: number }, b: { total: number }) => b.total - a.total)
    entries.value = leaderboardDataRef.value
  } catch (error) {
    console.error(error)
  }
})

// Helper method to format time in minutes and hours
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.ceil((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}
</script>

<style scoped>
table {
  width: 100%;
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: left;
}
</style>
