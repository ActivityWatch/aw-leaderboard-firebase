<template>
  <div>
    <h1>Dashboard</h1>
    <p>TODO: Insert the user dashboard here</p>
    <leaderboard></leaderboard>
    <group></group>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'

// TODO: must be logged in to see this page
export default {
  name: 'AWLDashboard',
  setup() {
    const auth = useAuthStore()

    const logout = async () => {
      try {
        await auth.logout()
      } catch (error) {
        console.error(error)
      }
    }

    return { auth, logout }
  }
}
</script>
