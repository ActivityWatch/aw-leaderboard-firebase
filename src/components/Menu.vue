<template>
  <div>
    <nav>
      <a href="/">
        <img src="@/assets/logo.svg" alt="Logo" height="30" />
        ActivityWatch
      </a>
      <div class="pull-right float-right">
        <ul v-if="user">
          <li>
            <span>Welcome, {{ user.email }}</span>
            <button @click="handleLogout">Logout</button>
          </li>
        </ul>
        <ul v-else>
          <li>
            <router-link to="/login">Login</router-link>
          </li>
          <li>
            <router-link to="/signup">Signup</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AWLMenu',
  setup() {
    const router = useRouter()
    const { user, logout } = useAuthStore()

    const handleLogout = async () => {
      try {
        await logout()
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    return { user, handleLogout }
  }
}
</script>

<style scoped>
nav {
  border-bottom: 1px solid #eee;
  padding: 0.5em 0em;
  display: flex;
  justify-content: space-between;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline-block;
  margin-right: 10px;
}
</style>
