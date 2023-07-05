<template>
  <header>
    <nav>
      <a href="/">
        <img src="@/assets/media/logo/logo.png" alt="Logo" height="30" class="me-2" />
        ActivityWatch Leaderboard
      </a>
      <div class="pull-right float-right">
        <ul v-if="user">
          <li>
            <span>Welcome, {{ user.email }}</span>
            <button @click="handleLogout">Logout</button>
          </li>
        </ul>
        <ul v-else>
          <li class="mx-3">
            <router-link to="/login">Login</router-link>
          </li>
          <li>
            <router-link to="/signup">Signup</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AWLHeader',
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
header {
  margin-bottom: 1em;
}

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
