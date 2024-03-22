<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button class="float-right" type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useScreenTimeStore } from '@/stores/screentime'
import { useLeaderboardStore } from '@/stores/leaderboard'

export default {
  name: 'AWLLoginForm',
  setup() {
    const email = ref('')
    const password = ref('')
    const auth = useAuthStore()
    const router = useRouter()
    if (auth.isAuthenticated) {
      router.push({ name: 'Dashboard' })
    } else {
      useScreenTimeStore().resetStore()
      useLeaderboardStore().resetStore()
    }
    const login = async () => {
      try {
        await auth.login(email.value, password.value)
        router.push({ name: 'Dashboard' })
      } catch (error) {
        console.error(error)
      }
    }

    return { email, password, login }
  }
}
</script>
