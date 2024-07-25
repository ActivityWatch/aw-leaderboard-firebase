<template>
  <AWLHeader />
  <div>
    <h1>API Key</h1>
    <p>Your API key is: {{ apiKey }} <ContentCopyIcon @click ="copyApikey"/></p>
    <SnackBarVue :message="snackbarMessage" ref="snackbar"/>
  </div>
  <!--TODO: Add rotate key -->
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
  snackbarMessage.value = 'ApiKey copied to clipboard'
}

</script>

<style scoped></style>
