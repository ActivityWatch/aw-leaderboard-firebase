<template>
  <div>
    <h1>Dashboard</h1>
    <p>TODO: Insert the user dashboard here</p>
    <p>Username: {{ auth.user?.displayName }}</p>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// must be logged in to see this page
export default {
  name: 'AWLDashboard',
  setup() {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      auth.logout()
      router.push({ name: 'Login' })
    }

    return { auth }
  }
}
</script>
