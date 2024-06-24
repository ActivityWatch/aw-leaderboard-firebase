<template>
  <AWLHeader />
  <div>
    <h1>API Key</h1>
    <p>Your API key is: {{ apiKey }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AWLHeader from '@/components/Header.vue'
import { useApiKeyStore } from '@/stores/apikey'

const store = useApiKeyStore()
store.fetchKey()
const apiKey = computed(() => store.apikey)
</script>

<style scoped></style>
