<template>
  <AWLHeader />
  <div>
    <h1>API Key</h1>
    <p>Your API key is: {{ apiKey }} <ContentCopyIcon @click="copyApikey" /></p>
    <SnackBarVue :message="snackbarMessage" ref="snackbar" />
    <button @click="rotateKey">Rotate Key</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AWLHeader from '@/components/Header.vue'
import { useApiKeyStore } from '@/stores/apikey'
import ContentCopyIcon from 'vue-material-design-icons/ContentCopy.vue'
import SnackBarVue from './SnackBar.vue'

const snackbarMessage = ref('')

const store = useApiKeyStore()
store.fetchKey()
const apiKey = computed(() => store.apikey)

const copyApikey = () => {
  if (!apiKey.value) return
  navigator.clipboard.writeText(apiKey.value)
  setTimeout(() => {
    snackbarMessage.value = ''
  }, 3000)
  snackbarMessage.value = 'ApiKey copied to clipboard'
}

const rotateKey = () => {
  store.rotateKey()
  setTimeout(() => {
    snackbarMessage.value = ''
  }, 3000)
  snackbarMessage.value = 'ApiKey rotated'
}
</script>

<style scoped></style>
