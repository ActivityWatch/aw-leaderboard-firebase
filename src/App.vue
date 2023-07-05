<template>
  <div class="container-float">
    <AWLHeader />
  </div>
  <div class="container">
    <router-view />
  </div>
  <div class="container-float">
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
  }
}
</script>
