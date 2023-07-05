<template>
  <div>
    <!-- Login/signup bar -->
    <div v-if="!auth.user">
      <button @click="auth.login">Login</button>
      <button @click="auth.signup">Signup</button>
    </div>
    <div v-else>
      <p>Logged in as {{ auth.user.email }}</p>
      <button @click="logout">Logout</button>
    </div>

    <hr />

    <h1>Welcome to Dashboard</h1>
    <leaderboard></leaderboard>
    <group></group>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import Leaderboard from './Leaderboard.vue'

export default {
  name: 'AWDashboard',
  components: {
    Leaderboard
  },
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
