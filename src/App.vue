<template>
  <div class="container-float">
    <AWLHeader v-if="showHeader" />
  </div>
  <div class="container">
    <router-view />
  </div>
  <div class="container">
    <AWLFooter />
  </div>
</template>

<script lang="ts">
import AWLHeader from '@/components/Header.vue'
import AWLFooter from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    AWLHeader,
    AWLFooter
  },
  computed: {
    showHeader() {
      return this.$route.name === 'Login' || this.$route.name === 'Signup'
    }
  }
}
</script>
