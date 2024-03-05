<template>
  <AWLHeader />
  <div>
    <h1>Dashboard</h1>
    <p>TODO: Insert the user dashboard here</p>
    <p v-if="user">Username: {{ user.email }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import AWLHeader from '@/components/Header.vue'
import router from '@/router'
import { defineComponent } from 'vue'

const { user, isAuthenticated, logout } = useAuthStore()

if (!isAuthenticated) {
  logout()
  router.push({ name: 'Login' })
}

defineComponent({
  components: {
    AWLHeader
  }
})
</script>