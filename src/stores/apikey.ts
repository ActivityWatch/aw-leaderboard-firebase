import { defineStore } from 'pinia'
import { getApiKey } from '@/firebase/data'
import { useAuthStore } from './auth'
import { ref } from 'vue'

export const useApiKeyStore = defineStore('apikey', () => {
  const apikey = ref(null as string | null)
  function fetchKey() {
    const userId = useAuthStore().user!.uid
    getApiKey(userId).then((key) => {
      if (key == apikey.value) return;
      apikey.value = key
    })
  }


  return { apikey, fetchKey }
},
{
  persist: true
}
)
