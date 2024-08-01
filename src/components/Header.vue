<!-- eslint-disable vue/multi-word-component-names -->
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
            <LogOutIcon id="logout" @click="handleLogout">Logout</LogOutIcon>
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

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LogOutIcon from 'vue-material-design-icons/Logout.vue'

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
#logout {
  padding: 0em 0em 0em 0.5em;
}
</style>
