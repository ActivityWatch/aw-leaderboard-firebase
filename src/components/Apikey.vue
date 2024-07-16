<template>
  <AWLHeader />
  <div>
    <h1>API Key</h1>
    <p>Your API key is: {{ apiKey }}</p>
  </div>
  <!--TODO: Add rotate key, copy to clipboard functionality -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AWLHeader from '@/components/Header.vue'
import { useApiKeyStore } from '@/stores/apikey'

const store = useApiKeyStore()
store.fetchKey()
const apiKey = computed(() => store.apikey)
</script>

<style scoped></style>
