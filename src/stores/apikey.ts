import { defineStore } from 'pinia'
import { getApiKey } from '@/firebase/data'
import { useAuthStore } from './auth'
import { ref } from 'vue'

export const useApiKeyStore = defineStore('apikey', () => {
  const apikey = ref(null as string | null)
  async function fetchKey() {
    const userId = useAuthStore().user!.uid
    getApiKey(userId).then((key) => {
    apikey.value = key;
    })
  }

  return { apikey, fetchKey }
})
