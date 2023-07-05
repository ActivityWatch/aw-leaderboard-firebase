<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AWLLoginForm',
  setup() {
    const email = ref('')
    const password = ref('')
    const auth = useAuthStore()
    const router = useRouter()

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
