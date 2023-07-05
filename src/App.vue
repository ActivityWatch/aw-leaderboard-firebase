<template>
  <div class="container-float">
    <AWLMenu />
  </div>
  <div class="container">
    <router-view />
  </div>
</template>

<script lang="ts">
import AWLMenu from '@/components/Menu.vue'

export default {
  name: 'App',
  components: {
    AWLMenu
  }
}
</script>
