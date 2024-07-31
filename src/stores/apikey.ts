import { defineStore } from 'pinia'
import { getApiKey, rotateKey as rotateKeyCallable } from '@/firebase/data'
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
  function rotateKey() {
    const userId = useAuthStore().user!.uid
    rotateKeyCallable(userId).then((key) => {
      console.log('Key is now', key)
      if (key != null) {
        apikey.value = key
      }
  })
  }
  return { apikey, fetchKey, rotateKey }
},
{
  persist: true
}
)
