<template>
  <div>
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'SignupForm',
  setup() {
    const email = ref('')
    const password = ref('')
    const auth = useAuthStore()
    const router = useRouter()

    const signup = async () => {
      try {
        await auth.signup(email.value, password.value)
        router.push({ name: 'Dashboard' })
      } catch (error) {
        console.error(error)
      }
    }

    return { email, password, signup }
  }
}
</script>
